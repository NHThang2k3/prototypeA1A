// Path: src/pages/issue-fabric-form/data.ts

import type { CuttingPlanJob, InventoryRoll } from "./types";

// --- DỮ LIỆU GIẢ CHO CUTTING PLAN ---
const MOCK_CUTTING_PLAN_JOBS: CuttingPlanJob[] = [
  // ... (dữ liệu cũ không đổi)
  { ID: "CP001", PlanName: "Kế hoạch cắt áo T-Shirt đợt 1", Factory: "F1", PlanDate: "2025-10-20", Style: "TSH-001", JOB: "JOB-101", ItemCode: "CTN-005", Color: "Trắng", RequestQuantity: 500, IssuedQuantity: 0, Status: "Planned", CreatedBy: "an.nguyen", Remarks: "Ưu tiên cắt trước." },
  { ID: "CP002", PlanName: "Kế hoạch cắt quần Jean nam", Factory: "F1", PlanDate: "2025-10-21", Style: "JEA-002", JOB: "JOB-102", ItemCode: "DNM-003", Color: "Xanh đậm", RequestQuantity: 350, IssuedQuantity: 0, Status: "Planned", CreatedBy: "an.nguyen", Remarks: "Vải denim cần kiểm tra độ co rút." },
  { ID: "CP003", PlanName: "Kế hoạch cắt váy liền thân", Factory: "F2", PlanDate: "2025-10-22", Style: "DRS-004", JOB: "JOB-103", ItemCode: "SIL-001", Color: "Đỏ đô", RequestQuantity: 200, IssuedQuantity: 150, Status: "In Progress", CreatedBy: "bao.tran", Remarks: "Đã nhận đủ vải." },
  { ID: "CP004", PlanName: "Kế hoạch cắt áo sơ mi nữ", Factory: "F2", PlanDate: "2025-10-23", Style: "SHT-003", JOB: "JOB-104", ItemCode: "POP-002", Color: "Xanh nhạt", RequestQuantity: 420, IssuedQuantity: 0, Status: "Planned", CreatedBy: "chi.le", Remarks: "Yêu cầu kiểm tra sơ đồ cắt." },
  { ID: "CP005", PlanName: "Kế hoạch cắt áo khoác bomber", Factory: "F3", PlanDate: "2025-10-25", Style: "JCK-005", JOB: "JOB-105", ItemCode: "NYL-007", Color: "Đen", RequestQuantity: 150, IssuedQuantity: 150, Status: "Completed", CreatedBy: "bao.tran", Remarks: "Đã hoàn thành, chờ chuyển sang may." },
];

