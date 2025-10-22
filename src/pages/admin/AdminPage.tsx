import React, { useState, useEffect, useCallback } from "react";
import {
  Fingerprint,
  Search,
  Download,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  ShieldX,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import axios from "axios"; // --- (MỚI) Import axios ---
import { io, Socket } from "socket.io-client"; // --- (MỚI) Import socket.io-client ---

// --- (MỚI) Định nghĩa URL của Backend ---
const API_URL = "http://localhost:5000";

// --- Kiểu dữ liệu (giữ nguyên) ---
type IPLogEntry = {
  ID: number;
  IPAddress: string;
  User: string;
  DateTime: string;
  Status: "Allowed" | "Failed" | "Blocked";
  Location: string;
};

// --- Component StatusBadge (giữ nguyên) ---
const StatusBadge: React.FC<{ status: IPLogEntry["Status"] }> = ({
  status,
}) => {
  const baseClasses =
    "px-2.5 py-1 text-xs font-semibold rounded-full inline-block";
  const colorClasses = {
    Allowed: "bg-green-100 text-green-800",
    Failed: "bg-yellow-100 text-yellow-800",
    Blocked: "bg-red-100 text-red-800",
  };
  return (
    <span className={`${baseClasses} ${colorClasses[status]}`}>{status}</span>
  );
};

// --- (CẬP NHẬT) Component Thống kê Thời gian thực ---
const RealTimeStats: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  // Dữ liệu này có thể được lấy từ một API khác hoặc tính toán
  const [todayVisits] = useState(1245);

  useEffect(() => {
    // Kết nối tới Socket.IO server
    const socket: Socket = io(API_URL);

    // Lắng nghe sự kiện 'connect'
    socket.on("connect", () => {
      console.log("Connected to stats socket!");
    });

    // Lắng nghe sự kiện 'update_stats' từ server
    socket.on("update_stats", (data: { activeUsers: number }) => {
      setActiveUsers(data.activeUsers);
    });

    // Lắng nghe sự kiện 'disconnect'
    socket.on("disconnect", () => {
      console.log("Disconnected from stats socket.");
    });

    // Cleanup: Ngắt kết nối khi component bị unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-5 shadow-sm rounded-lg flex items-center gap-4 border-l-4 border-blue-500">
        <Users className="w-8 h-8 text-blue-500" />
        <div>
          <p className="text-gray-500 text-sm">Số người dùng đang hoạt động</p>
          <p className="text-3xl font-bold text-gray-800">{activeUsers}</p>
        </div>
      </div>
      <div className="bg-white p-5 shadow-sm rounded-lg flex items-center gap-4 border-l-4 border-purple-500">
        <CalendarDays className="w-8 h-8 text-purple-500" />
        <div>
          <p className="text-gray-500 text-sm">Tổng lượt truy cập hôm nay</p>
          <p className="text-3xl font-bold text-gray-800">
            {todayVisits.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- (CẬP NHẬT) Component Trang chính (AdminPage) ---
const AdminPage = () => {
  // --- (MỚI) State để lưu dữ liệu từ API và thông tin phân trang ---
  const [logData, setLogData] = useState<IPLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // States cho việc lọc và phân trang (giữ nguyên)
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- (MỚI) Hàm gọi API để lấy dữ liệu ---
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const [startDate, endDate] = dateRange;
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: searchTerm,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
      };

      const response = await axios.get(`${API_URL}/api/logs`, { params });

      // Dữ liệu trả về từ BE có dạng { data: [...], pagination: {...} }
      setLogData(response.data.data);
      // Giả định backend trả về totalPages và totalCount trong object pagination
      // Nếu backend chưa có, bạn cần bổ sung logic tính toán này ở AccessLog.js
      setTotalPages(
        response.data.pagination.totalPages ||
          Math.ceil(response.data.pagination.totalCount / rowsPerPage)
      );
      setTotalCount(response.data.pagination.totalCount || 0);
    } catch (error) {
      console.error("Failed to fetch access logs:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo cho người dùng
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, dateRange]);

  // --- (CẬP NHẬT) useEffect để gọi API khi có thay đổi ---
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]); // fetchLogs đã được bọc trong useCallback

  // --- (CẬP NHẬT) Các hàm xử lý sự kiện ---
  const handleExportToExcel = () => {
    // Chức năng này vẫn hoạt động phía client với dữ liệu đã được tải về
    const worksheet = XLSX.utils.json_to_sheet(logData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IPLogs");
    XLSX.writeFile(workbook, "ip_log_export.xlsx");
  };

  const handleBlockIP = (ipAddress: string) => {
    // Trong thực tế, bạn sẽ gọi API để chặn IP này
    // Ví dụ: axios.post(`${API_URL}/api/blocklist`, { ip: ipAddress });
    alert(`Đã gửi yêu cầu chặn IP: ${ipAddress}`);
  };

  // --- (CẬP NHẬT) Logic reset trang khi tìm kiếm ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    setCurrentPage(1); // Reset về trang đầu tiên khi đổi ngày
  };

  return (
    <div className="space-y-6">
      {/* --- Tiêu đề trang (không đổi) --- */}
      <div className="bg-white p-5 shadow-sm rounded-lg flex items-center gap-4 border-l-4 border-teal-600">
        <Fingerprint className="w-8 h-8 text-teal-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            IP Access Tracker & Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Theo dõi truy cập và xem thống kê website trong thời gian thực.
          </p>
        </div>
      </div>

      {/* --- Khu vực Thống kê (đã kết nối) --- */}
      <RealTimeStats />

      {/* --- Thanh Lọc và Hành động (đã kết nối) --- */}
      <div className="bg-white p-4 shadow-sm rounded-lg space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm IP, người dùng..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <DatePicker
              selectsRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={handleDateChange}
              isClearable={true}
              placeholderText="Lọc theo khoảng thời gian"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* --- Bảng Dữ liệu (đã kết nối) --- */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            {/* ... (Phần thead giữ nguyên) ... */}
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Địa chỉ IP
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Người dùng
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Vị trí
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Thời gian
                </th>
                <th scope="col" className="px-6 py-3 font-semibold text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : logData.length > 0 ? (
                logData.map((log) => (
                  <tr
                    key={log.ID}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {log.ID}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-800">
                      {log.IPAddress}
                    </td>
                    <td className="px-6 py-4">{log.User}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      {log.Location}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={log.Status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">{log.DateTime}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleBlockIP(log.IPAddress)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        title={`Chặn IP ${log.IPAddress}`}
                      >
                        <ShieldX className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    Không tìm thấy dữ liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Thanh Phân trang (đã kết nối) --- */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Hiển thị <strong>{(currentPage - 1) * rowsPerPage + 1}</strong>-
            <strong>{Math.min(currentPage * rowsPerPage, totalCount)}</strong>{" "}
            trên tổng <strong>{totalCount}</strong> mục
          </div>
          <div className="flex items-center gap-4">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md p-1.5 text-sm focus:ring-teal-500 focus:border-teal-500"
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
            <span className="text-sm text-gray-600">
              Trang {totalPages > 0 ? currentPage : 0} / {totalPages}
            </span>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border-t border-b border-r border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
