// Path: src/pages/sewing-trims-kanban/types.ts

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

export type Priority = 'High' | 'Medium' | 'Low';

export type Status = 'New' | 'Confirmed' | 'Picking' | 'Ready for Pickup' | 'Partially Issued' | 'Completed' | 'Cancelled';

export interface SewingTrimsTask {
  id: string; // e.g., "KB-001"
  requestName: string;
  dateCreated: string;
  dateRequired: string;
  factoryLine: string;
  style: string;
  job: string;
  color: string;
  size: string;
  poNumber: string;
  requiredQuantity: number;
  issuedQuantity: number;
  status: Status;
  priority: Priority;
  bomId: string;
  createdBy: Assignee;
  remarks?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanBoard {
  id: string;
  name: string;
  columns: KanbanColumn[];
  tasks: SewingTrimsTask[];
}