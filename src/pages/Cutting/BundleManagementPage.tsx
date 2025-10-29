// src/pages/bundle-management/BundleManagementPage.tsx

// 1. IMPORTS
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Upload,
  ChevronDown,
  Columns,
  X,
  FileUp,
  CheckCircle2,
  Eye,
  FilePenLine,
  QrCode,
  Printer,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 2. TYPE DEFINITIONS (from types.ts)
export type Job = {
  jobNo: string;
  subNo: number;
  qrCode: string;
  jobDate: string;
  requireDate: string;
  shipmentDate: string;
  orderType: number;
  recDate: string;
  brandCode: string;
  poNo: string;
  poDate: string;
  shipBy: string;
  sumQty: number;
  styleNo: string;
  styleDesc: string;
  season: string;
  country: string;
  plantCode: string;
  mer: string;
  unit: string;
  comboCode: string;
  comboDesc: string;
  seqColor: number;
  colorName: string;
  jobSize: string;
  extendTerm?: string;
  colorGroup: string;
};

export type ColumnConfig = {
  key: keyof Job;
  label: string;
};

// 3. SAMPLE DATA (from data.ts)
const sampleJobs: Job[] = [
  {
    jobNo: "SOTSM2503115",
    subNo: 1,
    qrCode: "QR115A2",
    jobDate: "18/10/2025",
    requireDate: "25/11/2025",
    shipmentDate: "25/11/2025",
    orderType: 1,
    recDate: "25/11/2025",
    brandCode: "PU",
    poNo: "TEST SHIPMENT",
    poDate: "18/10/2025",
    shipBy: "MO-003",
    sumQty: 15,
    styleNo: "P1105SHO331S",
    styleDesc: "SAMPLE M SHOE",
    season: "FW25",
    country: "TES",
    plantCode: "A1A2",
    mer: "TEST",
    unit: "PCS",
    comboCode: "JI8001",
    comboDesc: "GREY/BLK",
    seqColor: 2,
    colorName: "BLACK",
    jobSize: "42",
    extendTerm: "",
    colorGroup: "Black",
  },
  {
    jobNo: "SOAD2510116",
    subNo: 1,
    qrCode: "QR116A1",
    jobDate: "20/10/2025",
    requireDate: "10/1/2026",
    shipmentDate: "5/1/2026",
    orderType: 1,
    recDate: "10/1/2026",
    brandCode: "AD",
    poNo: "900989112",
    poDate: "19/10/2025",
    shipBy: "MO-002",
    sumQty: 12050,
    styleNo: "F2998TRP404S",
    styleDesc: "MENS TRACKPANTS",
    season: "SS26",
    country: "IDN",
    plantCode: "D4B5",
    mer: "304776655",
    unit: "PCS",
    comboCode: "JI9141",
    comboDesc: "NAVY",
    seqColor: 1,
    colorName: "COLLEGIATE NAVY",
    jobSize: "L",
    extendTerm: "Net 30",
    colorGroup: "Blue",
  },
  {
    jobNo: "SOAD2510117",
    subNo: 1,
    qrCode: "QR117A1",
    jobDate: "21/10/2025",
    requireDate: "20/12/2025",
    shipmentDate: "18/12/2025",
    orderType: 3,
    recDate: "20/12/2025",
    brandCode: "RB",
    poNo: "900989253",
    poDate: "20/10/2025",
    shipBy: "AO-001",
    sumQty: 980,
    styleNo: "R5050ACC880S",
    styleDesc: "UNISEX CAP",
    season: "FW25",
    country: "CHN",
    plantCode: "E5F8",
    mer: "304321987",
    unit: "PCS",
    comboCode: "JI9211",
    comboDesc: "GREEN",
    seqColor: 1,
    colorName: "OLIVE GREEN",
    jobSize: "OSFM",
    extendTerm: "",
    colorGroup: "Green",
  },
  {
    jobNo: "SOAD2510118",
    subNo: 1,
    qrCode: "QR118A1",
    jobDate: "22/10/2025",
    requireDate: "15/01/2026",
    shipmentDate: "10/1/2026",
    orderType: 1,
    recDate: "15/01/2026",
    brandCode: "AD",
    poNo: "900989444",
    poDate: "21/10/2025",
    shipBy: "MO-001",
    sumQty: 7500,
    styleNo: "F3108HMU202S",
    styleDesc: "MENS H SWEAT (1/2)",
    season: "SS26",
    country: "DEU",
    plantCode: "A1A2",
    mer: "304459871",
    unit: "PCS",
    comboCode: "JI7553",
    comboDesc: "GREY",
    seqColor: 2,
    colorName: "HEATHER GREY",
    jobSize: "XL",
    extendTerm: "",
    colorGroup: "Grey",
  },
  {
    jobNo: "SOAD2510119",
    subNo: 1,
    qrCode: "QR119A1",
    jobDate: "22/10/2025",
    requireDate: "28/12/2025",
    shipmentDate: "28/12/2025",
    orderType: 1,
    recDate: "28/12/2025",
    brandCode: "PU",
    poNo: "900989501",
    poDate: "21/10/2025",
    shipBy: "MO-004",
    sumQty: 4300,
    styleNo: "P6543LEG765S",
    styleDesc: "WMNS LEGGING",
    season: "FW25",
    country: "KHM",
    plantCode: "F1A9",
    mer: "304887712",
    unit: "PCS",
    comboCode: "JI9834",
    comboDesc: "BURGUNDY",
    seqColor: 1,
    colorName: "BOLD BURGUNDY",
    jobSize: "M",
    extendTerm: "Net 45",
    colorGroup: "Red",
  },
];

