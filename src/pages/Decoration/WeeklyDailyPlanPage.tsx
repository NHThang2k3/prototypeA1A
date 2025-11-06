// src/pages/damaged-goods-repair/WeeklyDailyPlanPage.tsx

import { useState } from "react";
import { ChevronLeft, ChevronRight, UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";
import { ColumnDef } from "@tanstack/react-table";

// UI Components
import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/ui/custom-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
type Job = {
  id: number;
  po: string;
  style: string;
  decoration: string;
  qty: number;
};

type JobWithDay = Job & { day: string };

type ExcelRow = {
  date: string;
  po: string;
  style: string;
  decoration: string;
  qty: number;
};

// =============================================================================
// MOCK DATA
// =============================================================================
const weeklyJobsData: Record<string, Job[]> = {
  "Monday, Oct 23": [
    {
      id: 1,
      po: "PO12345",
      style: "STYLE-A01",
      decoration: "Heat Press",
      qty: 1200,
    },
    {
      id: 2,
      po: "PO12347",
      style: "STYLE-C03",
      decoration: "Pad-Print",
      qty: 2500,
    },
  ],
  "Tuesday, Oct 24": [
    {
      id: 3,
      po: "PO12345",
      style: "STYLE-A01",
      decoration: "Heat Press",
      qty: 1500,
    },
    {
      id: 4,
      po: "PO12348",
      style: "STYLE-D04",
      decoration: "Bonding",
      qty: 800,
    },
  ],
  "Wednesday, Oct 25": [
    {
      id: 5,
      po: "PO12346",
      style: "STYLE-B02",
      decoration: "Embroidery",
      qty: 1000,
    },
  ],
  "Thursday, Oct 26": [
    {
      id: 6,
      po: "PO12349",
      style: "STYLE-E05",
      decoration: "Embroidery",
      qty: 2000,
    },
    {
      id: 7,
      po: "PO12347",
      style: "STYLE-C03",
      decoration: "Pad-Print",
      qty: 3000,
    },
  ],
  "Friday, Oct 27": [
    {
      id: 8,
      po: "PO12345",
      style: "STYLE-A01",
      decoration: "Heat Press",
      qty: 2300,
    },
  ],
};

// =============================================================================
// HELPER COMPONENT (MODAL)
// =============================================================================
const ImportDialog = ({
  isOpen,
  onOpenChange,
  onFileUpload,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFileUpload: (file: File) => void;
}) => {
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
      onOpenChange(false);
    }
  };

  const handleDragEvents = (
    e: React.DragEvent<HTMLDivElement>,
    isDragging: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(isDragging);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Daily Plan</DialogTitle>
          <DialogDescription>
            Drag and drop your Excel file here or click to select a file.
          </DialogDescription>
        </DialogHeader>
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
            ${
              dragging
                ? "border-primary bg-primary-foreground"
                : "border-border hover:border-muted-foreground"
            }`}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload-input")?.click()}
        >
          <UploadCloud className="mx-auto text-muted-foreground" size={48} />
          <p className="mt-2 text-muted-foreground">
            Drag and drop or{" "}
            <span className="font-semibold text-primary">click to upload</span>.
          </p>
          <input
            id="file-upload-input"
            type="file"
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Supported formats: .xlsx, .xls
        </p>
      </DialogContent>
    </Dialog>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const WeeklyDailyPlanPage = () => {
  const [view, setView] = useState("weekly");
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [weeklyJobs, setWeeklyJobs] = useState(weeklyJobsData);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

        const newJobs = json.reduce((acc: Record<string, Job[]>, row) => {
          const day = row.date || "Uncategorized";
          if (!acc[day]) {
            acc[day] = [];
          }
          const newJob: Job = {
            id: Math.random(),
            po: row.po,
            style: row.style,
            decoration: row.decoration,
            qty: Number(row.qty),
          };
          acc[day].push(newJob);
          return acc;
        }, {});

        setWeeklyJobs((prevJobs) => ({ ...prevJobs, ...newJobs }));
        console.log("Imported data:", newJobs);
      }
    };
    reader.readAsArrayBuffer(file);
    alert(`File "${file.name}" selected. Check console log for data.`);
  };

  const flatJobs: JobWithDay[] = Object.entries(weeklyJobs).flatMap(
    ([day, jobs]) => jobs.map((job) => ({ ...job, day }))
  );

  const columns: ColumnDef<JobWithDay>[] = [
    { accessorKey: "day", header: "Day" },
    { accessorKey: "po", header: "PO" },
    { accessorKey: "style", header: "Style" },
    { accessorKey: "decoration", header: "Decoration" },
    {
      accessorKey: "qty",
      header: "Quantity",
      cell: ({ row }) => row.original.qty.toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Weekly & Daily Plan</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setImportModalOpen(true)}>Import Daily</Button>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => {
              if (value) setView(value);
            }}
          >
            <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
            <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon">
              <ChevronLeft size={20} />
            </Button>
            <h2 className="text-xl font-semibold">
              Week 43: October 23 - 29, 2023
            </h2>
            <Button variant="ghost" size="icon">
              <ChevronRight size={20} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <CustomTable columns={columns} data={flatJobs} showCheckbox={false} />

      <ImportDialog
        isOpen={isImportModalOpen}
        onOpenChange={setImportModalOpen}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default WeeklyDailyPlanPage;
