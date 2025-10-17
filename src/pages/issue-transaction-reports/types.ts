// Path: src/pages/issue-transaction-reports/types.ts

export type TransactionStatus = 'Đã hoàn tất' | 'Đang xử lý' | 'Mới yêu cầu' | 'Đã hủy';
export type TransactionType = 'Xuất vải' | 'Xuất phụ liệu' | 'Xuất đóng gói';

export interface IssueTransaction {
  id: string;
  type: TransactionType;
  createdAt: string; // ISO date string
  requestor: string;
  productionOrder: string;
  status: TransactionStatus;
}

export interface ReportFilters {
  searchTerm: string;
  status: string;
  type: string;
  dateRange: {
    from: string;
    to: string;
  };
}