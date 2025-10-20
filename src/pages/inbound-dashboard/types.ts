// src/pages/inbound-dashboard/types.ts

// --- Data Model Interfaces ---

export interface InventoryItem {
  'PO Number': string;
  'Item Code': string;
  'Factory': string;
  'Supplier': string;
  'Invoice No': string;
  'Color Code': string;
  'Color': string;
  'Roll No': number;
  'Lot No': string;
  'Yards': number;
  'Net Weight (Kgs)': number;
  'Gross Weight (Kgs)': number;
  'Width': string;
  'Location': string;
  'QR Code': string;
  'Date In House': Date | null;
  'Description': string;
  'QC Status': string;
  'QC Date': Date | null;
  'QC By': string;
  'Comment':string;
  'Printed': string;
  'Balance Yards': number;
  'Hour Standard': string;
  'Hour Relax': string;
  'Relax Date': Date | null;
  'Relax Time': string;
  'Relax By': string;
  'JOB': string;
  'Issued Date': Date | null;
  'Issued By': string;
  'Destination': string;
  'Parent QR Code': string;
}

export interface WarehouseLocation {
  'Location': string;
  'Warehouse': string;
  'Shelf': string;
  'Pallet': string;
  'Capacity': number;
  'Current Occupancy': number;
  'Last Updated': Date | null;
  'Description': string;
}

export interface CuttingPlan {
  'ID': string;
  'Plan Name': string;
  'Factory': string;
  'Plan Date': Date | null;
  'Style': string;
  'JOB': string;
  'Item Code': string;
  'Color': string;
  'Request Quantity': number;
  'Issued Quantity': number;
  'Status': string;
  'Created By': string;
  'Remarks': string;
}

export interface Shipment {
  'PO Number': string;
  'Supplier': string;
  'Item Code': string;
  'ETD': Date | null;
  'ETA': Date | null;
  'Quantity (Yards)': number;
  'Status': 'In Transit' | 'Delayed' | 'Arrived';
}


// --- Component Prop Types ---

// Dữ liệu cho các thẻ tóm tắt KPI
export interface SummaryData {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  unit?: string; // Đơn vị, ví dụ: "Yards", "%"
}

// Dữ liệu cho các biểu đồ cơ bản (cột, tròn)
export interface ChartData {
  name: string;
  value: number;
}

// Dữ liệu cho biểu đồ cột chồng
export interface StackedChartData {
  name: string;
  issued: number;
  remaining: number;
}

// Dữ liệu cho biểu đồ Gantt
export interface GanttChartData {
  name: string;
  value: [number, number, number, number];
  itemStyle: { color: string };
  supplier: string;
  itemCode: string;
}


// Kiểu dữ liệu cho các bộ lọc
export interface DashboardFilters {
  factory: string;
  supplier: string;
  itemCode: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}