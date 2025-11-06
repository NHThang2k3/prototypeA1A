// src/pages/bundle-management/BundleManagementPage.tsx

// 1. IMPORTS
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Upload,
  Eye,
  FilePenLine,
  QrCode,
  Printer,
  Wrench,
  FileUp,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 2. TYPE DEFINITIONS (from types.ts)
export type Job = {
  jobNo: string;
  subNo: number;
  qrCode: string;
  jobDate: string;
  requireDate: string;
  shipmentDate: string;
  orderType: number;
  recDate: string;
  brandCode: string;
  poNo: string;
  poDate: string;
  shipBy: string;
  sumQty: number;
  styleNo: string;
  styleDesc: string;
  season: string;
  country: string;
  plantCode: string;
  mer: string;
  unit: string;
  comboCode: string;
  comboDesc: string;
  seqColor: number;
  colorName: string;
  jobSize: string;
  extendTerm?: string;
  colorGroup: string;
};

// 3. SAMPLE DATA (from data.ts)
const sampleJobs: Job[] = [
  {
    jobNo: "SOTSM2503115",
    subNo: 1,
    qrCode: "QR115A2",
    jobDate: "18/10/2025",
    requireDate: "25/11/2025",
    shipmentDate: "25/11/2025",
    orderType: 1,
    recDate: "25/11/2025",
    brandCode: "PU",
    poNo: "TEST SHIPMENT",
    poDate: "18/10/2025",
    shipBy: "MO-003",
    sumQty: 15,
    styleNo: "P1105SHO331S",
    styleDesc: "SAMPLE M SHOE",
    season: "FW25",
    country: "TES",
    plantCode: "A1A2",
    mer: "TEST",
    unit: "PCS",
    comboCode: "JI8001",
    comboDesc: "GREY/BLK",
    seqColor: 2,
    colorName: "BLACK",
    jobSize: "42",
    extendTerm: "",
    colorGroup: "Black",
  },
  {
    jobNo: "SOAD2510116",
    subNo: 1,
    qrCode: "QR116A1",
    jobDate: "20/10/2025",
    requireDate: "10/1/2026",
    shipmentDate: "5/1/2026",
    orderType: 1,
    recDate: "10/1/2026",
    brandCode: "AD",
    poNo: "900989112",
    poDate: "19/10/2025",
    shipBy: "MO-002",
    sumQty: 12050,
    styleNo: "F2998TRP404S",
    styleDesc: "MENS TRACKPANTS",
    season: "SS26",
    country: "IDN",
    plantCode: "D4B5",
    mer: "304776655",
    unit: "PCS",
    comboCode: "JI9141",
    comboDesc: "NAVY",
    seqColor: 1,
    colorName: "COLLEGIATE NAVY",
    jobSize: "L",
    extendTerm: "Net 30",
    colorGroup: "Blue",
  },
];

// 5. CHILD COMPONENTS

// === ImportJobModal.tsx ===
type ImportJobModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const requiredFiles = [
  "Bill of Materials (BOM)",
  "Cutting Plan",
  "Marker Data",
  "Order Details",
  "Sewing Operations",
  "Packaging Spec",
  "Labeling Info",
  "Quality Control Plan",
];

