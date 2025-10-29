import React, { useState, useEffect, useMemo } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  PlayIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

// --- START OF INLINED FILE: src/pages/issue-fabric-form/types.ts ---

// Dữ liệu cho một JOB trong kế hoạch cắt
interface CuttingPlanJob {
  ID: string;
  PlanName: string;
  Factory: string;
  PlanDate: string; // Sử dụng string cho đơn giản, có thể dùng Date
  Style: string;
  JOB: string;
  ItemCode: string;
  Color: string;
  RequestQuantity: number;
  IssuedQuantity: number;
  Status: "Planned" | "In Progress" | "Completed";
  CreatedBy: string;
  Remarks: string;
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
  Yards: number; // Tổng số yards ban đầu
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
  BalanceYards: number; // Số yards còn lại
  HourStandard: number;
  HourRelax: number;
  RelaxDate: string;
  RelaxTime: string;
  RelaxBy: string;
  ParentQRCode: string | null;
}

// Dữ liệu cho một cuộn vải đã được chọn để xuất
interface SelectedInventoryRoll extends InventoryRoll {
  issuedYards: number; // Số yards người dùng nhập để xuất
}

// --- END OF INLINED FILE: src/pages/issue-fabric-form/types.ts ---

// --- START OF INLINED FILE: src/pages/issue-fabric-form/data.ts ---

// --- DỮ LIỆU GIẢ CHO CUTTING PLAN ---
const MOCK_CUTTING_PLAN_JOBS: CuttingPlanJob[] = [
  // ... (dữ liệu cũ không đổi)
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
  },
  {
    ID: "CP005",
    PlanName: "Kế hoạch cắt áo khoác bomber",
    Factory: "F3",
    PlanDate: "2025-10-25",
    Style: "JCK-005",
    JOB: "JOB-105",
    ItemCode: "NYL-007",
    Color: "Đen",
    RequestQuantity: 150,
    IssuedQuantity: 150,
    Status: "Completed",
    CreatedBy: "bao.tran",
    Remarks: "Đã hoàn thành, chờ chuyển sang may.",
  },
];

