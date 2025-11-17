// Path: src/pages/issue-fabric-from-job/IssueFabricFromJobPage.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ArrowRightCircle,
  Trash2,
  PlusCircle,
  CheckCircle2,
  FileUp,
  Search,
} from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomTable } from "@/components/ui/custom-table";
import { Separator } from "@/components/ui/separator";

// --- START OF INLINED FILE: src/pages/issue-fabric-form/types.ts ---

// Dữ liệu cho một JOB trong kế hoạch cắt
interface CuttingPlanJob {
  ID: string;
  PlanName: string;
  Factory: string;
  PlanDate: string;
  Style: string;
  JOB: string;
  ItemCode: string;
  Color: string;
  RequestQuantity: number;
  IssuedQuantity: number;
  Status: "Planned" | "In Progress" | "Completed";
  CreatedBy: string;
  Remarks: string;
  erpChecked: boolean;
  qcChecked: boolean;
}

// Dữ liệu cho một cuộn vải trong kho
interface InventoryRoll {
  PONumber: string;
  ItemCode: string;
  Factory: string;
  Supplier: string;
  InvoiceNo: string;
  ColorCode: string;
  Color: string;
  RollNo: string;
  LotNo: string;
  Yards: number;
  NetWeightKgs: number;
  GrossWeightKgs: number;
  Width: string;
  Location: string;
  QRCode: string;
  DateInHouse: string;
  Description: string;
  QCStatus: "Passed" | "Failed" | "Pending";
  QCDate: string;
  QCBy: string;
  Comment: string;
  Printed: boolean;
  BalanceYards: number;
  HourStandard: number;
  HourRelax: number;
  RelaxDate: string;
  RelaxTime: string;
  RelaxBy: string;
  ParentQRCode: string | null;
}

// Dữ liệu cho một cuộn vải đã được chọn để xuất
interface SelectedInventoryRoll extends InventoryRoll {
  issuedYards: number;
}

// --- END OF INLINED FILE: src/pages/issue-fabric-form/types.ts ---

// --- START OF INLINED FILE: src/pages/issue-fabric-form/data.ts ---

// --- DỮ LIỆU GIẢ CHO CUTTING PLAN ---
const MOCK_CUTTING_PLAN_JOBS: CuttingPlanJob[] = [
  {
    ID: "CP001",
    PlanName: "Kế hoạch cắt áo T-Shirt đợt 1",
    Factory: "F1",
    PlanDate: "2025-10-20",
    Style: "TSH-001",
    JOB: "JOB-101",
    ItemCode: "CTN-005",
    Color: "Trắng",
    RequestQuantity: 500,
    IssuedQuantity: 0,
    Status: "Planned",
    CreatedBy: "an.nguyen",
    Remarks: "Ưu tiên cắt trước.",
    erpChecked: true,
    qcChecked: true,
  },
  {
    ID: "CP002",
    PlanName: "Kế hoạch cắt quần Jean nam",
    Factory: "F1",
    PlanDate: "2025-10-21",
    Style: "JEA-002",
    JOB: "JOB-102",
    ItemCode: "DNM-003",
    Color: "Xanh đậm",
    RequestQuantity: 350,
    IssuedQuantity: 0,
    Status: "Planned",
    CreatedBy: "an.nguyen",
    Remarks: "Vải denim cần kiểm tra độ co rút.",
    erpChecked: true,
    qcChecked: false,
  },
  {
    ID: "CP003",
    PlanName: "Kế hoạch cắt váy liền thân",
    Factory: "F2",
    PlanDate: "2025-10-22",
    Style: "DRS-004",
    JOB: "JOB-103",
    ItemCode: "SIL-001",
    Color: "Đỏ đô",
    RequestQuantity: 200,
    IssuedQuantity: 150,
    Status: "In Progress",
    CreatedBy: "bao.tran",
    Remarks: "Đã nhận đủ vải.",
    erpChecked: false,
    qcChecked: true,
  },
  {
    ID: "CP004",
    PlanName: "Kế hoạch cắt áo sơ mi nữ",
    Factory: "F2",
    PlanDate: "2025-10-23",
    Style: "SHT-003",
    JOB: "JOB-104",
    ItemCode: "POP-002",
    Color: "Xanh nhạt",
    RequestQuantity: 420,
    IssuedQuantity: 0,
    Status: "Planned",
    CreatedBy: "chi.le",
    Remarks: "Yêu cầu kiểm tra sơ đồ cắt.",
    erpChecked: true,
    qcChecked: true,
  },
];