const ImportJobModal = ({ isOpen, onOpenChange }: ImportJobModalProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, File | null>
  >(requiredFiles.reduce((acc, val) => ({ ...acc, [val]: null }), {}));

  const handleFileChange = (fileName: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [fileName]: file }));
  };

  const allFilesUploaded = Object.values(uploadedFiles).every(
    (file) => file !== null
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import 8 Excel Files to Create a New JOB</DialogTitle>
          <DialogDescription>
            Please upload all 8 required files to generate a new JOB. The system
            will process these files to gather all necessary information.
          </DialogDescription>
        </DialogHeader>
        <main className="p-6 pt-0 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredFiles.map((fileName) => (
              <div key={fileName} className="border rounded-lg p-3">
                <Label htmlFor={fileName} className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{fileName}</p>
                      {uploadedFiles[fileName] ? (
                        <div className="flex items-center text-green-600 mt-1">
                          <CheckCircle2 size={16} className="mr-1.5" />
                          <span className="text-xs font-semibold">
                            {uploadedFiles[fileName]?.name}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                          Click or drag to upload
                        </p>
                      )}
                    </div>
                    <FileUp
                      className={`transition-colors ${
                        uploadedFiles[fileName]
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                      size={28}
                    />
                  </div>
                  <Input
                    id={fileName}
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={(e) =>
                      handleFileChange(
                        fileName,
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                  />
                </Label>
              </div>
            ))}
          </div>
        </main>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!allFilesUploaded}>Create JOB</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// === UpdateJobModal.tsx ===
type UpdateJobModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onSave: (updatedJob: Job) => void;
};

const UpdateJobModal = ({
  isOpen,
  onOpenChange,
  job,
  onSave,
}: UpdateJobModalProps) => {
  const [formData, setFormData] = useState<Partial<Job>>({});

  useEffect(() => {
    if (job) {
      setFormData({
        requireDate: job.requireDate,
        shipmentDate: job.shipmentDate,
        sumQty: job.sumQty,
        styleDesc: job.styleDesc,
      });
    }
  }, [job]);

  if (!job) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sumQty" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...job, ...formData });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Job: {job.jobNo}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requireDate" className="text-right">
                Require Date
              </Label>
              <Input
                id="requireDate"
                name="requireDate"
                value={formData.requireDate || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shipmentDate" className="text-right">
                Shipment Date
              </Label>
              <Input
                id="shipmentDate"
                name="shipmentDate"
                value={formData.shipmentDate || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sumQty" className="text-right">
                SUM QTY
              </Label>
              <Input
                id="sumQty"
                name="sumQty"
                type="number"
                value={formData.sumQty || 0}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="styleDesc" className="text-right">
                Style Desc
              </Label>
              <Textarea
                id="styleDesc"
                name="styleDesc"
                value={formData.styleDesc || ""}
                onChange={handleChange}
                rows={3}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// 6. MAIN COMPONENT
const BundleManagementPage = () => {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [searchTerm, setSearchTerm] = useState("");

  // State for modals
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleUpdateJob = (jobToUpdate: Job) => {
    setSelectedJob(jobToUpdate);
    setUpdateModalOpen(true);
  };

  const handleSaveJob = (updatedJob: Job) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.jobNo === updatedJob.jobNo && job.subNo === updatedJob.subNo
          ? updatedJob
          : job
      )
    );
    setUpdateModalOpen(false);
    setSelectedJob(null);
  };

  const columns = useMemo<ColumnDef<Job>[]>(
    () => [
      { accessorKey: "jobNo", header: "JOB NO" },
      { accessorKey: "subNo", header: "SUB NO" },
      { accessorKey: "qrCode", header: "QR Code" },
      { accessorKey: "jobDate", header: "JOB DATE" },
      { accessorKey: "requireDate", header: "REQUIRE DATE" },
      { accessorKey: "shipmentDate", header: "SHIPMENT DATE" },
      { accessorKey: "orderType", header: "ORDER TYPE" },
      { accessorKey: "recDate", header: "REC DATE" },
      { accessorKey: "brandCode", header: "BRAND CODE" },
      { accessorKey: "poNo", header: "PO NO" },
      { accessorKey: "poDate", header: "PO DATE" },
      { accessorKey: "shipBy", header: "SHIP_BY" },
      { accessorKey: "sumQty", header: "SUM QTY" },
      { accessorKey: "styleNo", header: "STYLE NO" },
      { accessorKey: "styleDesc", header: "STYLE DESC" },
      { accessorKey: "season", header: "Season" },
      { accessorKey: "country", header: "Country" },
      { accessorKey: "plantCode", header: "PLANT_CODE" },
      { accessorKey: "mer", header: "MER" },
      { accessorKey: "unit", header: "Unit" },
      { accessorKey: "comboCode", header: "COMBO_CODE" },
      { accessorKey: "comboDesc", header: "COMBO_DESC" },
      { accessorKey: "seqColor", header: "SEQ_COLOR" },
      { accessorKey: "colorName", header: "COLOR_NAME" },
      { accessorKey: "jobSize", header: "JOB_SIZE" },
      { accessorKey: "extendTerm", header: "Extend Term" },
      { accessorKey: "colorGroup", header: "Color Group" },
      {
        id: "actions",
        cell: ({ row }) => {
          const job = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateJob(job)}>
                  <Wrench className="mr-2 h-4 w-4" /> Update Job
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FilePenLine className="mr-2 h-4 w-4" /> Edit Job
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="mr-2 h-4 w-4" /> Print QR Code
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs;
    return jobs.filter((job) =>
      job.jobNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Bundle Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage, import, and view details of all jobs.
        </p>
      </header>

      {/* Thanh công cụ */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by JOB NO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-80"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            onClick={() => setImportModalOpen(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Upload className="mr-2 h-5 w-5" />
            Import File
          </Button>
        </div>
      </div>

      {/* Bảng */}
      <CustomTable columns={columns} data={filteredJobs} />

      {/* Modals */}
      <ImportJobModal
        isOpen={isImportModalOpen}
        onOpenChange={setImportModalOpen}
      />
      <UpdateJobModal
        isOpen={isUpdateModalOpen}
        onOpenChange={setUpdateModalOpen}
        job={selectedJob}
        onSave={handleSaveJob}
      />
    </div>
  );
};

// 7. EXPORT
export default BundleManagementPage;
