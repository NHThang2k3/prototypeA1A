import React, { useState, useMemo } from "react";
import {
 
  MoreHorizontal,
  Eye,

  ScanBarcode,
  Camera,

  CheckCircle2,
  PlusCircle,
  Wrench,
  Clock,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { RepairRequest, RequestStatus } from "./types";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomTable } from "@/components/ui/custom-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// --- Mock Data ---
const mockRequests: RepairRequest[] = [
  {
    id: "RR-001",
    jobNo: "JOB-2023-001",
    bundleNo: "BUN-101",
    creationDate: "2023-10-26",
    recordDate: "2023-10-26T08:00:00",
    poCode: "PO-12345",
    productCode: "STY-ABC-01",
    process: "Embroidery",
    defectType: "Wrong Thread",
    issueDescription: "Thread broken, uneven color",
    proposedAction: "Re-embroider logo",
    defectQty: 15,
    assignee: "John Doe",
    creator: "Jane Smith",
    status: "In Progress",
    startRepairTime: "2023-10-26T09:30:00",
  },
  {
    id: "RR-002",
    jobNo: "JOB-2023-002",
    bundleNo: "BUN-105",
    creationDate: "2023-10-26",
    recordDate: "2023-10-26T10:15:00",
    poCode: "PO-12346",
    productCode: "STY-XYZ-02",
    process: "Heat Press",
    defectType: "Peeling",
    issueDescription: "Print peeling off at left corner",
    proposedAction: "Re-press at high temp",
    defectQty: 8,
    creator: "Mike Johnson",
    status: "Pending", // Mapped to "Chưa sửa"
  },
  {
    id: "RR-003",
    jobNo: "JOB-2023-001",
    bundleNo: "BUN-102",
    creationDate: "2023-10-25",
    recordDate: "2023-10-25T14:00:00",
    poCode: "PO-12345",
    productCode: "STY-ABC-01",
    process: "Bonding",
    defectType: "Glue Overflow",
    issueDescription: "Glue overflowing at fabric edge",
    proposedAction: "Clean glue and re-bond",
    defectQty: 22,
    assignee: "David Lee",
    creator: "Jane Smith",
    status: "Completed",
    startRepairTime: "2023-10-25T14:30:00",
    endRepairTime: "2023-10-25T16:45:00",
    successfullyRepairedQty: 22,
    unrepairableQty: 0,
  },
];

// --- Helper Functions ---
const calculateDuration = (start?: string, end?: string) => {
  if (!start || !end) return "-";
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diffMs = endTime - startTime;
  
  if (diffMs < 0) return "Error";

  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusLabel = (status: RequestStatus) => {
  return status;
};

// --- Helper Components ---
const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const statusColors: Partial<Record<RequestStatus, string>> = {
    "Pending Approval": "bg-yellow-500 hover:bg-yellow-500/80",
    "Pending": "bg-yellow-500 hover:bg-yellow-500/80",
    Approved: "bg-blue-600 hover:bg-blue-600/80",
    "In Progress": "bg-blue-600 hover:bg-blue-600/80",
    Completed: "bg-green-600 text-white hover:bg-green-600/80",
    Rejected: "bg-red-600 hover:bg-red-600/80",
  };

  const label = getStatusLabel(status);

  return (
    <Badge className={`${statusColors[status] || "bg-gray-500"}`}>
      {label}
    </Badge>
  );
};

