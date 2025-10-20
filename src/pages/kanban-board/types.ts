// Path: src/pages/kanban-board/types.ts

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string; // Avatar URL
}

export type Priority = 'Urgent' | 'High' | 'Normal';

export interface KanbanTask {
  id: string;
  requestId: string; // e.g., "CP001"
  title: string; // e.g., "Fabric CTN-005 - White" (This will be the Item)
  issuedQuantity: number; // e.g., 150
  requestQuantity: number; // e.g., 200
  style: string; // e.g., "TSH-001"
  job: string; // e.g., "JOB-101"
  priority: Priority;
  assignee?: Assignee;
  dueDate: string; // Planned date, format "DD/MM/YYYY"
  remarks?: string; // Notes
  factory: string; // New: To filter by factory
}

export interface KanbanColumn {
  id: string; // e.g., "todo", "inprogress", "done"
  title: string;
  taskIds: string[]; // Array containing the IDs of the tasks in this column
}

export interface KanbanBoard {
  id:string; // e.g., "cutting-plan-fabric-issuance"
  name: string; // e.g., "Cutting Plan - Fabric Issuance"
  columns: KanbanColumn[];
  tasks: KanbanTask[];
}