// 4. CONSTANTS
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

const defaultVisibleColumns = ALL_COLUMNS.reduce((acc, col) => {
  acc[col.key] = true;
  return acc;
}, {} as Record<string, boolean>);

// 5. CHILD COMPONENTS

// === ColumnToggler.tsx ===
type ColumnTogglerProps = {
  allColumns: ColumnConfig[];
  visibleColumns: Record<string, boolean>;
  onColumnToggle: (columnKey: string) => void;
};

const ColumnToggler = ({
  allColumns,
  visibleColumns,
  onColumnToggle,
}: ColumnTogglerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <Columns className="mr-2 h-5 w-5" />
        Columns
        <ChevronDown className="ml-2 -mr-1 h-5 w-5" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-2 max-h-80 overflow-y-auto">
            {allColumns.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center space-x-3 px-2 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={visibleColumns[key]}
                  onChange={() => onColumnToggle(key)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// === ImportJobModal.tsx ===
type ImportJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const requiredFiles = [
  "Bill of Materials (BOM)",
  "Cutting Plan",
  "Marker Data",
  "Order Details",
  "Sewing Operations",
  "Packaging Spec",
  "Labeling Info",
  "Quality Control Plan",
];

const ImportJobModal = ({ isOpen, onClose }: ImportJobModalProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, File | null>
  >(requiredFiles.reduce((acc, val) => ({ ...acc, [val]: null }), {}));

  if (!isOpen) return null;

  const handleFileChange = (fileName: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [fileName]: file }));
  };

  const allFilesUploaded = Object.values(uploadedFiles).every(
    (file) => file !== null
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Import 8 Excel Files to Create a New JOB
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          <p className="text-sm text-gray-600 mb-6">
            Please upload all 8 required files to generate a new JOB. The system
            will process these files to gather all necessary information.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredFiles.map((fileName) => (
              <div key={fileName} className="border rounded-lg p-3">
                <label htmlFor={fileName} className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">{fileName}</p>
                      {uploadedFiles[fileName] ? (
                        <div className="flex items-center text-green-600 mt-1">
                          <CheckCircle2 size={16} className="mr-1.5" />
                          <span className="text-xs font-semibold">
                            {uploadedFiles[fileName]?.name}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">
                          Click or drag to upload
                        </p>
                      )}
                    </div>
                    <FileUp
                      className={`transition-colors ${
                        uploadedFiles[fileName]
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                      size={28}
                    />
                  </div>
                  <input
                    id={fileName}
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={(e) =>
                      handleFileChange(
                        fileName,
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </main>

        <footer className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-100 mr-3"
          >
            Cancel
          </button>
          <button
            disabled={!allFilesUploaded}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
          >
            Create JOB
          </button>
        </footer>
      </div>
    </div>
  );
};

// === JobListTable.tsx ===
type JobListTableProps = {
  jobs: Job[];
  allColumns: ColumnConfig[];
  visibleColumns: Record<string, boolean>;
  onUpdateClick: (job: Job) => void;
};

const JobListTable = ({
  jobs,
  allColumns,
  visibleColumns,
  onUpdateClick,
}: JobListTableProps) => {
  const visibleColumnHeaders = allColumns.filter(
    (col) => visibleColumns[col.key]
  );

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow border">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs text-gray-700 uppercase sticky top-0 z-10">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 whitespace-nowrap sticky left-0 bg-gray-100 z-20"
            >
              Actions
            </th>
            {visibleColumnHeaders.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr
              key={`${job.jobNo}-${job.subNo}-${index}`}
              className="border-b hover:bg-gray-50"
            >
              <td className="px-4 py-2 whitespace-nowrap sticky left-0 bg-white hover:bg-gray-50 z-10">
                <div className="flex items-center space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onUpdateClick(job)}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Update Job"
                  >
                    <Wrench size={18} />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800"
                    title="Edit Job"
                  >
                    <FilePenLine size={18} />
                  </button>
                  <button
                    className="text-purple-600 hover:text-purple-800"
                    title="Generate QR Code"
                  >
                    <QrCode size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    title="Print QR Code"
                  >
                    <Printer size={18} />
                  </button>
                </div>
              </td>
              {visibleColumnHeaders.map((col) => (
                <td key={col.key} className="px-4 py-2 whitespace-nowrap">
                  {job[col.key as keyof Job]?.toLocaleString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// === Pagination.tsx ===
type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
};

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t">
      <div className="flex items-center space-x-2 text-sm text-gray-700 mb-2 sm:mb-0">
        <span>Rows per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-1"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="hidden md:inline-block">|</span>
        <span className="hidden md:inline-block">
          Showing {startItem}-{endItem} of {totalItems}
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm px-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

// === UpdateJobModal.tsx ===
type UpdateJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onSave: (updatedJob: Job) => void;
};

const UpdateJobModal = ({
  isOpen,
  onClose,
  job,
  onSave,
}: UpdateJobModalProps) => {
  const [formData, setFormData] = useState<Partial<Job>>({});

  useEffect(() => {
    if (job) {
      setFormData({
        requireDate: job.requireDate,
        shipmentDate: job.shipmentDate,
        sumQty: job.sumQty,
        styleDesc: job.styleDesc,
      });
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sumQty" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...job, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Update Job: {job.jobNo}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <main className="p-6 space-y-4">
            <div>
              <label
                htmlFor="requireDate"
                className="block text-sm font-medium text-gray-700"
              >
                Require Date
              </label>
              <input
                type="text"
                name="requireDate"
                id="requireDate"
                value={formData.requireDate || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="shipmentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Shipment Date
              </label>
              <input
                type="text"
                name="shipmentDate"
                id="shipmentDate"
                value={formData.shipmentDate || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="sumQty"
                className="block text-sm font-medium text-gray-700"
              >
                SUM QTY
              </label>
              <input
                type="number"
                name="sumQty"
                id="sumQty"
                value={formData.sumQty || 0}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="styleDesc"
                className="block text-sm font-medium text-gray-700"
              >
                Style Description
              </label>
              <textarea
                name="styleDesc"
                id="styleDesc"
                value={formData.styleDesc || ""}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </main>
          <footer className="flex justify-end items-center p-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-100 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

// 6. MAIN COMPONENT
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

// 7. EXPORT
export default BundleManagementPage;
