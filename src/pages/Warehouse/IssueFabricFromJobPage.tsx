// Path: src/pages/issue-fabric-from-job/IssueFabricFromJobPage.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ArrowRightCircle,
  Trash2,
  PlusCircle,
  CheckCircle2,
  Search,
  Info,
  XCircle,
  MinusCircle,
  Check, // [NEW] Added Check icon for Progress Bar
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CustomTable } from "@/components/ui/custom-table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// --- START OF INLINED FILE: src/pages/issue-fabric-form/types.ts ---

interface CuttingPlanJob {
  ID: string;
  PlanName: string;
  Factory: string;
  PlanDate: string;
  Style: string;
  JOB: string;
  Lot: string;
  PONumber: string;
  ItemCode: string;
  Color: string;
  ColorCode: string;
  RequestQuantity: number;
  IssuedQuantity: number;
  Status: "Planned" | "In Progress" | "Completed";
  QCStatus: "Pass" | "Fail";
  CreatedBy: string;
  Remarks: string;
  erpChecked: boolean;
  qcChecked: boolean;
}

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

interface SelectedInventoryRoll extends InventoryRoll {
  issuedYards: number;
}

// --- END OF INLINED FILE: src/pages/issue-fabric-form/types.ts ---

// --- START OF INLINED FILE: src/pages/issue-fabric-form/data.ts ---

const MOCK_CUTTING_PLAN_JOBS: CuttingPlanJob[] = [
  {
    ID: "CP001",
    PlanName: "T-Shirt Cutting Plan Phase 1",
    Factory: "F1",
    PlanDate: "2025-10-20",
    Style: "TSH-001",
    JOB: "JOB-101",
    Lot: "L-2025-01",
    PONumber: "PO-KD-9981",
    ItemCode: "CTN-005",
    Color: "White",
    ColorCode: "11-0601 TCX",
    RequestQuantity: 500,
    IssuedQuantity: 0,
    Status: "Planned",
    QCStatus: "Pass",
    CreatedBy: "an.nguyen",
    Remarks: "High priority.",
    erpChecked: true,
    qcChecked: true,
  },
  {
    ID: "CP002",
    PlanName: "Men's Jean Cutting Plan",
    Factory: "F1",
    PlanDate: "2025-10-21",
    Style: "JEA-002",
    JOB: "JOB-102",
    Lot: "L-2025-02",
    PONumber: "PO-JEAN-2024",
    ItemCode: "DNM-003",
    Color: "Dark Blue",
    ColorCode: "19-4050 TCX",
    RequestQuantity: 350,
    IssuedQuantity: 0,
    Status: "Planned",
    QCStatus: "Fail",
    CreatedBy: "an.nguyen",
    Remarks: "Denim fabric needs shrinkage test.",
    erpChecked: true,
    qcChecked: false,
  },
  {
    ID: "CP003",
    PlanName: "One-piece Dress Cutting Plan",
    Factory: "F2",
    PlanDate: "2025-10-22",
    Style: "DRS-004",
    JOB: "JOB-103",
    Lot: "L-2025-03",
    PONumber: "PO-DRESS-007",
    ItemCode: "SIL-001",
    Color: "Maroon",
    ColorCode: "18-1619 TCX",
    RequestQuantity: 200,
    IssuedQuantity: 150,
    Status: "In Progress",
    QCStatus: "Pass",
    CreatedBy: "bao.tran",
    Remarks: "Fabric received fully.",
    erpChecked: false,
    qcChecked: true,
  },
  {
    ID: "CP004",
    PlanName: "Women's Shirt Cutting Plan",
    Factory: "F2",
    PlanDate: "2025-10-23",
    Style: "SHT-003",
    JOB: "JOB-104",
    Lot: "L-2025-04",
    PONumber: "PO-SHIRT-112",
    ItemCode: "POP-002",
    Color: "Light Blue",
    ColorCode: "14-4115 TCX",
    RequestQuantity: 420,
    IssuedQuantity: 0,
    Status: "Planned",
    QCStatus: "Pass",
    CreatedBy: "chi.le",
    Remarks: "Check marker before cutting.",
    erpChecked: true,
    qcChecked: true,
  },
  {
    ID: "CP005",
    PlanName: "Test Fail QC",
    Factory: "F2",
    PlanDate: "2025-10-24",
    Style: "TEST-005",
    JOB: "JOB-105",
    Lot: "L-2025-05",
    PONumber: "PO-TEST-005",
    ItemCode: "TST-005",
    Color: "Black",
    ColorCode: "19-0000 TCX",
    RequestQuantity: 100,
    IssuedQuantity: 0,
    Status: "Planned",
    QCStatus: "Fail",
    CreatedBy: "system",
    Remarks: "Failed QC test.",
    erpChecked: true,
    qcChecked: true,
  },
];

