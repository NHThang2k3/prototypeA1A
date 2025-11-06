// Path: src/pages/audit-log/AuditLogPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  Download,
  Calendar as CalendarIcon,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CustomTable } from "@/components/ui/custom-table";

// Define the data type for an Audit Log entry
type AuditLogEntry = {
  ID: number;
  Action: "Create" | "Update" | "Delete" | "Login" | "Logout" | "Scan QR";
  Module: string;
  User: string;
  DateTime: string; // ISO 8601 format is best for parsing
};

// --- Helper Function to Generate More Realistic Mock Data ---
const generateMockData = (count: number): AuditLogEntry[] => {
  const data: AuditLogEntry[] = [];
  const actions: AuditLogEntry["Action"][] = [
    "Create",
    "Update",
    "Delete",
    "Login",
    "Logout",
    "Scan QR",
  ];
  const modules = [
    "Packing List",
    "Inventory Management",
    "Location Management",
    "System",
    "Issue Fabric",
    "Relax Fabric",
  ];
  const users = ["uyen.nt", "thanh.pv", "hieu.lm", "admin", "guest.user"];

  for (let i = 0; i < count; i++) {
    const date = new Date(2025, 9, 21 - Math.floor(i / 5)); // Go back a day every 5 records
    date.setHours(
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    );

    data.push({
      ID: 1001 + i,
      Action: actions[Math.floor(Math.random() * actions.length)],
      Module: modules[Math.floor(Math.random() * modules.length)],
      User: users[Math.floor(Math.random() * users.length)],
      DateTime: date.toISOString().slice(0, 19).replace("T", " "),
    });
  }
  return data;
};

// --- Action Badge Component (for styling the 'Action' column) ---
const ActionBadge: React.FC<{ action: AuditLogEntry["Action"] }> = ({
  action,
}) => {
  const colorClasses = {
    Create: "bg-green-100 text-green-800 hover:bg-green-100",
    Update: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    Delete: "bg-red-100 text-red-800 hover:bg-red-100",
    Login: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    Logout: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    "Scan QR": "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  };
  return (
    <Badge
      variant="secondary"
      className={cn("font-semibold", colorClasses[action])}
    >
      {action}
    </Badge>
  );
};

// --- Main Audit Log Page Component ---
const AuditLogPage = () => {
  // State for the full dataset
  const [auditLogData] = useState<AuditLogEntry[]>(() => generateMockData(100));

  // State for filtering
  const [filteredData, setFilteredData] =
    useState<AuditLogEntry[]>(auditLogData);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Effect to apply filters when search term or date range changes
  useEffect(() => {
    let data = auditLogData;

    // Apply search term filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      data = data.filter((log) =>
        Object.values(log).some((value) =>
          String(value).toLowerCase().includes(lowercasedTerm)
        )
      );
    }

    // Apply date range filter
    const startDate = dateRange?.from;
    const endDate = dateRange?.to;
    if (startDate && endDate) {
      // Set end date to the end of the day to include all logs on that day
      const inclusiveEndDate = new Date(endDate);
      inclusiveEndDate.setHours(23, 59, 59, 999);
      data = data.filter((log) => {
        const logDate = new Date(log.DateTime);
        return logDate >= startDate && logDate <= inclusiveEndDate;
      });
    }

    setFilteredData(data);
  }, [searchTerm, dateRange, auditLogData]);

  // Columns definition for the custom table
  const columns = useMemo<ColumnDef<AuditLogEntry>[]>(
    () => [
      {
        accessorKey: "ID",
        header: "ID",
      },
      {
        accessorKey: "Action",
        header: "Action",
        cell: ({ row }) => <ActionBadge action={row.original.Action} />,
      },
      {
        accessorKey: "Module",
        header: "Module",
      },
      {
        accessorKey: "User",
        header: "User",
      },
      {
        accessorKey: "DateTime",
        header: "Date & Time",
      },
    ],
    []
  );

  // Handler for exporting data to Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AuditLogs");
    XLSX.writeFile(workbook, "audit_log_export.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* --- Page Header --- */}
      <Card className="border-l-4 border-blue-600">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <ShieldAlert className="w-8 h-8 text-blue-600" />
          <div>
            <CardTitle className="text-2xl">Audit Log</CardTitle>
            <p className="text-muted-foreground mt-1">
              Track and record key activities within the fabric warehouse
              system.
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* --- Filters and Actions Bar --- */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Filter by date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleExportToExcel}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-5 h-5 mr-2" />
              Export to Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Data Table --- */}
      <Card>
        <CardContent className="p-4">
          <CustomTable
            columns={columns}
            data={filteredData}
            showCheckbox={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogPage;
