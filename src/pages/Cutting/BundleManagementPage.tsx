// src/pages/bundle-management/BundleManagementPage.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Eye,
  QrCode,
  Printer,
  Wrench,
  MoreHorizontal,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

// Assuming these exist based on prompt instructions
import { CustomTable } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

// --- TYPE DEFINITIONS ---
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

// --- SAMPLE DATA ---
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

// --- CHILD COMPONENTS ---

// === PrintQRModal.tsx (New Component based on Screenshot) ===
type PrintQRModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const PrintQRModal = ({ isOpen, onOpenChange }: PrintQRModalProps) => {
  const [_printType, setPrintType] = useState("both"); // both, home, decoration
  
  // Dummy data for select boxes
  const cutNos = ["1", "2", "3", "4", "5"];
  const bundleNos = ["101", "102", "103", "104", "105"];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-slate-50 border-slate-300 shadow-xl">
        
        
        <DialogHeader>
          <DialogTitle className="hidden">Print QR Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 p-4">
          {/* Radio Buttons Group */}
          <RadioGroup 
            defaultValue="both" 
            onValueChange={setPrintType} 
            className="flex flex-wrap gap-6 items-center"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="r1" />
              <Label htmlFor="r1" className="text-blue-700 font-bold underline cursor-pointer text-base">
                In hàng nhà và hàng trang trí
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="home" id="r2" />
              <Label htmlFor="r2" className="text-blue-700 font-bold underline cursor-pointer text-base">
                In hàng nhà
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="decoration" id="r3" />
              <Label htmlFor="r3" className="text-blue-700 font-bold underline cursor-pointer text-base">
                In hàng trang trí
              </Label>
            </div>
          </RadioGroup>

          {/* Main Input */}
          <div>
            <Input className="h-10 border-blue-200 focus-visible:ring-blue-400" />
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Left Column: Inputs */}
            <div className="col-span-12 md:col-span-8 space-y-6">
              
              {/* CutNo Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-bold underline text-black">CutNo Start</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {cutNos.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="font-bold underline text-black">CutNo End</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {cutNos.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bundle Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-bold underline text-black">Bundle Start</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {bundleNos.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="font-bold underline text-black">Bundle End</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {bundleNos.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </div>

            {/* Right Column: Buttons */}
            <div className="col-span-12 md:col-span-4 flex flex-col justify-between gap-4">
              
              {/* LOAD Buttons aligned with input rows generally */}
              <div className="flex flex-col gap-6 mt-6">
                 <Button 
                   className="w-full bg-gradient-to-b from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 text-blue-700 font-bold border border-gray-400 shadow-sm"
                 >
                   LOAD
                 </Button>
                 <Button 
                   className="w-full bg-gradient-to-b from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 text-blue-700 font-bold border border-gray-400 shadow-sm"
                 >
                   LOAD
                 </Button>
              </div>

              {/* PRINT Button */}
              <Button 
                className="w-full h-16 bg-[#FFFFE0] hover:bg-[#FFFACD] text-blue-700 text-3xl font-bold border-2 border-gray-400 shadow-md"
              >
                PRINT
              </Button>

            </div>
          </div>

          {/* Footer Options */}
          <div className="flex justify-end items-center gap-6 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="printAgain" />
              <Label htmlFor="printAgain" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Print Again
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="showData" />
              <Label htmlFor="showData" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Show Data
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="emb" />
              <Label htmlFor="emb" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                EMB
              </Label>
            </div>
          </div>
        </div>
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
          <DialogTitle>Update: {job.jobNo}</DialogTitle>
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

// --- MAIN COMPONENT ---
const BundleManagementPage = () => {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [searchTerm, setSearchTerm] = useState("");

  // State for modals
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isPrintModalOpen, setPrintModalOpen] = useState(false);
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
                  <Wrench className="mr-2 h-4 w-4" /> Update
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setPrintModalOpen(true)}>
                  <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPrintModalOpen(true)}>
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
          Manage and view details of all jobs.
        </p>
      </header>

      {/* Toolbar */}
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
          {/* REPLACED "Import File" WITH "Print QR code" */}
          <Button
            onClick={() => setPrintModalOpen(true)}
            variant="default" // Using default (primary) variant to stand out
            className="w-full sm:w-auto"
          >
            <Printer className="mr-2 h-5 w-5" />
            Print QR code
          </Button>
        </div>
      </div>

      {/* Table */}
      <CustomTable columns={columns} data={filteredJobs} />

      {/* Modals */}
      <PrintQRModal
        isOpen={isPrintModalOpen}
        onOpenChange={setPrintModalOpen}
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

export default BundleManagementPage;