// --- DỮ LIỆU GIẢ CHO INVENTORY ---
const MOCK_INVENTORY_ROLLS: InventoryRoll[] = [
  // Vải cho JOB-102 (DNM-003, Xanh đậm) - cố tình để số lượng ít để tạo ra thiếu hụt
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
    PONumber: "POPU0018253",
    ItemCode: "DNM-003",
    Factory: "Factory A",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-016",
    ColorCode: "CC-003",
    Color: "Xanh đậm",
    RollNo: "3",
    LotNo: "225628095",
    Yards: 150,
    BalanceYards: 150,
    Location: "A1-03",
    QCStatus: "Passed",
    QRCode: "QR-33962",
    DateInHouse: "2023-06-10",
  },

  // Dữ liệu mới: Vải cùng ItemCode DNM-003 nhưng khác màu để test chức năng chọn bổ sung
  {
    PONumber: "POPU0018255",
    ItemCode: "DNM-003",
    Factory: "Factory A",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-020",
    ColorCode: "CC-004",
    Color: "Xanh nhạt",
    RollNo: "10",
    LotNo: "225628100",
    Yards: 200,
    BalanceYards: 200,
    Location: "B2-05",
    QCStatus: "Passed",
    QRCode: "QR-33970",
    DateInHouse: "2023-07-15",
  },
  {
    PONumber: "POPU0018256",
    ItemCode: "DNM-003",
    Factory: "Factory A",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-020",
    ColorCode: "CC-005",
    Color: "Đen",
    RollNo: "11",
    LotNo: "225628101",
    Yards: 180,
    BalanceYards: 180,
    Location: "B2-06",
    QCStatus: "Passed",
    QRCode: "QR-33971",
    DateInHouse: "2023-07-15",
  },

  // Vải cho JOB-101 (CTN-005, Trắng) - đủ số lượng VÀ CÓ DƯ
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
    PONumber: "SSPU0002941",
    ItemCode: "CTN-005",
    Factory: "Factory C",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-010",
    ColorCode: "CC-002",
    Color: "Trắng",
    RollNo: "3",
    LotNo: "225628093",
    Yards: 115.5,
    BalanceYards: 115.5,
    Location: "C3-13",
    QCStatus: "Passed",
    QRCode: "QR-16814",
    DateInHouse: "2023-05-05",
  },
  {
    PONumber: "SSPU0002942",
    ItemCode: "CTN-005",
    Factory: "Factory C",
    Supplier: "Supplier Y",
    InvoiceNo: "INV-010",
    ColorCode: "CC-002",
    Color: "Trắng",
    RollNo: "4",
    LotNo: "225628093",
    Yards: 300,
    BalanceYards: 300,
    Location: "C4-01",
    QCStatus: "Passed",
    QRCode: "QR-16815",
    DateInHouse: "2023-05-06",
  },
  // *** NEW DATA ADDED TO CREATE A SURPLUS FOR DEMONSTRATION ***
  {
    PONumber: "SSPU0002950",
    ItemCode: "CTN-005",
    Factory: "Factory C",
    Supplier: "Supplier Z",
    InvoiceNo: "INV-015",
    ColorCode: "CC-002",
    Color: "Trắng",
    RollNo: "5",
    LotNo: "225628099",
    Yards: 150,
    BalanceYards: 150,
    Location: "C4-02",
    QCStatus: "Passed",
    QRCode: "QR-16816",
    DateInHouse: "2023-05-10",
  },
  {
    PONumber: "SSPU0002951",
    ItemCode: "CTN-005",
    Factory: "Factory C",
    Supplier: "Supplier Z",
    InvoiceNo: "INV-015",
    ColorCode: "CC-002",
    Color: "Trắng",
    RollNo: "6",
    LotNo: "225628099",
    Yards: 250,
    BalanceYards: 250,
    Location: "C4-03",
    QCStatus: "Passed",
    QRCode: "QR-16817",
    DateInHouse: "2023-05-10",
  },

  // ... (phần còn lại của dữ liệu giả)
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

// --- CÁC HÀM API GIẢ ---

const getCuttingPlanJobs = (): Promise<CuttingPlanJob[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CUTTING_PLAN_JOBS);
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