// --- DỮ LIỆU GIẢ CHO INVENTORY ---
const MOCK_INVENTORY_ROLLS: InventoryRoll[] = [
  // Vải cho JOB-102 (DNM-003, Xanh đậm) - cố tình để số lượng ít để tạo ra thiếu hụt
  { PONumber: "POPU0018251", ItemCode: "DNM-003", Factory: "Factory A", Supplier: "Supplier Y", InvoiceNo: "INV-001", ColorCode: "CC-003", Color: "Xanh đậm", RollNo: "1", LotNo: "225628091", Yards: 65, BalanceYards: 46, Location: "A1-01", QCStatus: "Passed", QRCode: "QR-43468", DateInHouse: "2023-06-08" },
  { PONumber: "POPU0018252", ItemCode: "DNM-003", Factory: "Factory A", Supplier: "Supplier Y", InvoiceNo: "INV-001", ColorCode: "CC-003", Color: "Xanh đậm", RollNo: "2", LotNo: "225628092", Yards: 80, BalanceYards: 80, Location: "A1-02", QCStatus: "Passed", QRCode: "QR-33961", DateInHouse: "2023-06-08" },
  { PONumber: "POPU0018253", ItemCode: "DNM-003", Factory: "Factory A", Supplier: "Supplier Y", InvoiceNo: "INV-016", ColorCode: "CC-003", Color: "Xanh đậm", RollNo: "3", LotNo: "225628095", Yards: 150, BalanceYards: 150, Location: "A1-03", QCStatus: "Passed", QRCode: "QR-33962", DateInHouse: "2023-06-10" },

  // Dữ liệu mới: Vải cùng ItemCode DNM-003 nhưng khác màu để test chức năng chọn bổ sung
  { PONumber: "POPU0018255", ItemCode: "DNM-003", Factory: "Factory A", Supplier: "Supplier Y", InvoiceNo: "INV-020", ColorCode: "CC-004", Color: "Xanh nhạt", RollNo: "10", LotNo: "225628100", Yards: 200, BalanceYards: 200, Location: "B2-05", QCStatus: "Passed", QRCode: "QR-33970", DateInHouse: "2023-07-15" },
  { PONumber: "POPU0018256", ItemCode: "DNM-003", Factory: "Factory A", Supplier: "Supplier Y", InvoiceNo: "INV-020", ColorCode: "CC-005", Color: "Đen", RollNo: "11", LotNo: "225628101", Yards: 180, BalanceYards: 180, Location: "B2-06", QCStatus: "Passed", QRCode: "QR-33971", DateInHouse: "2023-07-15" },
  
  // Vải cho JOB-101 (CTN-005, Trắng) - đủ số lượng VÀ CÓ DƯ
  { PONumber: "SSPU0002939", ItemCode: "CTN-005", Factory: "Factory C", Supplier: "Supplier Y", InvoiceNo: "INV-009", ColorCode: "CC-002", Color: "Trắng", RollNo: "1", LotNo: "225628091", Yards: 90, BalanceYards: 90, Location: "C3-11", QCStatus: "Passed", QRCode: "QR-16812", DateInHouse: "2023-05-05" },
  { PONumber: "SSPU0002940", ItemCode: "CTN-005", Factory: "Factory C", Supplier: "Supplier Y", InvoiceNo: "INV-010", ColorCode: "CC-002", Color: "Trắng", RollNo: "2", LotNo: "225628093", Yards: 120, BalanceYards: 120, Location: "C3-12", QCStatus: "Passed", QRCode: "QR-16813", DateInHouse: "2023-05-05" },
  { PONumber: "SSPU0002941", ItemCode: "CTN-005", Factory: "Factory C", Supplier: "Supplier Y", InvoiceNo: "INV-010", ColorCode: "CC-002", Color: "Trắng", RollNo: "3", LotNo: "225628093", Yards: 115.5, BalanceYards: 115.5, Location: "C3-13", QCStatus: "Passed", QRCode: "QR-16814", DateInHouse: "2023-05-05" },
  { PONumber: "SSPU0002942", ItemCode: "CTN-005", Factory: "Factory C", Supplier: "Supplier Y", InvoiceNo: "INV-010", ColorCode: "CC-002", Color: "Trắng", RollNo: "4", LotNo: "225628093", Yards: 300, BalanceYards: 300, Location: "C4-01", QCStatus: "Passed", QRCode: "QR-16815", DateInHouse: "2023-05-06" },
  // *** NEW DATA ADDED TO CREATE A SURPLUS FOR DEMONSTRATION ***
  { PONumber: "SSPU0002950", ItemCode: "CTN-005", Factory: "Factory C", Supplier: "Supplier Z", InvoiceNo: "INV-015", ColorCode: "CC-002", Color: "Trắng", RollNo: "5", LotNo: "225628099", Yards: 150, BalanceYards: 150, Location: "C4-02", QCStatus: "Passed", QRCode: "QR-16816", DateInHouse: "2023-05-10" },
  { PONumber: "SSPU0002951", ItemCode: "CTN-005", Factory: "Factory C", Supplier: "Supplier Z", InvoiceNo: "INV-015", ColorCode: "CC-002", Color: "Trắng", RollNo: "6", LotNo: "225628099", Yards: 250, BalanceYards: 250, Location: "C4-03", QCStatus: "Passed", QRCode: "QR-16817", DateInHouse: "2023-05-10" },

  // ... (phần còn lại của dữ liệu giả)
].map(roll => ({ ...roll, Printed: true, Comment: "", QCBy: "System", QCDate: "2023-01-01", HourStandard: 24, HourRelax: 24, RelaxDate: "2023-01-01", RelaxTime: "10:00", RelaxBy: "System", ParentQRCode: null, Description: "", GrossWeightKgs: 0, NetWeightKgs: 0, Width: "60\"", InvoiceNo: roll.InvoiceNo || "N/A", Factory: roll.Factory || "N/A", Supplier: roll.Supplier || "N/A", ColorCode: roll.ColorCode || "N/A" })) as InventoryRoll[];


// --- CÁC HÀM API GIẢ ---

export const getCuttingPlanJobs = (): Promise<CuttingPlanJob[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CUTTING_PLAN_JOBS);
    }, 500);
  });
};

export const getInventoryByItem = (itemCode: string, color: string): Promise<InventoryRoll[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rolls = MOCK_INVENTORY_ROLLS.filter(
        (roll) => roll.ItemCode === itemCode && roll.Color === color && roll.BalanceYards > 0 && roll.QCStatus === "Passed"
      );
      resolve(rolls);
    }, 800);
  });
};

// Lấy danh sách cuộn vải trong kho chỉ theo Item Code (bất kể màu)
export const getInventoryByItemCode = (itemCode: string): Promise<InventoryRoll[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rolls = MOCK_INVENTORY_ROLLS.filter(
          (roll) => roll.ItemCode === itemCode && roll.BalanceYards > 0 && roll.QCStatus === "Passed"
        );
        resolve(rolls);
      }, 800);
    });
  };