// --- DỮ LIỆU GIẢ CHO INVENTORY ---
const MOCK_INVENTORY_ROLLS: InventoryRoll[] = [
  // ... (dữ liệu kho không đổi)
  {
    PONumber: "POPU0018251",
    ItemCode: "DNM-003",
    Factory: "Factory A",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-001",
    ColorCode: "CC-003",
    Color: "Xanh đậm",
    RollNo: "1",
    LotNo: "225628091",
    Yards: 65,
    BalanceYards: 46,
    Location: "A1-01",
    QCStatus: "Passed",
    QRCode: "QR-43468",
    DateInHouse: "2023-06-08",
  },
  {
    PONumber: "POPU0018252",
    ItemCode: "DNM-003",
    Factory: "Factory A",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-001",
    ColorCode: "CC-003",
    Color: "Xanh đậm",
    RollNo: "2",
    LotNo: "225628092",
    Yards: 80,
    BalanceYards: 80,
    Location: "A1-02",
    QCStatus: "Passed",
    QRCode: "QR-33961",
    DateInHouse: "2023-06-08",
  },
  {
    PONumber: "SSPU0002939",
    ItemCode: "CTN-005",
    Factory: "Factory C",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-009",
    ColorCode: "CC-002",
    Color: "Trắng",
    RollNo: "1",
    LotNo: "225628091",
    Yards: 90,
    BalanceYards: 90,
    Location: "C3-11",
    QCStatus: "Passed",
    QRCode: "QR-16812",
    DateInHouse: "2023-05-05",
  },
  {
    PONumber: "SSPU0002940",
    ItemCode: "CTN-005",
    Factory: "Factory C",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-010",
    ColorCode: "CC-002",
    Color: "Trắng",
    RollNo: "2",
    LotNo: "225628093",
    Yards: 120,
    BalanceYards: 120,
    Location: "C3-12",
    QCStatus: "Passed",
    QRCode: "QR-16813",
    DateInHouse: "2023-05-05",
  },
  {
    PONumber: "SSPU0002942",
    ItemCode: "POP-002",
    Factory: "Factory C",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-010",
    ColorCode: "CC-002",
    Color: "Xanh nhạt",
    RollNo: "4",
    LotNo: "225628093",
    Yards: 500,
    BalanceYards: 500,
    Location: "C4-01",
    QCStatus: "Passed",
    QRCode: "QR-16815",
    DateInHouse: "2023-05-06",
  },
].map((roll) => ({
  ...roll,
  Printed: true,
  Comment: "",
  QCBy: "System",
  QCDate: "2023-01-01",
  HourStandard: 24,
  HourRelax: 24,
  RelaxDate: "2023-01-01",
  RelaxTime: "10:00",
  RelaxBy: "System",
  ParentQRCode: null,
  Description: "",
  GrossWeightKgs: 0,
  NetWeightKgs: 0,
  Width: '60"',
  InvoiceNo: roll.InvoiceNo || "N/A",
  Factory: roll.Factory || "N/A",
  Supplier: roll.Supplier || "N/A",
  ColorCode: roll.ColorCode || "N/A",
})) as InventoryRoll[];

const getCuttingPlanJobs = (): Promise<CuttingPlanJob[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        MOCK_CUTTING_PLAN_JOBS.filter((job) => job.Status !== "Completed")
      );
    }, 500);
  });
};

