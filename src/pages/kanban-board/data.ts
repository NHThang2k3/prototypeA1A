// Path: src/pages/kanban-board/data.ts

import type { KanbanBoard, Assignee } from "./types";

// For better user management
const users: Record<string, Assignee> = {
  'an.nguyen': { id: 'user-1', name: 'An Nguyen' },
  'bao.tran': { id: 'user-2', name: 'Bao Tran' },
  'chi.le': { id: 'user-3', name: 'Chi Le' },
}

export const mockBoards: KanbanBoard[] = [
  {
    id: "cutting-plan-fabric-issuance",
    name: "Cutting Plan - Fabric Issuance",
    tasks: [
      { 
        id: 'task-cp001', 
        requestId: 'CP001', 
        title: 'Fabric CTN-005 - White', 
        issuedQuantity: 0,
        requestQuantity: 500,
        style: 'TSH-001',
        job: 'JOB-101',
        priority: 'Urgent', 
        dueDate: '20/10/2025', 
        assignee: users['an.nguyen'],
        remarks: 'Priority for cutting first.',
        factory: 'Factory A',
      },
      { 
        id: 'task-cp002', 
        requestId: 'CP002', 
        title: 'Fabric DNM-003 - Dark Blue', 
        issuedQuantity: 0,
        requestQuantity: 350,
        style: 'JEA-002',
        job: 'JOB-102',
        priority: 'Normal', 
        dueDate: '21/10/2025',
        assignee: users['an.nguyen'],
        remarks: 'Denim fabric needs to be checked for shrinkage.',
        factory: 'Factory B',
      },
      { 
        id: 'task-cp003', 
        requestId: 'CP003', 
        title: 'Fabric SIL-001 - Burgundy', 
        issuedQuantity: 150,
        requestQuantity: 200,
        style: 'DRS-004',
        job: 'JOB-103',
        priority: 'High', 
        dueDate: '22/10/2025', 
        assignee: users['bao.tran'],
        remarks: 'Received enough fabric.',
        factory: 'Factory A',
      },
      { 
        id: 'task-cp004', 
        requestId: 'CP004', 
        title: 'Fabric POP-002 - Light Blue', 
        issuedQuantity: 0,
        requestQuantity: 420,
        style: 'SHT-003',
        job: 'JOB-104',
        priority: 'Normal', 
        dueDate: '23/10/2025',
        assignee: users['chi.le'],
        remarks: 'Request to check the cutting layout.',
        factory: 'Factory B',
      },
      { 
        id: 'task-cp005', 
        requestId: 'CP005', 
        title: 'Fabric NYL-007 - Black', 
        issuedQuantity: 150,
        requestQuantity: 150,
        style: 'JCK-005',
        job: 'JOB-105',
        priority: 'Normal', 
        dueDate: '25/10/2025',
        assignee: users['bao.tran'],
        remarks: 'Completed, waiting to be transferred to sewing.',
        factory: 'Factory A',
      },
    ],
    columns: [
      { id: 'col-1', title: 'To Do', taskIds: ['task-cp001', 'task-cp002', 'task-cp004'] }, // Status: Planned
      { id: 'col-2', title: 'In Progress', taskIds: ['task-cp003'] }, // Status: In Progress
      { id: 'col-3', title: 'Ready for Delivery', taskIds: [] },
      { id: 'col-4', title: 'Delivered', taskIds: ['task-cp005'] }, // Status: Completed
    ],
  },
];