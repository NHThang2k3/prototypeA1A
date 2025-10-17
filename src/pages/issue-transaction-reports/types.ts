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

// Thêm hoặc thay thế định nghĩa Filters ở đây
// Đây là định nghĩa chính xác cho bộ lọc của bạn
export interface Filters {
  query?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Ghi chú: Interface ReportFilters bên dưới có vẻ không được sử dụng
// hoặc có cấu trúc khác. Bạn có thể xóa nó đi nếu không cần thiết.
/*
export interface ReportFilters {
  searchTerm: string;
  status: string;
  type: string;
  dateRange: {
    from: string;
    to: string;
  };
}
*/