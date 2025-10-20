// Path: src/pages/issue-fabric-form/data.ts

import type { CuttingPlanJob, InventoryRoll } from "./types";

// --- DỮ LIỆU GIẢ CHO CUTTING PLAN ---
const MOCK_CUTTING_PLAN_JOBS: CuttingPlanJob[] = [
  { ID: "CP001", PlanName: "Kế hoạch cắt áo T-Shirt đợt 1", Factory: "F1", PlanDate: "2025-10-20", Style: "TSH-001", JOB: "JOB-101", ItemCode: "CTN-005", Color: "Trắng", RequestQuantity: 500, IssuedQuantity: 0, Status: "Planned", CreatedBy: "an.nguyen", Remarks: "Ưu tiên cắt trước." },
  { ID: "CP002", PlanName: "Kế hoạch cắt quần Jean nam", Factory: "F1", PlanDate: "2025-10-21", Style: "JEA-002", JOB: "JOB-102", ItemCode: "DNM-003", Color: "Xanh đậm", RequestQuantity: 350, IssuedQuantity: 0, Status: "Planned", CreatedBy: "an.nguyen", Remarks: "Vải denim cần kiểm tra độ co rút." },
  { ID: "CP003", PlanName: "Kế hoạch cắt váy liền thân", Factory: "F2", PlanDate: "2025-10-22", Style: "DRS-004", JOB: "JOB-103", ItemCode: "SIL-001", Color: "Đỏ đô", RequestQuantity: 200, IssuedQuantity: 150, Status: "In Progress", CreatedBy: "bao.tran", Remarks: "Đã nhận đủ vải." },
  { ID: "CP004", PlanName: "Kế hoạch cắt áo sơ mi nữ", Factory: "F2", PlanDate: "2025-10-23", Style: "SHT-003", JOB: "JOB-104", ItemCode: "POP-002", Color: "Xanh nhạt", RequestQuantity: 420, IssuedQuantity: 0, Status: "Planned", CreatedBy: "chi.le", Remarks: "Yêu cầu kiểm tra sơ đồ cắt." },
  { ID: "CP005", PlanName: "Kế hoạch cắt áo khoác bomber", Factory: "F3", PlanDate: "2025-10-25", Style: "JCK-005", JOB: "JOB-105", ItemCode: "NYL-007", Color: "Đen", RequestQuantity: 150, IssuedQuantity: 150, Status: "Completed", CreatedBy: "bao.tran", Remarks: "Đã hoàn thành, chờ chuyển sang may." },
];