// --- Main Page Component ---
const RepairRequestListPage = () => {
  const [requests, setRequests] = useState<RepairRequest[]>(mockRequests);
  const [filters, setFilters] = useState({
    dateRange: "",
    status: "All",
    poCode: "",
    process: "All",
    creator: "",
  });

  // Modal States
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<"create" | "start" | "finish">("create");
  

  const [foundRequest, setFoundRequest] = useState<RepairRequest | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    issueDescription: "",
    proposedAction: "",
    jobNo: "",
    poNo: "",
    bundleNo: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(
      (req) =>
        (filters.status === "All" || req.status === filters.status) &&
        (filters.process === "All" || req.process === filters.process) &&
        (req.poCode.toLowerCase().includes(filters.poCode.toLowerCase()) || 
         req.jobNo.toLowerCase().includes(filters.poCode.toLowerCase()))
    );
  }, [requests, filters]);

  // --- Scan Logic ---
  const handleStartScan = () => {
    setIsScanModalOpen(true);
    setFoundRequest(null);
    setIsScanning(true);

    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setIsScanModalOpen(false); // Close scan modal first

      if (scanMode === "create") {
         const mockScanResult = {
          jobNo: "JOB-2023-NEW",
          poCode: "PO-99999",
          bundleNo: "BUN-NEW-01",
          defectType: "Defect Detected",
        };

        setFormData({
          jobNo: mockScanResult.jobNo,
          poNo: mockScanResult.poCode,
          bundleNo: mockScanResult.bundleNo,
          issueDescription: "",
          proposedAction: "",
        });
        setIsCreateModalOpen(true);
      } else if (scanMode === "start") {
        // Simulate finding a Pending Request (e.g., RR-002)
        // In real app, we would search 'requests' by scanned barcode
        const pendingReq = requests.find(r => r.id === "RR-002") || requests[0];
        setFoundRequest(pendingReq);
        setIsStartModalOpen(true);
      } else if (scanMode === "finish") {
        // Simulate finding an In Progress Request (e.g., RR-001)
         const inProgressReq = requests.find(r => r.id === "RR-001") || requests[0];
         setFoundRequest(inProgressReq);
         setIsFinishModalOpen(true);
      }
    }, 2000);
  };

  const handleCreateRequest = () => {
    const newRequest: RepairRequest = {
      id: `RR-${requests.length + 1}`.padStart(6, '0'),
      jobNo: formData.jobNo,
      poCode: formData.poNo,
      bundleNo: formData.bundleNo,
      creationDate: new Date().toISOString().split('T')[0],
      recordDate: new Date().toISOString(),
      productCode: "STY-NEW-01", // Mocked
      process: "Bonding", // Mocked default
      defectType: formData.issueDescription,
      issueDescription: formData.issueDescription,
      proposedAction: formData.proposedAction,
      defectQty: 1,
      creator: "Current User",
      status: "Pending",
      images: [],
    };
    setRequests([newRequest, ...requests]);
    setIsCreateModalOpen(false);
  };

  const handleStartRepair = () => {
    if (!foundRequest) return;
    setRequests(prev => prev.map(req => {
      if (req.id === foundRequest.id) {
        return {
          ...req,
          status: "In Progress",
          startRepairTime: new Date().toISOString(),
        };
      }
      return req;
    }));
    setIsStartModalOpen(false);
    setFoundRequest(null);
  };

  const handleFinishRepair = () => {
    if (!foundRequest) return;
    setRequests(prev => prev.map(req => {
      if (req.id === foundRequest.id) {
        return {
          ...req,
          status: "Completed", // Mapped to "Đã sửa"
          endRepairTime: new Date().toISOString(),
        };
      }
      return req;
    }));
    setIsFinishModalOpen(false);
    setFoundRequest(null);
  };

  const columns: ColumnDef<RepairRequest>[] = [
    { accessorKey: "jobNo", header: "JOB NO" },
    { accessorKey: "poCode", header: "PO NO" },
    { accessorKey: "bundleNo", header: "Bundle NO" },
    { accessorKey: "issueDescription", header: "Issue Description" },
    { accessorKey: "proposedAction", header: "Proposed Action" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { 
      accessorKey: "recordDate", 
      header: "Record Date",
      cell: ({ row }) => formatDateTime(row.original.recordDate)
    },
    { 
      accessorKey: "startRepairTime", 
      header: "Start Repair",
      cell: ({ row }) => formatDateTime(row.original.startRepairTime)
    },
    { 
      accessorKey: "endRepairTime", 
      header: "End Repair",
      cell: ({ row }) => formatDateTime(row.original.endRepairTime)
    },
    {
      id: "duration",
      header: "Duration",
      cell: ({ row }) => calculateDuration(row.original.startRepairTime, row.original.endRepairTime)
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => { setFoundRequest(row.original); setIsViewModalOpen(true); }}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Repair Request List</h1>
        <div className="flex items-center gap-2">
          {/* REPLACED Create Button with Scan Button */}
          <Button onClick={() => { setIsScanModalOpen(true); setIsScanning(false); }} className="bg-blue-600 hover:bg-blue-700">
            <ScanBarcode className="w-4 h-4 mr-2" />
            Scan Barcode
          </Button>
        </div>
      </div>

      {/* FILTER SECTION - Simplified for now */}
      <Card>
        <CardHeader>
             <CardTitle className="text-base font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex gap-4">
              <Input placeholder="Search PO or Job No..." 
                     name="poCode" 
                     onChange={handleFilterChange} 
                     className="max-w-sm" />
              <Select onValueChange={(val) => setFilters(prev => ({...prev, status: val}))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <CustomTable
            columns={columns}
            data={filteredRequests}
            showColumnVisibility={false}
          />
        </CardContent>
      </Card>
      
      {/* SCAN MODAL */}
      <Dialog open={isScanModalOpen} onOpenChange={setIsScanModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
          </DialogHeader>
          
          {/* SCAN MODE SELECTOR */}
          {!isScanning && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button 
                variant={scanMode === "create" ? "default" : "outline"} 
                className="flex flex-col h-20 items-center justify-center gap-1"
                onClick={() => setScanMode("create")}
              >
                <PlusCircle className="w-6 h-6" />
                <span className="text-xs">Create</span>
              </Button>
              <Button 
                variant={scanMode === "start" ? "default" : "outline"} 
                 className="flex flex-col h-20 items-center justify-center gap-1"
                 onClick={() => setScanMode("start")}
              >
                <Wrench className="w-6 h-6" />
                <span className="text-xs">Start Repair</span>
              </Button>
              <Button 
                variant={scanMode === "finish" ? "default" : "outline"} 
                 className="flex flex-col h-20 items-center justify-center gap-1"
                 onClick={() => setScanMode("finish")}
              >
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-xs">Finish</span>
              </Button>
            </div>
          )}

          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            {isScanning ? (
              <>
                <div className="relative w-48 h-48 bg-black rounded-lg overflow-hidden flex items-center justify-center border-4 border-blue-500">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-scan" />
                   <Camera className="w-16 h-16 text-gray-500" />
                </div>
                <p className="text-muted-foreground animate-pulse">Scanning...</p>
              </>
            ) : (
               <div className="flex flex-col items-center w-full">
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    {scanMode === "create" && "Scan a product code to create a new repair request."}
                    {scanMode === "start" && "Scan a request code to START repairing."}
                    {scanMode === "finish" && "Scan a request code to FINISH repairing."}
                  </p>
                  <Button size="lg" className="w-full" onClick={handleStartScan}>
                    <ScanBarcode className="mr-2" /> Start Camera
                  </Button>
               </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* CREATE FORM MODAL */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Repair Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>JOB NO</Label>
                <Input value={formData.jobNo} disabled />
              </div>
              <div className="space-y-2">
                <Label>PO NO</Label>
                <Input value={formData.poNo} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bundle NO</Label>
              <Input value={formData.bundleNo} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issue">Issue Description</Label>
              <Textarea 
                id="issue" 
                placeholder="Describe the defect..." 
                value={formData.issueDescription}
                onChange={(e) => setFormData(prev => ({...prev, issueDescription: e.target.value}))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">Proposed Action</Label>
              <Textarea 
                id="action" 
                placeholder="Propose a fix..."
                value={formData.proposedAction}
                onChange={(e) => setFormData(prev => ({...prev, proposedAction: e.target.value}))}
              />
            </div>

            <div className="space-y-2">
               <Label>Evidence Image</Label>
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-muted-foreground">Click to upload or take photo</span>
               </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRequest}>Create Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* START REPAIR MODAL */}
      <Dialog open={isStartModalOpen} onOpenChange={setIsStartModalOpen}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Start Repair</DialogTitle>
            </DialogHeader>
            {foundRequest && (
              <div className="space-y-4">
                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
                      <Wrench className="w-4 h-4" /> Ready to Repair
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      You are about to start repairing this item.
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold block">Job No:</span> {foundRequest.jobNo}
                    </div>
                     <div>
                      <span className="font-semibold block">Bundle No:</span> {foundRequest.bundleNo}
                    </div>
                     <div className="col-span-2">
                      <span className="font-semibold block">Defect:</span> {foundRequest.issueDescription}
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold block">Proposed Action:</span> {foundRequest.proposedAction}
                    </div>
                 </div>

                 <DialogFooter>
                    <Button variant="outline" onClick={() => setIsStartModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleStartRepair} className="bg-blue-600 hover:bg-blue-700">
                       Start Repair Now
                    </Button>
                 </DialogFooter>
              </div>
            )}
         </DialogContent>
      </Dialog>

      {/* FINISH REPAIR MODAL */}
      <Dialog open={isFinishModalOpen} onOpenChange={setIsFinishModalOpen}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Finish Repair</DialogTitle>
            </DialogHeader>
             {foundRequest && (
              <div className="space-y-4">
                 <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Completion Confirmation
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                       Confirm that you have finished the repair.
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold block">Job No:</span> {foundRequest.jobNo}
                    </div>
                     <div>
                      <span className="font-semibold block">Bundle No:</span> {foundRequest.bundleNo}
                    </div>
                     <div className="col-span-2">
                      <span className="font-semibold block">Start Time:</span> {formatDateTime(foundRequest.startRepairTime)}
                    </div>
                 </div>

                 <DialogFooter>
                    <Button variant="outline" onClick={() => setIsFinishModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleFinishRepair} className="bg-green-600 hover:bg-green-700">
                       Complete Repair
                    </Button>
                 </DialogFooter>
              </div>
            )}
         </DialogContent>
      </Dialog>

      {/* VIEW DETAILS MODAL */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <DialogTitle>Repair Request Details</DialogTitle>
            </DialogHeader>
             {foundRequest && (
              <div className="space-y-6">
                 {/* Header Info */}
                 <div className="flex justify-between items-start border-b pb-4">
                    <div>
                       <h3 className="text-lg font-bold">{foundRequest.id}</h3>
                       <p className="text-sm text-muted-foreground">Recorded on {formatDateTime(foundRequest.recordDate)}</p>
                    </div>
                    <StatusBadge status={foundRequest.status} />
                 </div>
                 
                 {/* Main Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                       <Label className="text-muted-foreground text-xs">Job No</Label>
                       <p className="font-medium">{foundRequest.jobNo}</p>
                    </div>
                    <div className="space-y-1">
                       <Label className="text-muted-foreground text-xs">PO Code</Label>
                       <p className="font-medium">{foundRequest.poCode}</p>
                    </div>
                    <div className="space-y-1">
                       <Label className="text-muted-foreground text-xs">Bundle No</Label>
                       <p className="font-medium">{foundRequest.bundleNo}</p>
                    </div>
                    <div className="space-y-1">
                       <Label className="text-muted-foreground text-xs">Product Code</Label>
                       <p className="font-medium">{foundRequest.productCode}</p>
                    </div>
                    <div className="space-y-1">
                       <Label className="text-muted-foreground text-xs">Process</Label>
                       <p className="font-medium">{foundRequest.process}</p>
                    </div>
                    <div className="space-y-1">
                       <Label className="text-muted-foreground text-xs">Creator</Label>
                       <p className="font-medium">{foundRequest.creator}</p>
                    </div>
                 </div>

                 {/* Issue & Action */}
                 <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                    <div>
                       <h4 className="font-semibold text-sm mb-1">Issue Description</h4>
                       <p className="text-sm">{foundRequest.issueDescription}</p>
                    </div>
                    <div className="border-t pt-2">
                       <h4 className="font-semibold text-sm mb-1">Proposed Action</h4>
                       <p className="text-sm">{foundRequest.proposedAction}</p>
                       <Badge variant="outline" className="mt-2 text-xs">Defect Qty: {foundRequest.defectQty}</Badge>
                    </div>
                 </div>

                 {/* Timeline Info */}
                 <div className="grid grid-cols-3 gap-4 border-t pt-4">
                     <div>
                        <Label className="text-muted-foreground text-xs">Start Time</Label>
                         <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span className="text-sm">{formatDateTime(foundRequest.startRepairTime)}</span>
                         </div>
                     </div>
                     <div>
                        <Label className="text-muted-foreground text-xs">End Time</Label>
                         <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-green-500" />
                            <span className="text-sm">{formatDateTime(foundRequest.endRepairTime)}</span>
                         </div>
                     </div>
                     <div>
                        <Label className="text-muted-foreground text-xs">Duration</Label>
                        <span className="text-sm font-bold">
                           {calculateDuration(foundRequest.startRepairTime, foundRequest.endRepairTime)}
                        </span>
                     </div>
                 </div>

                 <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                 </DialogFooter>
              </div>
            )}
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default RepairRequestListPage;