const MOCK_INVENTORY_ROLLS: InventoryRoll[] = [
  {
    PONumber: "POPU0018251",
    ItemCode: "DNM-003",
    Factory: "Factory A",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-001",
    ColorCode: "19-4050 TCX",
    Color: "Dark Blue",
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
    PONumber: "SSPU0002939",
    ItemCode: "CTN-005",
    Factory: "Factory C",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-009",
    ColorCode: "11-0601 TCX",
    Color: "White",
    RollNo: "1",
    LotNo: "225628091",
    Yards: 90,
    BalanceYards: 90,
    Location: "C3-11",
    QCStatus: "Passed",
    QRCode: "QR-16812",
    DateInHouse: "2023-05-05",
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchingInventory, setIsSearchingInventory] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // State for Job Detail Popup
  const [viewingJob, setViewingJob] = useState<CuttingPlanJob | null>(null);

  // [NEW] Logic for Progress Bar
  const currentStep = useMemo(() => {
    if (isFinishing) return 3;
    if (isIssuing) return 2;
    return 1;
  }, [isIssuing, isFinishing]);

  const steps = [
    { id: 1, name: "Step 1", description: "Select JOBs" },
    { id: 2, name: "Step 2", description: "Review & Issue" },
    { id: 3, name: "Finish", description: "Complete" },
  ];

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

  const displayAvailableRolls = useMemo(() => {
    const splitRemainders = selectedRolls
      .filter((roll) => roll.BalanceYards > roll.issuedYards)
      .map((roll) => ({
        ...roll,
        BalanceYards: parseFloat(
          (roll.BalanceYards - roll.issuedYards).toFixed(2)
        ),
        isRemainder: true,
      })) as InventoryRoll[];

    return [...availableInventoryRolls, ...splitRemainders].sort((a, b) =>
      a.RollNo.localeCompare(b.RollNo)
    );
  }, [availableInventoryRolls, selectedRolls]);

  // Logic for Auto-allocation
  useEffect(() => {
    if (isIssuing && fabricRequirements.length > 0) {
      const processFabricRequest = async () => {
        setIsSearchingInventory(true);
        setShortageInfo(null);

        let finalSelectedRolls: SelectedInventoryRoll[] = [];
        let finalAvailableRolls: InventoryRoll[] = [];
        let foundShortage = null;

        for (const req of fabricRequirements) {
          const { itemCode, color, requiredYards } = req;

          const allMatchingRolls = await getInventoryByItem(itemCode, color);
          const sortedRolls = [...allMatchingRolls].sort(
            (a, b) => a.BalanceYards - b.BalanceYards
          );

          let yardsToFulfill = requiredYards;
          const currentTypeSelectedRolls: SelectedInventoryRoll[] = [];

          for (const roll of sortedRolls) {
            if (yardsToFulfill <= 0) break;
            const yardsToIssue = Math.min(roll.BalanceYards, yardsToFulfill);
            currentTypeSelectedRolls.push({
              ...roll,
              issuedYards: yardsToIssue,
            });
            yardsToFulfill -= yardsToIssue;
          }

          finalSelectedRolls = [
            ...finalSelectedRolls,
            ...currentTypeSelectedRolls,
          ];

          const selectedQRCodes = new Set(
            currentTypeSelectedRolls.map((r) => r.QRCode)
          );
          let availableRolls = allMatchingRolls.filter(
            (r) => !selectedQRCodes.has(r.QRCode)
          );

          if (yardsToFulfill > 0) {
            if (!foundShortage) {
              foundShortage = {
                itemCode,
                color,
                shortageYards: yardsToFulfill,
              };
            }
            const allItemRolls = await getInventoryByItemCode(itemCode);
            const currentQRCodes = new Set(
              allMatchingRolls.map((r) => r.QRCode)
            );
            const substituteRolls = allItemRolls.filter(
              (r) => !currentQRCodes.has(r.QRCode)
            );
            availableRolls = [...availableRolls, ...substituteRolls];
          }

          finalAvailableRolls = [...finalAvailableRolls, ...availableRolls];
        }

        setSelectedRolls(finalSelectedRolls);
        setAvailableInventoryRolls(finalAvailableRolls);
        setShortageInfo(foundShortage);
        setIsSearchingInventory(false);
      };

      processFabricRequest();
    }
  }, [isIssuing, fabricRequirements, totalRequiredYards]);

  const handleProceedToIssue = useCallback(() => {
    if (selectedJobIds.size > 0) {
      setIsIssuing(true);
    }
  }, [selectedJobIds]);

  const handleJobSelectionChange = useCallback(
    (selectedItems: CuttingPlanJob[]) => {
      setSelectedJobIds(new Set(selectedItems.map((item) => item.ID)));
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
    setSelectedRolls((prev) => {
      const existingIndex = prev.findIndex(
        (r) => r.QRCode === rollToAdd.QRCode
      );

      if (existingIndex >= 0) {
        const updatedRolls = [...prev];
        updatedRolls[existingIndex] = {
          ...updatedRolls[existingIndex],
          issuedYards: updatedRolls[existingIndex].BalanceYards,
        };
        return updatedRolls;
      } else {
        return [...prev, { ...rollToAdd, issuedYards: rollToAdd.BalanceYards }];
      }
    });

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
          `Warning: Issuing with shortage of ${shortage.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 2,
            }
          )} yds.\nDo you really want to proceed?`
        )
      ) {
        return;
      }
    }

    setIsFinishing(true);
    setTimeout(() => {
      alert("Fabric issuance successful!");
      setIsFinishing(false);
      setAllJobs((prev) => prev.filter((j) => !selectedJobIds.has(j.ID)));
      setSelectedJobIds(new Set());
      setIsIssuing(false);
    }, 2000);
  }, [totalIssuedYards, totalRequiredYards, selectedJobIds]);

  const handleViewJobDetails = useCallback((job: CuttingPlanJob) => {
    setViewingJob(job);
  }, []);

  const jobStatusColumns = useMemo<ColumnDef<CuttingPlanJob>[]>(
    () => [
      {
        accessorKey: "JOB",
        header: "JOB",
        cell: ({ row }) => (
          <div
            className="flex items-center space-x-2 group cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleViewJobDetails(row.original);
            }}
          >
            <span className="font-medium text-blue-600 group-hover:underline">
              {row.original.JOB}
            </span>
            <Info className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
          </div>
        ),
      },
      {
        accessorKey: "ItemCode",
        header: "Item Code",
        cell: ({ row }) =>
          row.original.erpChecked ? row.original.ItemCode : "-",
      },
      {
        accessorKey: "Color",
        header: "Color",
        cell: ({ row }) => (row.original.erpChecked ? row.original.Color : "-"),
      },
      {
        accessorKey: "ColorCode",
        header: "Color Code",
        cell: ({ row }) =>
          row.original.erpChecked ? row.original.ColorCode : "-",
      },
      {
        accessorKey: "RequestQuantity",
        header: "Required Qty",
        cell: ({ row }) =>
          row.original.erpChecked ? row.original.RequestQuantity : "-",
      },
      {
        accessorKey: "Lot",
        header: "Lot",
        cell: ({ row }) => (row.original.erpChecked ? row.original.Lot : "-"),
      },
      {
        accessorKey: "erpChecked",
        header: () => <div className="text-center">ERP Check</div>,
        cell: ({ row }) => (
          <div
            className="flex justify-center"
            title={row.original.erpChecked ? "Have data" : "No data"}
          >
            {row.original.erpChecked ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <MinusCircle className="h-6 w-6 text-gray-300" />
            )}
          </div>
        ),
      },
      {
        accessorKey: "qcChecked",
        header: () => <div className="text-center">QC Check</div>,
        cell: ({ row }) => {
          const { qcChecked, QCStatus } = row.original;
          if (!qcChecked) {
            return (
              <div className="flex justify-center" title="QC Null">
                <MinusCircle className="h-6 w-6 text-gray-300" />
              </div>
            );
          }
          if (QCStatus === "Fail") {
            return (
              <div className="flex justify-center" title="QC Fail">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            );
          }
          return (
            <div className="flex justify-center" title="QC Pass">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          );
        },
      },
    ],
    [handleViewJobDetails]
  );

  const selectedRollsColumns = useMemo<ColumnDef<SelectedInventoryRoll>[]>(
    () => [
      { accessorKey: "RollNo", header: "Roll No" },
      { accessorKey: "Color", header: "Color" },
      { accessorKey: "ColorCode", header: "Color Code" },
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
        cell: ({ row }) => {
          const isRequiredColor = fabricRequirements.some(
            (req) =>
              req.itemCode === row.original.ItemCode &&
              req.color === row.original.Color
          );
          return (
            <div className="flex flex-col">
              <span
                className={
                  !isRequiredColor ? "text-orange-600 font-semibold" : ""
                }
              >
                {row.original.Color}
              </span>
              <span className="text-xs text-gray-400">
                {row.original.ColorCode}
              </span>
            </div>
          );
        },
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Issue fabric form
        </h1>
      </div>

      {/* --- START: PROGRESS BAR UI --- */}
      <div className="w-full mx-auto mb-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center w-full">
            {steps.map((step, stepIdx) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <li
                  key={step.name}
                  // [CHANGE] Xóa padding cố định (pr-8...), thêm flex-1 để chia đều chiều rộng
                  className="relative flex flex-col items-center flex-1"
                >
                  {stepIdx !== steps.length - 1 && (
                    // [CHANGE] Chỉnh left-1/2 và w-full để đường kẻ nối từ tâm vòng tròn này sang tâm vòng tròn kia
                    <div
                      className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 -ml-px"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full transition-all duration-500 ease-in-out ${
                          currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                        }`}
                        style={{ width: "100%" }}
                      />
                    </div>
                  )}
                  <div className="group relative flex flex-col items-center group z-10">
                    {" "}
                    {/* Thêm z-10 để icon đè lên đường kẻ */}
                    <span className="flex h-9 items-center" aria-hidden="true">
                      {isCompleted ? (
                        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition">
                          <Check
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      ) : isCurrent ? (
                        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        </span>
                      ) : (
                        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400 transition">
                          <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                        </span>
                      )}
                    </span>
                    <span className="mt-2 flex flex-col items-center min-w-[100px]">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          isCurrent || isCompleted
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {step.description}
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
      {/* --- END: PROGRESS BAR UI --- */}

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Select JOBs to Process</CardTitle>
          <CardDescription>
            Select valid JOBs (ERP Checked & QC Passed) to issue fabric.
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
                row.original.erpChecked &&
                row.original.qcChecked &&
                row.original.QCStatus === "Pass"
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
                        fabricRequirements[0]?.itemCode || "Mixed"
                      })`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomTable
                  columns={availableInventoryColumns}
                  data={displayAvailableRolls}
                  showCheckbox={false}
                  showColumnVisibility={false}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Dialog for JOB Details */}
      <Dialog
        open={!!viewingJob}
        onOpenChange={(open) => !open && setViewingJob(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>JOB Details: {viewingJob?.JOB}</DialogTitle>
            <DialogDescription>
              {viewingJob?.erpChecked
                ? "Detailed information for the selected JOB"
                : ""}
            </DialogDescription>
          </DialogHeader>

          {viewingJob && (
            <>
              {!viewingJob.erpChecked ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                  <Info className="h-10 w-10 text-gray-300" />
                  <p>Information not available. Please perform ERP Check.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      PO Number
                    </span>
                    <p className="text-sm font-bold text-blue-800">
                      {viewingJob.PONumber}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Lot
                    </span>
                    <p className="text-sm font-medium">{viewingJob.Lot}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Item Code
                    </span>
                    <p className="text-sm font-medium">{viewingJob.ItemCode}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Color Code
                    </span>
                    <p className="text-sm font-medium">
                      {viewingJob.ColorCode}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Color
                    </span>
                    <p className="text-sm font-medium">{viewingJob.Color}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Request Qty
                    </span>
                    <p className="text-sm font-medium">
                      {viewingJob.RequestQuantity}
                    </p>
                  </div>

                  {viewingJob.qcChecked && (
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        QC Status
                      </span>
                      <div>
                        <Badge
                          variant={
                            viewingJob.QCStatus === "Pass"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            viewingJob.QCStatus === "Pass"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }
                        >
                          {viewingJob.QCStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Created By
                    </span>
                    <p className="text-sm font-medium">
                      {viewingJob.CreatedBy}
                    </p>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Remarks
                    </span>
                    <p className="text-sm font-medium bg-slate-100 p-2 rounded">
                      {viewingJob.Remarks || "No remarks"}
                    </p>
                  </div>

                  <div className="col-span-2 flex gap-4 pt-2 border-t mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        System Checks:
                      </span>
                    </div>
                    <Badge
                      variant={viewingJob.erpChecked ? "outline" : "secondary"}
                      className={
                        viewingJob.erpChecked
                          ? "border-green-600 text-green-700"
                          : ""
                      }
                    >
                      ERP: {viewingJob.erpChecked ? "Synced" : "Pending"}
                    </Badge>
                    <Badge
                      variant={viewingJob.qcChecked ? "outline" : "secondary"}
                      className={
                        viewingJob.qcChecked
                          ? "border-green-600 text-green-700"
                          : ""
                      }
                    >
                      QC Check: {viewingJob.qcChecked ? "Done" : "Pending"}
                    </Badge>
                  </div>
                </div>
              )}
            </>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setViewingJob(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IssueFabricFromJobPage;
