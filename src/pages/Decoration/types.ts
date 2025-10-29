export type RequestStatus =
  | "Pending Approval"
  | "Approved"
  | "In Progress"
  | "Completed"
  | "Rejected";

export interface RepairRequest {
  id: string;
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