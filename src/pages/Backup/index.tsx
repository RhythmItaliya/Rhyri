import * as React from "react";
import {
  DownloadIcon,
  UploadIcon,
  ReloadIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import { PageHeader, PageHeaderHeading } from "../../components/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { appToast } from "../../lib/utils";
import {
  exportUserData,
  importUserBackup,
  readBackupFile,
  summarizeBackup,
  downloadBackup,
  USER_DATA_COLLECTIONS,
  type BackupSummary,
} from "../../lib/backup";

// Only these collections are restored for a personal import (the user profile
// is re-synced on login and holds admin-only fields, so it is never written).
const restorableCollections = USER_DATA_COLLECTIONS as readonly string[];

export function BackupPage() {
  const { currentUser } = useAuth();
  const [exporting, setExporting] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const [pending, setPending] = React.useState<{
    parsed: unknown;
    summary: BackupSummary;
    fileName: string;
  } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    if (!currentUser) return;
    setExporting(true);
    try {
      const backup = await exportUserData(currentUser.uid);
      downloadBackup(backup, "rhyri-my-data");
      appToast.success("Exported your account data");
    } catch (error) {
      appToast.error(
        error instanceof Error ? error.message : "Export failed",
      );
    } finally {
      setExporting(false);
    }
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    try {
      const parsed = await readBackupFile(file);
      const summary = summarizeBackup(parsed);
      setPending({ parsed, summary, fileName: file.name });
    } catch (error) {
      appToast.error(
        error instanceof Error ? error.message : "Could not read backup file",
      );
    }
  };

  const handleConfirmImport = async () => {
    if (!currentUser || !pending) return;
    setImporting(true);
    try {
      const { written } = await importUserBackup(pending.parsed, currentUser.uid);
      appToast.success(`Restored ${written} record${written === 1 ? "" : "s"}`);
      setPending(null);
    } catch (error) {
      appToast.error(
        error instanceof Error ? error.message : "Import failed",
      );
    } finally {
      setImporting(false);
    }
  };

  const restorableTotal = pending
    ? Object.entries(pending.summary.counts)
        .filter(([name]) => restorableCollections.includes(name))
        .reduce((sum, [, n]) => sum + n, 0)
    : 0;

  return (
    <div className="space-y-6 px-4 md:px-0">
      <PageHeader>
        <PageHeaderHeading>Backup &amp; Data</PageHeaderHeading>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export my data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download a complete backup of your account — invoices, challans,
              purchase bills, clients, companies and banks — as a single JSON
              file you can keep safe.
            </p>
            <Button onClick={handleExport} disabled={exporting}>
              {exporting ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <DownloadIcon className="mr-2 h-4 w-4" />
              )}
              {exporting ? "Preparing…" : "Download my backup"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import my data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Restore from a backup file. Records are written into{" "}
              <span className="font-medium">your own account</span> and existing
              records with the same id are overwritten.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileSelected}
            />

            {!pending ? (
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                Choose backup file
              </Button>
            ) : (
              <div className="space-y-3 rounded-md border border-border p-3">
                <div className="flex items-start gap-2 text-sm">
                  <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div>
                    <p className="font-medium">Review before importing</p>
                    <p className="text-muted-foreground break-all">
                      {pending.fileName}
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground">
                  {Object.entries(pending.summary.counts)
                    .filter(([name]) => restorableCollections.includes(name))
                    .map(([name, n]) => (
                      <li key={name} className="flex justify-between">
                        <span className="capitalize">{name}</span>
                        <span>{n}</span>
                      </li>
                    ))}
                </ul>
                <p className="text-xs text-muted-foreground">
                  This will restore {restorableTotal} record
                  {restorableTotal === 1 ? "" : "s"} into your account and cannot
                  be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleConfirmImport}
                    disabled={importing}
                  >
                    {importing ? (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {importing ? "Importing…" : "Confirm import"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setPending(null)}
                    disabled={importing}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
