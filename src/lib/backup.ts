import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { db } from "./firebase";

/**
 * Backup / restore utilities.
 *
 * Everything here is data-only: Firestore documents are read as-is, their
 * Firestore-specific values (currently Timestamps) are converted to a portable
 * JSON shape, and the whole thing is wrapped in a small envelope so it can be
 * validated on the way back in. Nothing here changes how documents look in the
 * app; it just moves the exact stored data in and out.
 */

// Collections that store per-user business data. Each document carries a `uid`
// field (see fetchUser* queries which filter on where("uid","==",uid)).
export const USER_DATA_COLLECTIONS = [
  "invoices",
  "challans",
  "purchaseBills",
  "clients",
  "companies",
  "banks",
] as const;

// The user profile collection is keyed by uid (doc id === uid).
const USERS_COLLECTION = "users";

export const BACKUP_APP = "rhyri";
export const BACKUP_VERSION = 1;

export type BackupType = "user" | "full";

export interface BackupDoc {
  id: string;
  data: Record<string, unknown>;
}

export interface Backup {
  app: string;
  type: BackupType;
  version: number;
  exportedAt: string;
  uid?: string;
  collections: Record<string, BackupDoc[]>;
}

// Firestore batches allow at most 500 operations; keep a margin.
const BATCH_LIMIT = 450;

const TIMESTAMP_TAG = "__firestore_timestamp__";

interface SerializedTimestamp {
  [TIMESTAMP_TAG]: true;
  seconds: number;
  nanoseconds: number;
}

const isTimestampLike = (value: unknown): value is Timestamp =>
  value instanceof Timestamp ||
  (typeof value === "object" &&
    value !== null &&
    typeof (value as Timestamp).toDate === "function" &&
    typeof (value as Timestamp).seconds === "number" &&
    typeof (value as Timestamp).nanoseconds === "number");

const isSerializedTimestamp = (value: unknown): value is SerializedTimestamp =>
  typeof value === "object" &&
  value !== null &&
  (value as Record<string, unknown>)[TIMESTAMP_TAG] === true;

// Deep-convert Firestore values into JSON-safe values.
const serializeValue = (value: unknown): unknown => {
  if (isTimestampLike(value)) {
    return {
      [TIMESTAMP_TAG]: true,
      seconds: value.seconds,
      nanoseconds: value.nanoseconds,
    } satisfies SerializedTimestamp;
  }
  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = serializeValue(val);
    }
    return out;
  }
  return value;
};

// Deep-convert JSON-safe values back into Firestore values.
const deserializeValue = (value: unknown): unknown => {
  if (isSerializedTimestamp(value)) {
    return new Timestamp(value.seconds, value.nanoseconds);
  }
  if (Array.isArray(value)) {
    return value.map(deserializeValue);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = deserializeValue(val);
    }
    return out;
  }
  return value;
};

const serializeDoc = (id: string, data: Record<string, unknown>): BackupDoc => ({
  id,
  data: serializeValue(data) as Record<string, unknown>,
});

/**
 * Export a single user's own data: every business collection filtered to their
 * uid, plus their user profile document.
 */
export const exportUserData = async (uid: string): Promise<Backup> => {
  try {
    const collections: Record<string, BackupDoc[]> = {};

    for (const name of USER_DATA_COLLECTIONS) {
      const snapshot = await getDocs(
        query(collection(db, name), where("uid", "==", uid)),
      );
      collections[name] = snapshot.docs.map((d) =>
        serializeDoc(d.id, d.data()),
      );
    }

    const profileSnap = await getDoc(doc(db, USERS_COLLECTION, uid));
    collections[USERS_COLLECTION] = profileSnap.exists()
      ? [serializeDoc(profileSnap.id, profileSnap.data())]
      : [];

    return {
      app: BACKUP_APP,
      type: "user",
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      uid,
      collections,
    };
  } catch (error) {
    const message =
      error instanceof FirebaseError ? error.message : String(error);
    console.error("exportUserData failed:", message);
    throw new Error("Unable to export your data");
  }
};

/**
 * Export the entire database: every document in every collection. Admin only.
 */
export const exportFullDatabase = async (): Promise<Backup> => {
  try {
    const collections: Record<string, BackupDoc[]> = {};
    const allCollections = [...USER_DATA_COLLECTIONS, USERS_COLLECTION];

    for (const name of allCollections) {
      const snapshot = await getDocs(collection(db, name));
      collections[name] = snapshot.docs.map((d) =>
        serializeDoc(d.id, d.data()),
      );
    }

    return {
      app: BACKUP_APP,
      type: "full",
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      collections,
    };
  } catch (error) {
    const message =
      error instanceof FirebaseError ? error.message : String(error);
    console.error("exportFullDatabase failed:", message);
    throw new Error("Unable to export the database");
  }
};

