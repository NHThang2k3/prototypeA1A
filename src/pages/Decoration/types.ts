export type RequestStatus =
  | "Pending" // Added for "Chưa sửa"
  | "Pending Approval"
  | "Approved"
  | "In Progress"
  | "Completed"
  | "Rejected";

export interface RepairRequest {
  id: string;
  // New fields
  jobNo: string;
  bundleNo: string;
  issueDescription?: string; // đang bị cái gì
  proposedAction?: string; // đề nghị làm gì
  startRepairTime?: string; // thời gian ghi nhận đang sửa
  endRepairTime?: string; // thời gian sửa xong
  recordDate?: string; // Replaces or aliases creationDate

  // Existing fields
  creationDate: string;
  poCode: string;
  productCode: string;
  process: "Bonding" | "Embroidery" | "Heat Press" | "Printing";
  defectType: string;
  defectQty: number;
  assignee?: string;
  creator: string;
  status: RequestStatus;
  description?: string;
  images?: string[]; // URLs to images
  rejectionReason?: string;
  approverNotes?: string;
  successfullyRepairedQty?: number;
  unrepairableQty?: number;
  workerNotes?: string;
}