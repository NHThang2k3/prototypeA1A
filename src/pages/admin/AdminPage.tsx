import React, { useState, useEffect, useCallback, Fragment } from "react";
import {
  Fingerprint,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  MoreHorizontal,
  Globe,
  Ban,
  Hash,
  Dot,
  Eye,
  ShieldCheck,
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import { Menu, Transition } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"; // <-- IMPORT MỚI

// ============================================================================
// I. CẤU TRÚC DỮ LIỆU & KIỂU DỮ LIỆU (CÓ THAY ĐỔI NHẸ)
// ============================================================================

// Base URL cho API
const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

type AccessStatus = "Safe" | "Warning" | "Blocked" | "Whitelisted";
// Kiểu dữ liệu này khớp với dữ liệu trả về từ API /api/logs
type IPLogEntry = {
  id: string;
  ipAddress: string;
  location: { country: string; city: string };
  isp: string;
  lastAccess: string;
  accessCount: number;
  userAgent: string;
  status: AccessStatus;
  reputation?: { score: number | null; provider: string };
};

// Kiểu dữ liệu cho các thẻ KPI
type KpiData = {
  totalAccess24h: number;
  uniqueIps24h: number;
  newlyBlockedIps: number;
  countryCount: number;
};

// Kiểu dữ liệu cho biểu đồ
type TrafficChartItem = {
  time: string;
  requests: number;
};

// ============================================================================
// II. CÁC COMPONENT CON (CÓ THAY ĐỔI NHẸ ĐỂ NHẬN PROPS)
// ============================================================================

const StatusBadge: React.FC<{ status: AccessStatus }> = ({ status }) => {
  const baseClasses =
    "px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5";
  const colorClasses: Record<AccessStatus, string> = {
    Safe: "bg-green-100 text-green-800",
    Warning: "bg-yellow-100 text-yellow-800",
    Blocked: "bg-red-100 text-red-800",
    Whitelisted: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`${baseClasses} ${colorClasses[status]}`}>
      <Dot className="w-4 h-4 -ml-1" /> {status}
    </span>
  );
};

const ReputationScore: React.FC<{ score?: number | null }> = ({ score }) => {
  if (score === undefined || score === null)
    return <span className="text-gray-400">N/A</span>;
  const getColor = () => {
    if (score > 75) return "text-red-500";
    if (score > 40) return "text-yellow-500";
    return "text-green-500";
  };
  return (
    <span className={`font-mono font-semibold ${getColor()}`}>{score}/100</span>
  );
};

