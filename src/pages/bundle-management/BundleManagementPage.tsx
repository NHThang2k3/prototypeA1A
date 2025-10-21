// src/pages/bundle-management/BundleManagementPage.tsx
import { useState, useMemo } from "react";
import { Search, Upload } from "lucide-react";
import type { Job, ColumnConfig } from "./types";
import { sampleJobs } from "./data";

// Import components
import ImportJobModal from "./components/ImportJobModal";
import UpdateJobModal from "./components/UpdateJobModal";
import JobListTable from "./components/JobListTable";
import Pagination from "./components/Pagination";
import ColumnToggler from "./components/ColumnToggler";

// Định nghĩa tất cả các cột
const ALL_COLUMNS: ColumnConfig[] = [
  { key: "jobNo", label: "JOB NO" },
  { key: "subNo", label: "SUB NO" },
  { key: "qrCode", label: "QR Code" },
  { key: "jobDate", label: "JOB DATE" },
  { key: "requireDate", label: "REQUIRE DATE" },
  { key: "shipmentDate", label: "SHIPMENT DATE" },
  { key: "orderType", label: "ORDER TYPE" },
  { key: "recDate", label: "REC DATE" },
  { key: "brandCode", label: "BRAND CODE" },
  { key: "poNo", label: "PO NO" },
  { key: "poDate", label: "PO DATE" },
  { key: "shipBy", label: "SHIP_BY" },
  { key: "sumQty", label: "SUM QTY" },
  { key: "styleNo", label: "STYLE NO" },
  { key: "styleDesc", label: "STYLE DESC" },
  { key: "season", label: "Season" },
  { key: "country", label: "Country" },
  { key: "plantCode", label: "PLANT_CODE" },
  { key: "mer", label: "MER" },
  { key: "unit", label: "Unit" },
  { key: "comboCode", label: "COMBO_CODE" },
  { key: "comboDesc", label: "COMBO_DESC" },
  { key: "seqColor", label: "SEQ_COLOR" },
  { key: "colorName", label: "COLOR_NAME" },
  { key: "jobSize", label: "JOB_SIZE" },
  { key: "extendTerm", label: "Extend Term" },
  { key: "colorGroup", label: "Color Group" },
];

// Tạo state mặc định cho các cột hiển thị
const defaultVisibleColumns = ALL_COLUMNS.reduce((acc, col) => {
  acc[col.key] = true; // Mặc định hiển thị tất cả
  return acc;
}, {} as Record<string, boolean>);

const BundleManagementPage = () => {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

  // State for modals
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State for column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    defaultVisibleColumns
  );

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns((prev) => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  const handleUpdateJob = (jobToUpdate: Job) => {
    setSelectedJob(jobToUpdate);
    setUpdateModalOpen(true);
  };

  const handleSaveJob = (updatedJob: Job) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.jobNo === updatedJob.jobNo && job.subNo === updatedJob.subNo
          ? updatedJob
          : job
      )
    );
    setUpdateModalOpen(false);
    setSelectedJob(null);
  };

  // Logic lọc và phân trang
  const processedJobs = useMemo(() => {
    let filtered = jobs;
    if (appliedSearchTerm) {
      filtered = jobs.filter((job) =>
        job.jobNo.toLowerCase().includes(appliedSearchTerm.toLowerCase())
      );
    }

    const paginated = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return { filtered, paginated };
  }, [appliedSearchTerm, jobs, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Bundle Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage, import, and view details of all jobs.
        </p>
      </header>

      {/* Thanh công cụ */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow border">
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by JOB NO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <ColumnToggler
            allColumns={ALL_COLUMNS}
            visibleColumns={visibleColumns}
            onColumnToggle={handleColumnToggle}
          />
          <button
            onClick={() => setImportModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <Upload className="mr-2 h-5 w-5" />
            Import File
          </button>
        </div>
      </div>

      {/* Bảng và Phân trang */}
      <div className="flex flex-col">
        <JobListTable
          jobs={processedJobs.paginated}
          allColumns={ALL_COLUMNS}
          visibleColumns={visibleColumns}
          onUpdateClick={handleUpdateJob}
        />
        <Pagination
          totalItems={processedJobs.filtered.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Modals */}
      <ImportJobModal
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
      />
      <UpdateJobModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        job={selectedJob}
        onSave={handleSaveJob}
      />
    </div>
  );
};

export default BundleManagementPage;
