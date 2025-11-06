import { useState } from "react";
import { ChevronLeft, ChevronRight, UploadCloud, X } from "lucide-react";
import * as XLSX from "xlsx";

// =============================================================================
// TYPE DEFINITIONS (ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU)
// =============================================================================

// Định nghĩa cấu trúc của một công việc
type Job = {
  id: number;
  po: string;
  style: string;
  decoration: string;
  qty: number;
};

// Định nghĩa cấu trúc của một công việc đã được gán ngày
type JobWithDay = Job & { day: string };

// SỬA LỖI: Định nghĩa cấu trúc cho một dòng dữ liệu đọc từ file Excel
// Điều này sẽ thay thế cho `any` và sửa lỗi ESLint.
type ExcelRow = {
  date: string;
  po: string;
  style: string;
  decoration: string;
  qty: number;
};

// =============================================================================
// MOCK DATA (DỮ LIỆU MẪU)
// =============================================================================

const weeklyJobsData: Record<string, Job[]> = {
  "Monday, Oct 23": [
    {
      id: 1,
      po: "PO12345",
      style: "STYLE-A01",
      decoration: "Heat Press",
      qty: 1200,
    },
    {
      id: 2,
      po: "PO12347",
      style: "STYLE-C03",
      decoration: "Pad-Print",
      qty: 2500,
    },
  ],
  "Tuesday, Oct 24": [
    {
      id: 3,
      po: "PO12345",
      style: "STYLE-A01",
      decoration: "Heat Press",
      qty: 1500,
    },
    {
      id: 4,
      po: "PO12348",
      style: "STYLE-D04",
      decoration: "Bonding",
      qty: 800,
    },
  ],
  "Wednesday, Oct 25": [
    {
      id: 5,
      po: "PO12346",
      style: "STYLE-B02",
      decoration: "Embroidery",
      qty: 1000,
    },
  ],
  "Thursday, Oct 26": [
    {
      id: 6,
      po: "PO12349",
      style: "STYLE-E05",
      decoration: "Embroidery",
      qty: 2000,
    },
    {
      id: 7,
      po: "PO12347",
      style: "STYLE-C03",
      decoration: "Pad-Print",
      qty: 3000,
    },
  ],
  "Friday, Oct 27": [
    {
      id: 8,
      po: "PO12345",
      style: "STYLE-A01",
      decoration: "Heat Press",
      qty: 2300,
    },
  ],
};

// =============================================================================
// HELPER COMPONENTS (CÁC COMPONENT PHỤ)
// =============================================================================

// Component cho popup import file
const ImportModal = ({
  isOpen,
  onClose,
  onFileUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => void;
}) => {
  const [dragging, setDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
      onClose();
    }
  };

  const handleDragEvents = (
    e: React.DragEvent<HTMLDivElement>,
    isDragging: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(isDragging);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Import Daily Plan</h2>
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
            ${
              dragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload-input")?.click()}
        >
          <UploadCloud className="mx-auto text-gray-400" size={48} />
          <p className="mt-2 text-gray-600">
            Kéo và thả file Excel của bạn vào đây hoặc{" "}
            <span className="font-semibold text-blue-600">
              nhấn để chọn file
            </span>
            .
          </p>
          <input
            id="file-upload-input"
            type="file"
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Chỉ hỗ trợ các định dạng .xlsx, .xls.
        </p>
      </div>
    </div>
  );
};

// Component bảng để hiển thị dữ liệu
const JobsTable = ({ jobs }: { jobs: JobWithDay[] }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Day
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            PO
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Style
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Decoration
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Quantity
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {jobs.map((job) => (
          <tr key={job.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {job.day}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {job.po}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {job.style}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {job.decoration}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
              {job.qty.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// =============================================================================
// MAIN COMPONENT (COMPONENT CHÍNH)
// =============================================================================

const WeeklyDailyPlanPage = () => {
  const [view, setView] = useState("weekly");
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [weeklyJobs, setWeeklyJobs] = useState(weeklyJobsData);

  // Hàm xử lý file Excel được tải lên
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // SỬA LỖI: Thay thế <any> bằng <ExcelRow> đã định nghĩa ở trên
        const json = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

        // Giả sử file excel có các cột 'date', 'po', 'style', 'decoration', 'qty'
        const newJobs = json.reduce((acc: Record<string, Job[]>, row) => {
          const day = row.date || "Uncategorized";
          if (!acc[day]) {
            acc[day] = [];
          }
          // Thêm một id tạm thời hoặc đảm bảo file Excel có id
          const newJob: Job = {
            id: Math.random(), // Hoặc một logic tạo ID tốt hơn
            po: row.po,
            style: row.style,
            decoration: row.decoration,
            qty: Number(row.qty),
          };
          acc[day].push(newJob);
          return acc;
        }, {});

        setWeeklyJobs((prevJobs) => ({ ...prevJobs, ...newJobs }));
        console.log("Dữ liệu đã import:", newJobs);
      }
    };
    reader.readAsArrayBuffer(file);
    alert(
      `File "${file.name}" đã được chọn. Kiểm tra console log để xem dữ liệu.`
    );
  };

  // Chuyển đổi dữ liệu từ object sang mảng để hiển thị trong bảng
  const flatJobs: JobWithDay[] = Object.entries(weeklyJobs).flatMap(
    ([day, jobs]) => jobs.map((job) => ({ ...job, day }))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Weekly & Daily Plan
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setImportModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Import Daily
          </button>
          <div className="flex items-center p-1 bg-gray-200 rounded-lg">
            <button
              onClick={() => setView("weekly")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                view === "weekly" ? "bg-white shadow" : "text-gray-600"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setView("daily")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                view === "daily" ? "bg-white shadow" : "text-gray-600"
              }`}
            >
              Daily
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-700">
            Week 43: October 23 - 29, 2023
          </h2>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Hiển thị component bảng */}
      <JobsTable jobs={flatJobs} />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default WeeklyDailyPlanPage;
