// Path: src/pages/kanban-board/data.ts

import type { KanbanBoard } from "./types";

export const mockBoards: KanbanBoard[] = [
  {
    id: "fabric-to-cutting",
    name: "Kho Vải -> Cắt",
    tasks: [
      { id: 'task-1', requestId: 'RF-0123', title: 'Vải FVN-102-BLUE', details: '5 cây / 750m', department: 'Phòng Cắt', priority: 'Khẩn cấp', dueDate: '28/10/2023', assignee: { id: 'user-1', name: 'Văn A' } },
      { id: 'task-2', requestId: 'RF-0124', title: 'Vải KTG-05-RED', details: '2 cây / 310m', department: 'Phòng Cắt', priority: 'Thường', dueDate: '29/10/2023' },
      { id: 'task-3', requestId: 'RF-0125', title: 'Vải Denim-WASH', details: '10 cây / 1200m', department: 'Phòng Cắt', priority: 'Cao', dueDate: '28/10/2023', assignee: { id: 'user-2', name: 'Thị B' } },
      { id: 'task-4', requestId: 'RF-0126', title: 'Vải Cotton 100%', details: '3 cây / 450m', department: 'Phòng Cắt', priority: 'Thường', dueDate: '30/10/2023', assignee: { id: 'user-2', name: 'Thị B' } },
    ],
    columns: [
      { id: 'col-1', title: 'Yêu cầu mới', taskIds: ['task-1', 'task-2'] },
      { id: 'col-2', title: 'Đang chuẩn bị', taskIds: ['task-3'] },
      { id: 'col-3', title: 'Sẵn sàng giao', taskIds: ['task-4'] },
      { id: 'col-4', title: 'Đã giao', taskIds: [] },
    ],
  },
  {
    id: "sewing-to-acc",
    name: "May -> Kho Phụ Liệu",
    tasks: [
        { id: 'task-5', requestId: 'RA-551', title: 'Nút áo sơ mi', details: '5,000 cái', department: 'Chuyền May 1', priority: 'Cao', dueDate: '28/10/2023', assignee: { id: 'user-3', name: 'Văn C' } },
        { id: 'task-6', requestId: 'RA-552', title: 'Chỉ may vắt sổ', details: '20 cuộn', department: 'Chuyền May 3', priority: 'Thường', dueDate: '29/10/2023', assignee: { id: 'user-3', name: 'Văn C' } },
    ],
    columns: [
        { id: 'col-5', title: 'Yêu cầu mới', taskIds: ['task-5'] },
        { id: 'col-6', title: 'Đang soạn hàng', taskIds: ['task-6'] },
        { id: 'col-7', title: 'Đã giao', taskIds: [] },
    ],
  },
];