// Path: src/pages/kanban-board/types.ts

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string; // URL ảnh đại diện
}

export type Priority = 'Khẩn cấp' | 'Cao' | 'Thường';

export interface KanbanTask {
  id: string;
  requestId: string; // VD: "RF-0123"
  title: string; // VD: "Vải FVN-102-BLUE"
  details: string; // VD: "5 cây / 750m"
  department: string; // VD: "Phòng Cắt"
  priority: Priority;
  assignee?: Assignee;
  dueDate: string; // Ngày cần hàng
}

export interface KanbanColumn {
  id: string; // VD: "todo", "inprogress", "done"
  title: string;
  taskIds: string[]; // Mảng chứa ID của các task trong cột này
}

export interface KanbanBoard {
  id: string; // VD: "fabric-to-cutting"
  name: string; // VD: "Kho Vải -> Cắt"
  columns: KanbanColumn[];
  tasks: KanbanTask[];
}