// --- DỮ LIỆU GIẢ CHO INVENTORY ---
const MOCK_INVENTORY_ROLLS: InventoryRoll[] = [
  // Vải cho JOB-102 (DNM-003)
  { PONumber: "POPU0018251", ItemCode: "DNM-003", Factory: "Factory A", Supplier: "Supplier Y", InvoiceNo: "INV-001", ColorCode: "CC-003", Color: "Xanh đậm", RollNo: "1", LotNo: "225628091", Yards: 65, NetWeightKgs: 16.5, GrossWeightKgs: 16.9, Width: "60\"", Location: "F1-01-01", QRCode: "QR-43468", DateInHouse: "2023-06-08", Description: "Denim Material", QCStatus: "Passed", QCDate: "2023-12-23", QCBy: "John Doe", Comment: "No issues found", Printed: true, BalanceYards: 46, HourStandard: 24, HourRelax: 24, RelaxDate: "2023-12-25", RelaxTime: "10:30", RelaxBy: "Alice", ParentQRCode: null },
  { PONumber: "POPU0018252", ItemCode: "DNM-003", Factory: "Factory A", Supplier: "Supplier Y", InvoiceNo: "INV-001", ColorCode: "CC-003", Color: "Xanh đậm", RollNo: "2", LotNo: "225628092", Yards: 80, NetWeightKgs: 20.1, GrossWeightKgs: 20.5, Width: "60\"", Location: "F1-01-02", QRCode: "QR-33961", DateInHouse: "2023-06-08", Description: "Denim Material", QCStatus: "Passed", QCDate: "2023-12-23", QCBy: "John Doe", Comment: "No issues found", Printed: false, BalanceYards: 80, HourStandard: 24, HourRelax: 24, RelaxDate: "2023-12-25", RelaxTime: "10:30", RelaxBy: "Alice", ParentQRCode: null },
  
  // Vải khác
  { PONumber: "PSPU0002932", ItemCode: "CK-101-04-00483", Factory: "Factory B", Supplier: "Supplier Z", InvoiceNo: "INV-003", ColorCode: "CC-003", Color: "Puma Black", RollNo: "1", LotNo: "225628091", Yards: 82, NetWeightKgs: 17.7, GrossWeightKgs: 18.1, Width: "60\"", Location: "F1-01-03", QRCode: "QR-81808", DateInHouse: "2023-10-14", Description: "Polyester Blend", QCStatus: "Passed", QCDate: "2023-09-19", QCBy: "Peter Jones", Comment: "Approved for production", Printed: true, BalanceYards: 22, HourStandard: 36, HourRelax: 36, RelaxDate: "2023-01-20", RelaxTime: "9:00", RelaxBy: "Charlie", ParentQRCode: null },
  
  // Vải cho JOB-101 (CTN-005, Trắng)
  { PONumber: "SSPU0002939", ItemCode: "CTN-005", Factory: "Factory C", Supplier: "Supplier Y", InvoiceNo: "INV-009", ColorCode: "CC-002", Color: "Trắng", RollNo: "1", LotNo: "225628091", Yards: 90, NetWeightKgs: 24, GrossWeightKgs: 24.4, Width: "63\"", Location: "F2-03-09", QRCode: "QR-16812", DateInHouse: "2023-05-05", Description: "Cotton Fabric", QCStatus: "Pending", QCDate: "2023-03-12", QCBy: "Peter Jones", Comment: "Rework required", Printed: true, BalanceYards: 90, HourStandard: 48, HourRelax: 48, RelaxDate: "2023-02-24", RelaxTime: "15:45", RelaxBy: "Alice", ParentQRCode: null },
  
  // --- THÊM 10 DÒNG DỮ LIỆU MỚI ---
  { PONumber: "SSPU0002940", ItemCode: "CTN-005", Factory: "Factory C", Supplier: "Supplier Y", InvoiceNo: "INV-010", ColorCode: "CC-002", Color: "Trắng", RollNo: "2", LotNo: "225628093", Yards: 120, NetWeightKgs: 32, GrossWeightKgs: 32.5, Width: "63\"", Location: "F2-03-10", QRCode: "QR-16813", DateInHouse: "2023-05-05", Description: "Cotton Fabric", QCStatus: "Passed", QCDate: "2023-03-15", QCBy: "Jane Smith", Comment: "OK", Printed: true, BalanceYards: 120, HourStandard: 48, HourRelax: 48, RelaxDate: "2023-02-24", RelaxTime: "16:00", RelaxBy: "Alice", ParentQRCode: null },
  { PONumber: "SSPU0002941", ItemCode: "CTN-005", Factory: "Factory C", Supplier: "Supplier Y", InvoiceNo: "INV-010", ColorCode: "CC-002", Color: "Trắng", RollNo: "3", LotNo: "225628093", Yards: 115.5, NetWeightKgs: 31, GrossWeightKgs: 31.4, Width: "63\"", Location: "F2-03-11", QRCode: "QR-16814", DateInHouse: "2023-05-05", Description: "Cotton Fabric", QCStatus: "Passed", QCDate: "2023-03-15", QCBy: "Jane Smith", Comment: "OK", Printed: false, BalanceYards: 115.5, HourStandard: 48, HourRelax: 48, RelaxDate: "2023-02-24", RelaxTime: "16:00", RelaxBy: "Alice", ParentQRCode: null },
  
  // Vải cho JOB-103 (SIL-001, Đỏ đô)
  { PONumber: "POPU0018300", ItemCode: "SIL-001", Factory: "Factory B", Supplier: "Supplier Z", InvoiceNo: "INV-011", ColorCode: "CC-008", Color: "Đỏ đô", RollNo: "5", LotNo: "225628101", Yards: 75, NetWeightKgs: 15, GrossWeightKgs: 15.3, Width: "55\"", Location: "F2-01-05", QRCode: "QR-91101", DateInHouse: "2023-07-11", Description: "Silk Blend", QCStatus: "Passed", QCDate: "2023-08-01", QCBy: "John Doe", Comment: "Good quality", Printed: true, BalanceYards: 25, HourStandard: 36, HourRelax: 36, RelaxDate: "2023-08-02", RelaxTime: "09:00", RelaxBy: "Bob", ParentQRCode: null },
  { PONumber: "POPU0018301", ItemCode: "SIL-001", Factory: "Factory B", Supplier: "Supplier Z", InvoiceNo: "INV-011", ColorCode: "CC-008", Color: "Đỏ đô", RollNo: "6", LotNo: "225628101", Yards: 88, NetWeightKgs: 17.6, GrossWeightKgs: 18, Width: "55\"", Location: "F2-01-06", QRCode: "QR-91102", DateInHouse: "2023-07-11", Description: "Silk Blend", QCStatus: "Passed", QCDate: "2023-08-01", QCBy: "John Doe", Comment: "Good quality", Printed: true, BalanceYards: 88, HourStandard: 36, HourRelax: 36, RelaxDate: "2023-08-02", RelaxTime: "09:00", RelaxBy: "Bob", ParentQRCode: null },
  
  // Vải cho JOB-104 (POP-002, Xanh nhạt)
  { PONumber: "PSPU0003000", ItemCode: "POP-002", Factory: "Factory A", Supplier: "Supplier X", InvoiceNo: "INV-012", ColorCode: "CC-009", Color: "Xanh nhạt", RollNo: "1", LotNo: "225628110", Yards: 210, NetWeightKgs: 40, GrossWeightKgs: 40.8, Width: "60\"", Location: "F1-05-01", QRCode: "QR-55501", DateInHouse: "2023-09-01", Description: "Poplin Fabric", QCStatus: "Failed", QCDate: "2023-09-05", QCBy: "Peter Jones", Comment: "Color shade variation", Printed: true, BalanceYards: 210, HourStandard: 24, HourRelax: 24, RelaxDate: "2023-09-06", RelaxTime: "11:00", RelaxBy: "Charlie", ParentQRCode: null },
  { PONumber: "PSPU0003001", ItemCode: "POP-002", Factory: "Factory A", Supplier: "Supplier X", InvoiceNo: "INV-012", ColorCode: "CC-009", Color: "Xanh nhạt", RollNo: "2", LotNo: "225628110", Yards: 250, NetWeightKgs: 48, GrossWeightKgs: 48.9, Width: "60\"", Location: "F1-05-02", QRCode: "QR-55502", DateInHouse: "2023-09-01", Description: "Poplin Fabric", QCStatus: "Passed", QCDate: "2023-09-05", QCBy: "Peter Jones", Comment: "OK", Printed: true, BalanceYards: 250, HourStandard: 24, HourRelax: 24, RelaxDate: "2023-09-06", RelaxTime: "11:00", RelaxBy: "Charlie", ParentQRCode: null },
  
  // Vải không thuộc JOB nào ở trên
  { PONumber: "POPU0018500", ItemCode: "LIN-001", Factory: "Factory B", Supplier: "Supplier Y", InvoiceNo: "INV-014", ColorCode: "CC-015", Color: "Beige", RollNo: "1", LotNo: "225628130", Yards: 95, NetWeightKgs: 22, GrossWeightKgs: 22.5, Width: "58\"", Location: "F2-04-01", QRCode: "QR-77701", DateInHouse: "2023-11-10", Description: "Linen Fabric", QCStatus: "Passed", QCDate: "2023-11-15", QCBy: "Jane Smith", Comment: "", Printed: true, BalanceYards: 95, HourStandard: 48, HourRelax: 48, RelaxDate: "2023-11-16", RelaxTime: "14:00", RelaxBy: "Alice", ParentQRCode: null },
  { PONumber: "PSPU0003100", ItemCode: "VEL-002", Factory: "Factory C", Supplier: "Supplier Z", InvoiceNo: "INV-015", ColorCode: "CC-020", Color: "Burgundy", RollNo: "1", LotNo: "225628140", Yards: 50, NetWeightKgs: 18, GrossWeightKgs: 18.4, Width: "62\"", Location: "F3-01-01", QRCode: "QR-88801", DateInHouse: "2023-12-01", Description: "Velvet Fabric", QCStatus: "Pending", QCDate: "2023-12-05", QCBy: "John Doe", Comment: "Awaiting lab test", Printed: false, BalanceYards: 50, HourStandard: 72, HourRelax: 72, RelaxDate: "2023-12-06", RelaxTime: "10:00", RelaxBy: "Bob", ParentQRCode: null },
  { PONumber: "POPU0018253", ItemCode: "DNM-003", Factory: "Factory A", Supplier: "Supplier Y", InvoiceNo: "INV-016", ColorCode: "CC-003", Color: "Xanh đậm", RollNo: "3", LotNo: "225628095", Yards: 150, NetWeightKgs: 40, GrossWeightKgs: 40.8, Width: "60\"", Location: "F1-01-03", QRCode: "QR-33962", DateInHouse: "2023-06-10", Description: "Denim Material", QCStatus: "Passed", QCDate: "2023-12-24", QCBy: "John Doe", Comment: "", Printed: true, BalanceYards: 150, HourStandard: 24, HourRelax: 24, RelaxDate: "2023-12-26", RelaxTime: "11:00", RelaxBy: "Charlie", ParentQRCode: null },
  { PONumber: "SSPU0002942", ItemCode: "CTN-005", Factory: "Factory C", Supplier: "Supplier Y", InvoiceNo: "INV-010", ColorCode: "CC-002", Color: "Trắng", RollNo: "4", LotNo: "225628093", Yards: 300, NetWeightKgs: 80, GrossWeightKgs: 80.9, Width: "63\"", Location: "F2-04-11", QRCode: "QR-16815", DateInHouse: "2023-05-06", Description: "Cotton Fabric", QCStatus: "Passed", QCDate: "2023-03-16", QCBy: "Jane Smith", Comment: "Premium quality", Printed: true, BalanceYards: 300, HourStandard: 48, HourRelax: 48, RelaxDate: "2023-02-25", RelaxTime: "16:00", RelaxBy: "Alice", ParentQRCode: null },
];

// --- CÁC HÀM API GIẢ ---

// Lấy danh sách Cutting Plan Jobs
export const getCuttingPlanJobs = (): Promise<CuttingPlanJob[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CUTTING_PLAN_JOBS);
    }, 500); // Giả lập độ trễ mạng
  });
};

// Lấy danh sách cuộn vải trong kho theo Item Code và màu sắc
export const getInventoryByItem = (itemCode: string, color: string): Promise<InventoryRoll[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rolls = MOCK_INVENTORY_ROLLS.filter(
        // Chỉ lấy các cuộn vải có QC Status là Passed và còn hàng
        (roll) => roll.ItemCode === itemCode && roll.Color === color && roll.BalanceYards > 0 && roll.QCStatus === "Passed"
      );
      resolve(rolls);
    }, 800);
  });
};