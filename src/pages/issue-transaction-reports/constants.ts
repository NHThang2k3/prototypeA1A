// Path: src/pages/issue-transaction-reports/constants.ts

// Định nghĩa cấu trúc cho một cột trong bảng
export interface ColumnDefinition {
  key: string; // Phải là một key duy nhất, thường là key trong object data
  label: string; // Tên hiển thị trên header của bảng
}

// Danh sách tất cả các cột có thể có trong bảng
export const ALL_COLUMNS: ColumnDefinition[] = [
  { key: 'poNumber', label: 'PO Number' },
  { key: 'itemCode', label: 'Item Code' },
  { key: 'factory', label: 'Factory' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'invoiceNo', label: 'Invoice No' },
  { key: 'colorCode', label: 'Color Code' },
  { key: 'color', label: 'Color' },
  { key: 'rollNo', label: 'Roll No' },
  { key: 'lotNo', label: 'Lot No' },
  { key: 'yards', label: 'Yards' },
  { key: 'netWeightKgs', label: 'Net Weight (Kgs)' },
  { key: 'grossWeightKgs', label: 'Gross Weight (Kgs)' },
  { key: 'width', label: 'Width' },
  { key: 'location', label: 'Location' },
  { key: 'qrCode', label: 'QR Code' },
  { key: 'dateInHouse', label: 'Date In House' },
  { key: 'description', label: 'Description' },
  { key: 'qcStatus', label: 'QC Status' },
  { key: 'qcDate', label: 'QC Date' },
  { key: 'qcBy', label: 'QC By' },
  { key: 'comment', label: 'Comment' },
  { key: 'printed', label: 'Printed' },
  { key: 'balanceYards', label: 'Balance Yards' },
  { key: 'hourStandard', label: 'Hour Standard' },
  { key: 'hourRelax', label: 'Hour Relax' },
  { key: 'relaxDate', label: 'Relax Date' },
  { key: 'relaxTime', label: 'Relax Time' },
  { key: 'relaxBy', label: 'Relax By' },
  { key: 'job', label: 'JOB' },
  { key: 'issuedDate', label: 'Issued Date' },
  { key: 'issuedBy', label: 'Issued By' },
  { key: 'destination', label: 'Destination' },
  { key: 'parentQrCode', label: 'Parent QR Code' },
];