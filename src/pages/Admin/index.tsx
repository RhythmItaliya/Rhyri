import * as React from "react";
import { PageHeader, PageHeaderHeading } from "../../components/PageHeader";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { format } from "date-fns";
import {
  CalendarIcon,
  DownloadIcon,
  UploadIcon,
  ReloadIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { appToast, cn } from "../../lib/utils";
import {
  exportFullDatabase,
  importFullBackup,
  readBackupFile,
  summarizeBackup,
  downloadBackup,
  type BackupSummary,
} from "../../lib/backup";
import { Calendar } from "../../components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { Skeleton } from "../../components/Skeleton";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  restrictionDate?: Timestamp | null;
  restrictionType?: "disable" | "hide";
  lastLogin?: Timestamp;
}

export function AdminPage() {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [exporting, setExporting] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const [pendingBackup, setPendingBackup] = React.useState<{
    parsed: unknown;
    summary: BackupSummary;
    fileName: string;
  } | null>(null);
  const backupInputRef = React.useRef<HTMLInputElement>(null);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("lastLogin", "desc"));
      const querySnapshot = await getDocs(q);
      const userList: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        userList.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      appToast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRestrictionDate = async (
    uid: string,
    date: Date | null,
  ) => {
    try {
      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        restrictionDate: date ? Timestamp.fromDate(date) : null,
      });

      appToast.success("Restriction date updated");
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error updating restriction date:", error);
      appToast.error("Failed to update restriction date");
    }
  };

  const handleUpdateRestrictionType = async (uid: string, type: string) => {
    try {
      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        restrictionType: type,
      });

      appToast.success("Restriction type updated to " + type);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error updating restriction type:", error);
      appToast.error("Failed to update restriction type");
    }
  };

  const handleExportDatabase = async () => {
    setExporting(true);
    try {
      const backup = await exportFullDatabase();
      downloadBackup(backup, "rhyri-full-database");
      appToast.success("Full database exported");
    } catch (error) {
      appToast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleBackupFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    try {
      const parsed = await readBackupFile(file);
      const summary = summarizeBackup(parsed);
      if (summary.type !== "full") {
        appToast.error("Please choose a full-database backup file");
        return;
      }
      setPendingBackup({ parsed, summary, fileName: file.name });
    } catch (error) {
      appToast.error(
        error instanceof Error ? error.message : "Could not read backup file",
      );
    }
  };

  const handleConfirmImport = async () => {
    if (!pendingBackup) return;
    setImporting(true);
    try {
      const { written } = await importFullBackup(pendingBackup.parsed);
      appToast.success(`Restored ${written} document${written === 1 ? "" : "s"}`);
      setPendingBackup(null);
      fetchUsers(); // profiles may have changed
    } catch (error) {
      appToast.error(error instanceof Error ? error.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-0">
      <PageHeader>
        <PageHeaderHeading>Admin: User Management</PageHeaderHeading>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Database Backup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export a complete backup of the entire database — every user&apos;s
            invoices, challans, purchase bills, clients, companies, banks and
            profiles — as a single JSON file, or restore the database from one.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleExportDatabase} disabled={exporting}>
              {exporting ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <DownloadIcon className="mr-2 h-4 w-4" />
              )}
              {exporting ? "Preparing…" : "Export full database"}
            </Button>

            <input
              ref={backupInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleBackupFileSelected}
            />
            <Button
              variant="outline"
              onClick={() => backupInputRef.current?.click()}
              disabled={importing}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Import full database
            </Button>
          </div>

          {pendingBackup ? (
            <div className="space-y-3 rounded-md border border-destructive/50 p-3">
              <div className="flex items-start gap-2 text-sm">
                <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <div>
                  <p className="font-medium">
                    This overwrites the entire live database
                  </p>
                  <p className="text-muted-foreground break-all">
                    {pendingBackup.fileName}
                  </p>
                </div>
              </div>
              <ul className="text-sm text-muted-foreground sm:max-w-xs">
                {Object.entries(pendingBackup.summary.counts).map(
                  ([name, n]) => (
                    <li key={name} className="flex justify-between">
                      <span className="capitalize">{name}</span>
                      <span>{n}</span>
                    </li>
                  ),
                )}
              </ul>
              <p className="text-xs text-muted-foreground">
                {pendingBackup.summary.total} document
                {pendingBackup.summary.total === 1 ? "" : "s"} will be written,
                overwriting any existing records with the same id. This cannot be
                undone.
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
                  {importing ? "Importing…" : "Confirm full import"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setPendingBackup(null)}
                  disabled={importing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Email</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Restrict Before Date</TableHead>
              <TableHead>Restriction Mode</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton className="w-full h-10" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.displayName || "N/A"}</TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? format(user.lastLogin.toDate(), "PPpp")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[180px] pl-3 text-left font-normal border-border bg-background",
                            !user.restrictionDate && "text-muted-foreground",
                          )}
                        >
                          {user.restrictionDate ? (
                            format(user.restrictionDate.toDate(), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            user.restrictionDate
                              ? user.restrictionDate.toDate()
                              : undefined
                          }
                          onSelect={(date) =>
                            handleUpdateRestrictionDate(user.uid, date || null)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.restrictionType || "disable"}
                      onValueChange={(value) =>
                        handleUpdateRestrictionType(user.uid, value)
                      }
                    >
                      <SelectTrigger className="w-[180px] bg-background">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disable">
                          Disable (Read-Only)
                        </SelectItem>
                        <SelectItem value="hide">Hide Completely</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      sizes="sm"
                      onClick={() =>
                        handleUpdateRestrictionDate(user.uid, null)
                      }
                    >
                      Clear Date
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
