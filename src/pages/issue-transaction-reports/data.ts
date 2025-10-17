// Path: src/pages/issue-transaction-reports/data.ts

import type { IssueTransaction } from './types';

export const mockTransactions: IssueTransaction[] = [
  { id: 'IF-001', type: 'Xuất vải', createdAt: '2023-10-26T09:00:00Z', requestor: 'Phòng Cắt', productionOrder: 'PO-12345', status: 'Đã hoàn tất' },
  { id: 'IA-001', type: 'Xuất phụ liệu', createdAt: '2023-10-26T11:30:00Z', requestor: 'Chuyền May 1', productionOrder: 'PO-12345', status: 'Đã hoàn tất' },
  { id: 'IP-001', type: 'Xuất đóng gói', createdAt: '2023-10-27T14:00:00Z', requestor: 'Phòng Đóng Gói', productionOrder: 'PO-12345', status: 'Đang xử lý' },
  { id: 'IF-002', type: 'Xuất vải', createdAt: '2023-10-28T08:15:00Z', requestor: 'Phòng Cắt', productionOrder: 'PO-67890', status: 'Mới yêu cầu' },
  { id: 'IA-002', type: 'Xuất phụ liệu', createdAt: '2023-11-01T10:00:00Z', requestor: 'Chuyền May 2', productionOrder: 'PO-67890', status: 'Đã hủy' },
  { id: 'IF-003', type: 'Xuất vải', createdAt: '2023-11-02T13:45:00Z', requestor: 'Phòng Mẫu', productionOrder: 'SAMPLE-001', status: 'Đã hoàn tất' },
  { id: 'IP-002', type: 'Xuất đóng gói', createdAt: '2023-11-03T16:20:00Z', requestor: 'Phòng Đóng Gói', productionOrder: 'PO-67890', status: 'Đang xử lý' },
];