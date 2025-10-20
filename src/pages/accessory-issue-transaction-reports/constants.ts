// Path: src/pages/accessory-issue-transaction-reports/constants.ts

// Định nghĩa cấu trúc cho một cột trong bảng
export interface ColumnDefinition {
  key: string; // Phải là một key duy nhất, thường là key trong object data
  label: string; // Tên hiển thị trên header của bảng
}

// Danh sách tất cả các cột có thể có trong bảng phụ liệu
export const ALL_COLUMNS: ColumnDefinition[] = [
  { key: 'qrCode', label: 'QR Code' },
  { key: 'itemNumber', label: 'Item Number' },
  { key: 'itemCategory', label: 'Item Category' },
  { key: 'materialName', label: 'Material Name' },
  { key: 'color', label: 'Color' },
  { key: 'size', label: 'Size' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'unit', label: 'Unit' },
  { key: 'location', label: 'Location' },
  { key: 'batchNumber', label: 'Batch Number' },
  { key: 'dateReceived', label: 'Date Received' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'poNumber', label: 'PO Number' },
  { key: 'reorderPoint', label: 'Reorder Point' },
  { key: 'lastModifiedDate', label: 'Last Modified Date' },
  { key: 'lastModifiedBy', label: 'Last Modified By' },
  { key: 'description', label: 'Description' },
  { key: 'job', label: 'JOB' },
  { key: 'issuedQuantity', label: 'Issued Quantity' },
  { key: 'issuedDate', label: 'Issued Date' },
  { key: 'issuedBy', label: 'Issued By' },
  { key: 'destination', label: 'Destination' },
  { key: 'status', label: 'Status' },
  { key: 'remark', label: 'Remark' },
];