interface KPIStatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  iconBgColor: string;
}
const KPIStatCard: React.FC<KPIStatCardProps> = ({
  icon: Icon,
  title,
  value,
  iconBgColor,
}) => (
  <div className="bg-white p-5 shadow-sm rounded-lg flex items-center gap-5">
    <div className={`p-3 rounded-full ${iconBgColor}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const ActionsMenu: React.FC<{ ip: string }> = ({ ip }) => {
  const menuItems = [
    {
      label: "Xem chi tiết",
      icon: Eye,
      onClick: () => alert(`Xem chi tiết IP: ${ip}`),
    },
    {
      label: "Thêm vào Whitelist",
      icon: ShieldCheck,
      onClick: () => alert(`Thêm ${ip} vào Whitelist`),
    },
    {
      label: "Chặn IP này",
      icon: Ban,
      onClick: () => alert(`Đã gửi yêu cầu chặn IP: ${ip}`),
    },
  ];
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="px-1 py-1">
            {menuItems.map((item) => (
              <Menu.Item key={item.label}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={`${
                      active ? "bg-teal-500 text-white" : "text-gray-900"
                    } group flex rounded-md items-center w-full px-3 py-2 text-sm`}
                  >
                    <item.icon className="w-5 h-5 mr-2" aria-hidden="true" />
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

// ============================================================================
// III. CÁC COMPONENT CHÍNH (ĐÃ CẬP NHẬT)
// ============================================================================

// --- SỬA ĐỔI: Nhận dữ liệu từ props ---
const DashboardKPIs: React.FC<{ data: KpiData | null }> = ({ data }) => {
  const kpiData = [
    {
      title: "Tổng truy cập (24h)",
      value: data ? data.totalAccess24h.toLocaleString() : "...",
      icon: Hash,
      color: "bg-blue-500",
    },
    {
      title: "Số IP duy nhất (24h)",
      value: data ? data.uniqueIps24h.toLocaleString() : "...",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Số IP bị chặn mới",
      value: data ? data.newlyBlockedIps.toLocaleString() : "...",
      icon: Ban,
      color: "bg-red-500",
    },
    {
      title: "Số quốc gia truy cập",
      value: data ? data.countryCount.toLocaleString() : "...",
      icon: Globe,
      color: "bg-green-500",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi) => (
        <KPIStatCard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          iconBgColor={kpi.color}
        />
      ))}
    </div>
  );
};

// --- SỬA ĐỔI: Nhận dữ liệu từ props ---
const TrafficChart: React.FC<{ data: TrafficChartItem[] }> = ({ data }) => {
  const getChartOptions = () => ({
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((item) => item.time),
      axisLine: { lineStyle: { color: "#a1a1aa" } },
      axisLabel: { color: "#3f3f46" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#a1a1aa" } },
      axisLabel: { color: "#3f3f46" },
      splitLine: { lineStyle: { color: "#e4e4e7" } },
    },
    series: [
      {
        name: "Số Requests",
        type: "line",
        smooth: true,
        data: data.map((item) => item.requests),
        itemStyle: { color: "#14b8a6" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(20, 184, 166, 0.3)" },
              { offset: 1, color: "rgba(20, 184, 166, 0)" },
            ],
          },
        },
      },
    ],
  });

  return (
    <div className="bg-white p-6 shadow-sm rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Lưu lượng truy cập trong 24 giờ qua
      </h3>
      <ReactECharts
        option={getChartOptions()}
        style={{ height: "300px", width: "100%" }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};

// --- Giữ nguyên ---
interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dateRange: [Date | null, Date | null];
  onDateChange: (update: [Date | null, Date | null]) => void;
}
const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateChange,
}) => {
  return (
    <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm IP, Vị trí, ISP, User Agent..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
        />
      </div>
      <div className="relative w-full md:w-auto">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
        <DatePicker
          selectsRange={true}
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onChange={onDateChange}
          isClearable={true}
          placeholderText="Lọc theo khoảng thời gian"
          className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
        />
      </div>
    </div>
  );
};

// --- Giữ nguyên ---
interface LogsTableProps {
  logs: IPLogEntry[];
  isLoading: boolean;
}
const LogsTable: React.FC<LogsTableProps> = ({ logs, isLoading }) => {
  const TableHeader = () => (
    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
      <tr>
        {[
          "Địa chỉ IP",
          "Vị trí",
          "ISP / Tổ chức",
          "Lần truy cập gần nhất",
          "Số truy cập",
          "User Agent",
          "Trạng thái",
          "Danh tiếng",
          "Hành động",
        ].map((header) => (
          <th
            key={header}
            scope="col"
            className="px-6 py-3 font-semibold tracking-wider"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
  const TableRow = ({ log }: { log: IPLogEntry }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-mono text-gray-800">{log.ipAddress}</td>
      <td className="px-6 py-4">
        <MapPin className="inline w-4 h-4 mr-2 text-gray-400" />
        {log.location.city}, {log.location.country}
      </td>
      <td className="px-6 py-4">{log.isp}</td>
      <td className="px-6 py-4 text-gray-600">
        {new Date(log.lastAccess).toLocaleString()}
      </td>
      <td className="px-6 py-4 font-medium text-gray-800">
        {log.accessCount.toLocaleString()}
      </td>
      <td
        className="px-6 py-4 text-gray-600 max-w-xs truncate"
        title={log.userAgent}
      >
        {log.userAgent}
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={log.status} />
      </td>
      <td className="px-6 py-4">
        <ReputationScore score={log.reputation?.score} />
      </td>
      <td className="px-6 py-4 text-center">
        <ActionsMenu ip={log.ipAddress} />
      </td>
    </tr>
  );
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-700">
        <TableHeader />
        <tbody className="divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={9} className="text-center p-8 text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : logs.length > 0 ? (
            logs.map((log) => <TableRow key={log.id} log={log} />)
          ) : (
            <tr>
              <td colSpan={9} className="text-center p-8 text-gray-500">
                Không tìm thấy dữ liệu phù hợp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// --- Giữ nguyên ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 p-4 border-t border-gray-200">
      <span className="text-sm text-gray-700">
        Trang <span className="font-semibold">{currentPage}</span> trên{" "}
        <span className="font-semibold">{totalPages}</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Trước</span>
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Sau</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// IV. COMPONENT CHÍNH: AdminPage (ĐÃ CẬP NHẬT LOGIC HOÀN TOÀN)
// ============================================================================
const AdminPage = () => {
  // State cho dữ liệu
  const [logData, setLogData] = useState<IPLogEntry[]>([]);
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficChartItem[]>([]);

  // State cho việc tải và phân trang
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  // --- MỚI: Hàm fetch dữ liệu log từ API ---
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      params.append("limit", "10");
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (dateRange[0]) {
        params.append("startDate", dateRange[0].toISOString());
      }
      if (dateRange[1]) {
        params.append("endDate", dateRange[1].toISOString());
      }

      const response = await api.get(`/logs?${params.toString()}`);

      setLogData(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch access logs:", error);
      // Optional: show an error message to the user
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, dateRange]);

  // --- MỚI: useEffect để fetch dữ liệu tổng quan (KPIs, Chart) khi component mount ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpiResponse, trafficResponse] = await Promise.all([
          api.get("/stats/kpis"),
          api.get("/stats/traffic-chart"),
        ]);
        setKpiData(kpiResponse.data);
        setTrafficData(trafficResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  // --- SỬA ĐỔI: useEffect để fetch logs khi bộ lọc hoặc trang thay đổi ---
  useEffect(() => {
    // Sử dụng debounce để tránh gọi API liên tục khi người dùng đang gõ
    const handler = setTimeout(() => {
      fetchLogs();
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [fetchLogs]);

  // Các hàm xử lý sự kiện
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi có tìm kiếm mới
  };
  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    setCurrentPage(1); // Reset về trang 1 khi có bộ lọc ngày mới
  };
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="bg-teal-100 p-3 rounded-lg">
            <Fingerprint className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Giám Sát An Ninh
            </h1>
            <p className="text-gray-600 mt-1">
              Phân tích, quản trị và bảo vệ lưu lượng truy cập hệ thống.
            </p>
          </div>
        </div>

        {/* Các component con giờ nhận dữ liệu từ state */}
        <DashboardKPIs data={kpiData} />
        <TrafficChart data={trafficData} />

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            dateRange={dateRange}
            onDateChange={handleDateChange}
          />
          <LogsTable logs={logData} isLoading={isLoading} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