// Lấy danh sách cuộn vải trong kho chỉ theo Item Code (bất kể màu)
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
  // --- STATE MANAGEMENT ---
  const [allJobs, setAllJobs] = useState<CuttingPlanJob[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
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
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false); // State cho nút Finish

  // --- DERIVED STATE & CALCULATIONS (useMemo for optimization) ---

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

  // --- LOGIC & SIDE EFFECTS (useEffect) ---

  useEffect(() => {
    if (fabricRequirements.length === 0) {
      setSelectedRolls([]);
      setAvailableInventoryRolls([]);
      setShortageInfo(null);
      return;
    }

    const processFabricRequest = async () => {
      setIsLoading(true);
      setShortageInfo(null);

      const mainRequirement = fabricRequirements[0];
      if (!mainRequirement) {
        setIsLoading(false);
        return;
      }

      const { itemCode, color, requiredYards } = mainRequirement;
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
      setIsLoading(false);
    };

    processFabricRequest();
  }, [fabricRequirements]);

  // --- HANDLER FUNCTIONS ---

  const handleUploadKanban = () => {
    setIsUploading(true);
    setSelectedJobIds(new Set());
    getCuttingPlanJobs().then((data) => {
      setAllJobs(data.filter((job) => job.Status !== "Completed"));
      setIsUploading(false);
    });
  };

  const handleJobSelectionChange = (jobId: string, isSelected: boolean) => {
    setSelectedJobIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) newSet.add(jobId);
      else newSet.delete(jobId);
      return newSet;
    });
  };

  const handleIssuedYardsChange = (qrCode: string, newYards: number) => {
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
  };

  const handleAddRollFromInventory = (rollToAdd: InventoryRoll) => {
    setSelectedRolls((prev) => [
      ...prev,
      { ...rollToAdd, issuedYards: rollToAdd.BalanceYards },
    ]);
    setAvailableInventoryRolls((prev) =>
      prev.filter((r) => r.QRCode !== rollToAdd.QRCode)
    );
  };

  const handleRemoveSelectedRoll = (rollToRemove: SelectedInventoryRoll) => {
    setSelectedRolls((prev) =>
      prev.filter((r) => r.QRCode !== rollToRemove.QRCode)
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { issuedYards, ...originalRoll } = rollToRemove;
    setAvailableInventoryRolls((prev) =>
      [...prev, originalRoll].sort((a, b) => a.RollNo.localeCompare(b.RollNo))
    );
  };

  // Hàm xử lý khi nhấn nút Finish
  const handleFinishIssuance = () => {
    const shortage = totalRequiredYards - totalIssuedYards;
    if (shortage > 0) {
      if (
        !window.confirm(
          `Cảnh báo: Đang cấp phát thiếu ${shortage.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })} yds.\nBạn có chắc chắn muốn tiếp tục?`
        )
      ) {
        return; // User nhấn Cancel
      }
    }

    setIsFinishing(true);
    console.log("--- BẮT ĐẦU QUÁ TRÌNH CẤP PHÁT ---");
    console.log("Các JOB được chọn:", selectedJobs);
    console.log("Các cuộn vải được cấp phát:", selectedRolls);
    console.log("Tổng yêu cầu:", totalRequiredYards);
    console.log("Tổng cấp phát:", totalIssuedYards);

    // Mô phỏng API call mất 2 giây
    setTimeout(() => {
      alert("Cấp phát vải thành công!");

      // Reset state để chuẩn bị cho lần làm việc tiếp theo
      setAllJobs([]);
      setSelectedJobIds(new Set());
      setSelectedRolls([]);
      setAvailableInventoryRolls([]);
      setShortageInfo(null);
      setIsFinishing(false);
    }, 2000);
  };

  // --- RENDER ---

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Issue Fabric From JOB
        </h1>
        <p className="text-gray-600">
          Upload a Kanban file, select JOBs, and the system will automatically
          propose fabric from inventory.
        </p>
      </header>

      {/* Upload and JOBs Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            1. Select JOBs to Issue Fabric
          </h2>
          <button
            onClick={handleUploadKanban}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          >
            <PlayIcon className="h-5 w-5" />
            {isUploading ? "Uploading..." : "Upload Kanban from Excel"}
          </button>
        </div>

        {allJobs.length > 0 ? (
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 w-12">Select</th>
                  <th className="px-4 py-3">JOB</th>
                  <th className="px-4 py-3">Item Code</th>
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Required Qty</th>
                  <th className="px-4 py-3">Style</th>
                </tr>
              </thead>
              <tbody>
                {allJobs.map((job) => (
                  <tr
                    key={job.ID}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedJobIds.has(job.ID)}
                        onChange={(e) =>
                          handleJobSelectionChange(job.ID, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {job.JOB}
                    </td>
                    <td className="px-4 py-2">{job.ItemCode}</td>
                    <td className="px-4 py-2">{job.Color}</td>
                    <td className="px-4 py-2 font-semibold">
                      {job.RequestQuantity.toLocaleString()} yds
                    </td>
                    <td className="px-4 py-2">{job.Style}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Please upload a Kanban file to start.
          </p>
        )}
      </div>

      {/* Summary & Fabric Tables Section */}
      {selectedJobIds.size > 0 && (
        <>
          {/* Summary Panel */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-8 sticky top-0 z-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              2. Review and Issue Fabric
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800 font-medium">
                  Total Required
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalRequiredYards.toLocaleString()} yds
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-green-800 font-medium">
                  Total Selected
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {totalIssuedYards.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  yds
                </p>
              </div>
              <div
                className={`p-3 rounded-md ${
                  totalIssuedYards < totalRequiredYards
                    ? "bg-red-50"
                    : "bg-green-50"
                }`}
              >
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
                  {(totalRequiredYards - totalIssuedYards).toLocaleString(
                    undefined,
                    { maximumFractionDigits: 2 }
                  )}{" "}
                  yds
                </p>
              </div>
            </div>
            {isLoading && (
              <p className="text-center text-blue-600 mt-4">
                Searching inventory...
              </p>
            )}

            {/* --- THÊM NÚT FINISH TẠI ĐÂY --- */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleFinishIssuance}
                disabled={selectedRolls.length === 0 || isFinishing}
                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRightCircleIcon className="h-5 w-5" />
                {isFinishing ? "Processing..." : "Finish Issuance"}
              </button>
            </div>
          </div>

          {/* 2-Column Layout: Selected Rolls vs. Available Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: SELECTED ROLLS */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Selected Rolls for Issuance
              </h3>
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-3">Roll No</th>
                      <th className="px-3 py-3">Color</th>
                      <th className="px-3 py-3">Lot No</th>
                      <th className="px-3 py-3">Balance (yds)</th>
                      <th className="px-3 py-3">Issue (yds)</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRolls.map((roll) => (
                      <tr
                        key={roll.QRCode}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 font-medium">{roll.RollNo}</td>
                        <td className="px-3 py-2">{roll.Color}</td>
                        <td className="px-3 py-2">{roll.LotNo}</td>
                        <td className="px-3 py-2">
                          {roll.BalanceYards.toLocaleString()}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={roll.issuedYards}
                            onChange={(e) =>
                              handleIssuedYardsChange(
                                roll.QRCode,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24 p-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            max={roll.BalanceYards}
                            step="0.1"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleRemoveSelectedRoll(roll)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {selectedRolls.length === 0 && !isLoading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          No rolls have been selected.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT COLUMN: AVAILABLE INVENTORY */}
            <div
              className={`bg-white p-6 rounded-lg shadow-md transition-all ${
                shortageInfo ? "border-2 border-dashed border-orange-400" : ""
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  shortageInfo ? "text-orange-800" : "text-gray-800"
                }`}
              >
                {shortageInfo
                  ? `Shortage! Select Substitute Rolls (Item: ${shortageInfo.itemCode})`
                  : `Available Inventory (Item: ${
                      fabricRequirements[0]?.itemCode || "N/A"
                    })`}
              </h3>
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead
                    className={`text-xs text-gray-700 uppercase sticky top-0 ${
                      shortageInfo ? "bg-orange-50" : "bg-gray-100"
                    }`}
                  >
                    <tr>
                      <th className="px-3 py-3">In-House Date</th>
                      <th className="px-3 py-3">Roll No</th>
                      <th className="px-3 py-3">Color</th>
                      <th className="px-3 py-3">Lot No</th>
                      <th className="px-3 py-3">Available (yds)</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableInventoryRolls.map((roll) => (
                      <tr
                        key={roll.QRCode}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-3 py-2">{roll.DateInHouse}</td>
                        <td className="px-3 py-2 font-medium">{roll.RollNo}</td>
                        <td
                          className={`px-3 py-2 ${
                            roll.Color !== fabricRequirements[0]?.color
                              ? "text-orange-600 font-semibold"
                              : ""
                          }`}
                        >
                          {roll.Color}
                        </td>
                        <td className="px-3 py-2">{roll.LotNo}</td>
                        <td className="px-3 py-2 font-semibold">
                          {roll.BalanceYards.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleAddRollFromInventory(roll)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <PlusCircleIcon className="h-6 w-6" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {availableInventoryRolls.length === 0 && !isLoading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          No other rolls available in inventory.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IssueFabricFromJobPage;