const getInventoryByItem = (
  itemCode: string,
  color: string
): Promise<InventoryRoll[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rolls = MOCK_INVENTORY_ROLLS.filter(
        (roll) =>
          roll.ItemCode === itemCode &&
          roll.Color === color &&
          roll.BalanceYards > 0 &&
          roll.QCStatus === "Passed"
      );
      resolve(rolls);
    }, 800);
  });
};

const getInventoryByItemCode = (itemCode: string): Promise<InventoryRoll[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rolls = MOCK_INVENTORY_ROLLS.filter(
        (roll) =>
          roll.ItemCode === itemCode &&
          roll.BalanceYards > 0 &&
          roll.QCStatus === "Passed"
      );
      resolve(rolls);
    }, 800);
  });
};

// --- END OF INLINED FILE: src/pages/issue-fabric-form/data.ts ---

// --- MAIN COMPONENT: IssueFabricFromJobPage.tsx ---
const IssueFabricFromJobPage: React.FC = () => {
  const [isIssuing, setIsIssuing] = useState(false);
  const [allJobs, setAllJobs] = useState<CuttingPlanJob[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [selectedRolls, setSelectedRolls] = useState<SelectedInventoryRoll[]>(
    []
  );
  const [availableInventoryRolls, setAvailableInventoryRolls] = useState<
    InventoryRoll[]
  >([]);
  const [shortageInfo, setShortageInfo] = useState<{
    itemCode: string;
    color: string;
    shortageYards: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading for initial job list
  const [isSearchingInventory, setIsSearchingInventory] = useState(false); // Specific loading for inventory search
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    getCuttingPlanJobs().then((data) => {
      setAllJobs(data);
      setIsLoading(false);
    });
  }, []);

  const filteredJobs = useMemo(() => {
    if (!jobSearchTerm) return allJobs;
    return allJobs.filter((job) =>
      job.JOB.toLowerCase().includes(jobSearchTerm.toLowerCase())
    );
  }, [allJobs, jobSearchTerm]);

  const selectedJobs = useMemo(() => {
    return allJobs.filter((job) => selectedJobIds.has(job.ID));
  }, [allJobs, selectedJobIds]);

  const fabricRequirements = useMemo(() => {
    const requirements = new Map<
      string,
      { itemCode: string; color: string; requiredYards: number }
    >();
    selectedJobs.forEach((job) => {
      const key = `${job.ItemCode}-${job.Color}`;
      const existing = requirements.get(key) || {
        itemCode: job.ItemCode,
        color: job.Color,
        requiredYards: 0,
      };
      existing.requiredYards += job.RequestQuantity;
      requirements.set(key, existing);
    });
    return Array.from(requirements.values());
  }, [selectedJobs]);

  const totalIssuedYards = useMemo(() => {
    return selectedRolls.reduce(
      (sum, roll) => sum + (roll.issuedYards || 0),
      0
    );
  }, [selectedRolls]);

  const totalRequiredYards = useMemo(() => {
    return fabricRequirements.reduce((sum, req) => sum + req.requiredYards, 0);
  }, [fabricRequirements]);

  useEffect(() => {
    if (isIssuing && fabricRequirements.length > 0) {
      const processFabricRequest = async () => {
        setIsSearchingInventory(true);
        setShortageInfo(null);
        setSelectedRolls([]);
        setAvailableInventoryRolls([]);

        const mainRequirement = fabricRequirements[0];
        if (!mainRequirement) {
          setIsSearchingInventory(false);
          return;
        }

        const { itemCode, color } = mainRequirement;
        const requiredYards = totalRequiredYards;

        const allMatchingRolls = await getInventoryByItem(itemCode, color);
        const sortedRolls = [...allMatchingRolls].sort(
          (a, b) => a.BalanceYards - b.BalanceYards
        );

        const autoSelected: SelectedInventoryRoll[] = [];
        let yardsToFulfill = requiredYards;
        for (const roll of sortedRolls) {
          if (yardsToFulfill <= 0) break;
          const yardsToIssue = Math.min(roll.BalanceYards, yardsToFulfill);
          autoSelected.push({ ...roll, issuedYards: yardsToIssue });
          yardsToFulfill -= yardsToIssue;
        }
        setSelectedRolls(autoSelected);

        const selectedQRCodes = new Set(autoSelected.map((r) => r.QRCode));
        let availableRolls = allMatchingRolls.filter(
          (r) => !selectedQRCodes.has(r.QRCode)
        );

        if (yardsToFulfill > 0) {
          setShortageInfo({ itemCode, color, shortageYards: yardsToFulfill });
          const allItemRolls = await getInventoryByItemCode(itemCode);
          const currentQRCodes = new Set(allMatchingRolls.map((r) => r.QRCode));
          const substituteRolls = allItemRolls.filter(
            (r) => !currentQRCodes.has(r.QRCode)
          );
          availableRolls = [...availableRolls, ...substituteRolls];
        }

        setAvailableInventoryRolls(availableRolls);
        setIsSearchingInventory(false);
      };

      processFabricRequest();
    }
  }, [isIssuing, fabricRequirements, totalRequiredYards]);

  const handleSimulateImport = useCallback(
    (jobId: string, type: "erp" | "qc") => {
      alert(
        `Đã import thành công dữ liệu ${type.toUpperCase()} cho JOB: ${jobId}.`
      );
      setAllJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.ID === jobId ? { ...job, [`${type}Checked`]: true } : job
        )
      );
    },
    []
  );

  const handleProceedToIssue = useCallback(() => {
    if (selectedJobIds.size > 0) {
      const firstSelectedJob = selectedJobs[0];
      const allSameFabric = selectedJobs.every(
        (job) =>
          job.ItemCode === firstSelectedJob.ItemCode &&
          job.Color === firstSelectedJob.Color
      );

      if (!allSameFabric) {
        alert(
          "Lỗi: Vui lòng chỉ chọn các JOB có cùng Mã Vải (Item Code) và Màu (Color) trong một lần cấp phát."
        );
        return;
      }

      setIsIssuing(true);
    }
  }, [selectedJobIds, selectedJobs]);

  const handleJobSelectionChange = useCallback(
    (selectedItems: CuttingPlanJob[]) => {
      setSelectedJobIds(new Set(selectedItems.map((item) => item.ID)));
      // Nếu người dùng bỏ chọn hết, ẩn Step 2
      if (selectedItems.length === 0) {
        setIsIssuing(false);
      }
    },
    []
  );

  const handleIssuedYardsChange = useCallback(
    (qrCode: string, newYards: number) => {
      setSelectedRolls((prevRolls) =>
        prevRolls.map((roll) => {
          if (roll.QRCode === qrCode) {
            const validatedYards = Math.max(
              0,
              Math.min(newYards, roll.BalanceYards)
            );
            return { ...roll, issuedYards: validatedYards };
          }
          return roll;
        })
      );
    },
    []
  );

  const handleAddRollFromInventory = useCallback((rollToAdd: InventoryRoll) => {
    setSelectedRolls((prev) => [
      ...prev,
      { ...rollToAdd, issuedYards: rollToAdd.BalanceYards },
    ]);
    setAvailableInventoryRolls((prev) =>
      prev.filter((r) => r.QRCode !== rollToAdd.QRCode)
    );
  }, []);

  const handleRemoveSelectedRoll = useCallback(
    (rollToRemove: SelectedInventoryRoll) => {
      setSelectedRolls((prev) =>
        prev.filter((r) => r.QRCode !== rollToRemove.QRCode)
      );
      const { issuedYards, ...originalRoll } = rollToRemove;
      void issuedYards;
      setAvailableInventoryRolls((prev) =>
        [...prev, originalRoll].sort((a, b) => a.RollNo.localeCompare(b.RollNo))
      );
    },
    []
  );

  const handleFinishIssuance = useCallback(() => {
    const shortage = totalRequiredYards - totalIssuedYards;
    if (shortage > 0) {
      if (
        !window.confirm(
          `Cảnh báo: Đang cấp phát thiếu ${shortage.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })} yds.\nBạn có chắc chắn muốn tiếp tục?`
        )
      ) {
        return;
      }
    }

    setIsFinishing(true);
    console.log("--- BẮT ĐẦU QUÁ TRÌNH CẤP PHÁT ---");
    console.log("Các JOB được xử lý:", selectedJobs);
    console.log("Các cuộn vải được cấp phát:", selectedRolls);
    console.log("Tổng yêu cầu:", totalRequiredYards);
    console.log("Tổng cấp phát:", totalIssuedYards);

    setTimeout(() => {
      alert("Cấp phát vải thành công!");
      setIsFinishing(false);
      setAllJobs((prev) => prev.filter((j) => !selectedJobIds.has(j.ID)));
      setSelectedJobIds(new Set());
      setIsIssuing(false);
    }, 2000);
  }, [
    selectedJobs,
    selectedRolls,
    totalIssuedYards,
    totalRequiredYards,
    selectedJobIds,
  ]);

  const jobStatusColumns = useMemo<ColumnDef<CuttingPlanJob>[]>(
    () => [
      { accessorKey: "JOB", header: "JOB" },
      { accessorKey: "ItemCode", header: "Item Code" },
      { accessorKey: "Color", header: "Color" },
      { accessorKey: "RequestQuantity", header: "Required Qty" },
      { accessorKey: "Style", header: "Style" },
      {
        accessorKey: "erpChecked",
        header: () => <div className="text-center">ERP Check</div>,
        cell: ({ row }) => (
          <div className="flex  justify-center">
            {row.original.erpChecked ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSimulateImport(row.original.ID, "erp")}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Import
              </Button>
            )}
          </div>
        ),
      },
      {
        accessorKey: "qcChecked",
        header: () => <div className="text-center">QC Check</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            {row.original.qcChecked ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSimulateImport(row.original.ID, "qc")}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Import
              </Button>
            )}
          </div>
        ),
      },
    ],
    [handleSimulateImport]
  );

  const selectedRollsColumns = useMemo<ColumnDef<SelectedInventoryRoll>[]>(
    () => [
      { accessorKey: "RollNo", header: "Roll No" },
      { accessorKey: "Color", header: "Color" },
      { accessorKey: "LotNo", header: "Lot No" },
      { accessorKey: "BalanceYards", header: "Balance (yds)" },
      {
        accessorKey: "issuedYards",
        header: "Issue (yds)",
        cell: ({ row }) => (
          <Input
            type="number"
            value={row.original.issuedYards}
            onChange={(e) =>
              handleIssuedYardsChange(
                row.original.QRCode,
                parseFloat(e.target.value) || 0
              )
            }
            className="w-24"
            max={row.original.BalanceYards}
            step="0.1"
          />
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveSelectedRoll(row.original)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [handleIssuedYardsChange, handleRemoveSelectedRoll]
  );

  const availableInventoryColumns = useMemo<ColumnDef<InventoryRoll>[]>(
    () => [
      { accessorKey: "DateInHouse", header: "In-House Date" },
      { accessorKey: "RollNo", header: "Roll No" },
      {
        accessorKey: "Color",
        header: "Color",
        cell: ({ row }) => (
          <span
            className={
              row.original.Color !== fabricRequirements[0]?.color
                ? "text-orange-600 font-semibold"
                : ""
            }
          >
            {row.original.Color}
          </span>
        ),
      },
      { accessorKey: "LotNo", header: "Lot No" },
      {
        accessorKey: "BalanceYards",
        header: "Available (yds)",
        cell: ({ row }) => row.original.BalanceYards.toLocaleString(),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAddRollFromInventory(row.original)}
            className="text-green-600 hover:text-green-800"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        ),
      },
    ],
    [fabricRequirements, handleAddRollFromInventory]
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Select JOBs to Process</CardTitle>
          <CardDescription>
            Import data for ERP/QC checks. You can select multiple valid JOBs to
            issue at once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by JOB..."
                value={jobSearchTerm}
                onChange={(e) => setJobSearchTerm(e.target.value)}
                className="pl-8 w-full md:w-64"
              />
            </div>
            <Button
              onClick={handleProceedToIssue}
              disabled={selectedJobIds.size === 0 || isIssuing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Issue Fabric for ({selectedJobIds.size}) JOBs
              <ArrowRightCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>
          {isLoading ? (
            <p className="text-center text-gray-500 py-4">Loading jobs...</p>
          ) : (
            <CustomTable
              columns={jobStatusColumns}
              data={filteredJobs}
              onSelectionChange={handleJobSelectionChange}
              showColumnVisibility={false}
              enableRowSelection={(row: Row<CuttingPlanJob>) =>
                row.original.erpChecked && row.original.qcChecked
              }
            />
          )}
        </CardContent>
      </Card>

      {isIssuing && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle>
                Step 2: Review and Confirm Fabric Issuance for (
                {selectedJobs.length}) JOBs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <Card>
                  <CardHeader>
                    <p className="text-sm text-blue-800 font-medium">
                      Total Required
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {totalRequiredYards.toLocaleString()} yds
                    </p>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <p className="text-sm text-green-800 font-medium">
                      Total Selected
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {totalIssuedYards.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{" "}
                      yds
                    </p>
                  </CardHeader>
                </Card>
                <Card
                  className={
                    totalIssuedYards < totalRequiredYards ? "bg-red-50" : ""
                  }
                >
                  <CardHeader>
                    <p
                      className={`text-sm font-medium ${
                        totalIssuedYards < totalRequiredYards
                          ? "text-red-800"
                          : "text-green-800"
                      }`}
                    >
                      {totalIssuedYards < totalRequiredYards
                        ? "Shortage"
                        : "Surplus"}
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        totalIssuedYards < totalRequiredYards
                          ? "text-red-900"
                          : "text-green-900"
                      }`}
                    >
                      {Math.abs(
                        totalRequiredYards - totalIssuedYards
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{" "}
                      yds
                    </p>
                  </CardHeader>
                </Card>
              </div>
              {isSearchingInventory && (
                <p className="text-center text-blue-600 mt-4">
                  Searching inventory...
                </p>
              )}
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleFinishIssuance}
                  disabled={selectedRolls.length === 0 || isFinishing}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ArrowRightCircle className="h-5 w-5 mr-2" />
                  {isFinishing ? "Processing..." : "Finish Issuance"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Selected Rolls for Issuance</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomTable
                  columns={selectedRollsColumns}
                  data={selectedRolls}
                  showCheckbox={false}
                  showColumnVisibility={false}
                />
              </CardContent>
            </Card>

            <Card
              className={
                shortageInfo ? "border-2 border-dashed border-orange-400" : ""
              }
            >
              <CardHeader>
                <CardTitle
                  className={shortageInfo ? "text-orange-800" : "text-gray-800"}
                >
                  {shortageInfo
                    ? `Shortage! Select Substitute Rolls (Item: ${shortageInfo.itemCode})`
                    : `Available Inventory (Item: ${
                        fabricRequirements[0]?.itemCode || "N/A"
                      })`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomTable
                  columns={availableInventoryColumns}
                  data={availableInventoryRolls}
                  showCheckbox={false}
                  showColumnVisibility={false}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default IssueFabricFromJobPage;