export interface BackupSummary {
  type: BackupType;
  exportedAt: string;
  uid?: string;
  counts: Record<string, number>;
  total: number;
}

/** Validate an unknown parsed object as a Backup and summarise its contents. */
export const summarizeBackup = (parsed: unknown): BackupSummary => {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid backup file");
  }
  const backup = parsed as Partial<Backup>;
  if (backup.app !== BACKUP_APP) {
    throw new Error("This file is not a rhyri backup");
  }
  if (backup.type !== "user" && backup.type !== "full") {
    throw new Error("Unknown backup type");
  }
  if (!backup.collections || typeof backup.collections !== "object") {
    throw new Error("Backup has no collections");
  }

  const counts: Record<string, number> = {};
  let total = 0;
  for (const [name, docs] of Object.entries(backup.collections)) {
    const n = Array.isArray(docs) ? docs.length : 0;
    counts[name] = n;
    total += n;
  }

  return {
    type: backup.type,
    exportedAt: backup.exportedAt ?? "unknown",
    uid: backup.uid,
    counts,
    total,
  };
};

const commitInChunks = async (
  writes: Array<{ ref: ReturnType<typeof doc>; data: Record<string, unknown> }>,
) => {
  for (let i = 0; i < writes.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    for (const { ref, data } of writes.slice(i, i + BATCH_LIMIT)) {
      batch.set(ref, data);
    }
    await batch.commit();
  }
};

/**
 * Restore a per-user backup into the CURRENT user's account. Every business
 * document's `uid` is forced to `uid` so a user can only ever write into their
 * own account. Documents keep their original ids, so re-importing overwrites
 * rather than duplicating.
 *
 * The user profile document is intentionally NOT restored: it is re-synced from
 * auth on every login and holds admin-only fields (restrictionDate /
 * restrictionType) that a user must not be able to write. Skipping it keeps the
 * import within what the Firestore security rules allow for a normal user.
 */
export const importUserBackup = async (
  parsed: unknown,
  uid: string,
): Promise<{ written: number }> => {
  const backup = parsed as Backup;
  summarizeBackup(backup); // throws on invalid

  const writes: Array<{
    ref: ReturnType<typeof doc>;
    data: Record<string, unknown>;
  }> = [];

  for (const name of USER_DATA_COLLECTIONS) {
    const docs = backup.collections[name] ?? [];
    for (const d of docs) {
      const data = deserializeValue(d.data) as Record<string, unknown>;
      data.uid = uid; // enforce ownership
      writes.push({ ref: doc(db, name, d.id), data });
    }
  }

  try {
    await commitInChunks(writes);
    return { written: writes.length };
  } catch (error) {
    const message =
      error instanceof FirebaseError ? error.message : String(error);
    console.error("importUserBackup failed:", message);
    throw new Error("Unable to import your data");
  }
};

/**
 * Restore a full-database backup exactly as stored (ids, uids and all). Admin
 * only; this overwrites live documents, so callers must confirm first.
 */
export const importFullBackup = async (
  parsed: unknown,
): Promise<{ written: number }> => {
  const backup = parsed as Backup;
  const summary = summarizeBackup(backup);
  if (summary.type !== "full") {
    throw new Error("This is a personal backup, not a full-database backup");
  }

  const writes: Array<{
    ref: ReturnType<typeof doc>;
    data: Record<string, unknown>;
  }> = [];

  for (const [name, docs] of Object.entries(backup.collections)) {
    for (const d of docs) {
      writes.push({
        ref: doc(db, name, d.id),
        data: deserializeValue(d.data) as Record<string, unknown>,
      });
    }
  }

  try {
    await commitInChunks(writes);
    return { written: writes.length };
  } catch (error) {
    const message =
      error instanceof FirebaseError ? error.message : String(error);
    console.error("importFullBackup failed:", message);
    throw new Error("Unable to import the database");
  }
};

/** Trigger a browser download of a backup as a formatted JSON file. */
export const downloadBackup = (backup: Backup, filenamePrefix: string) => {
  const stamp = backup.exportedAt.replace(/[:.]/g, "-");
  const filename = `${filenamePrefix}-${stamp}.json`;
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

/** Read and JSON-parse an uploaded backup file. */
export const readBackupFile = async (file: File): Promise<unknown> => {
  const text = await file.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Selected file is not valid JSON");
  }
};
