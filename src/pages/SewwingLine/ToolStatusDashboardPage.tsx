import {
  PlusCircle,
  Search,
  AlertTriangle,
  Wrench,
  FileText,
} from "lucide-react";

// Mock data for needle log
const needleLogData = [
  {
    id: "LOG-001",
    date: "2023-11-07 09:15",
    machine: "SN-101",
    worker: "W001",
    type: "Issue New",
    needleType: "DBx1 #11",
    details: "Start of shift",
  },
  {
    id: "LOG-002",
    date: "2023-11-07 10:30",
    machine: "OL-203",
    worker: "W002",
    type: "Broken",
    needleType: "DCx27 #11",
    details: "Broken needle report #BN-045 filed",
  },
  {
    id: "LOG-003",
    date: "2023-11-07 10:32",
    machine: "OL-203",
    worker: "W002",
    type: "Issue New",
    needleType: "DCx27 #11",
    details: "Replacement for #BN-045",
  },
  {
    id: "LOG-004",
    date: "2023-11-07 14:00",
    machine: "CS-301",
    worker: "W003",
    type: "Return Old",
    needleType: "UYx128 #10",
    details: "End of PO",
  },
];

const LogTypeBadge = ({ type }: { type: string }) => {
  const styles = {
    "Issue New": "bg-blue-100 text-blue-800",
    Broken: "bg-red-100 text-red-800",
    "Return Old": "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
        styles[type as keyof typeof styles] || "bg-gray-100 text-gray-800"
      }`}
    >
      {type}
    </span>
  );
};

const ToolStatusDashboardPage = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Metal Tool Management
          </h1>
          <p className="text-sm text-gray-500">
            Track sewing needles and manage broken needle procedures.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700">
            <AlertTriangle className="w-5 h-5" /> Report Broken Needle
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
            <PlusCircle className="w-5 h-5" /> New Log Entry
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Wrench className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Needles in Use
              </p>
              <p className="text-3xl font-bold text-gray-800">152</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Broken Needles (24h)
              </p>
              <p className="text-3xl font-bold text-gray-800">1</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <FileText className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Reports Pending Review
              </p>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Needle Log Table */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Needle Control Log
        </h2>
        <div className="relative mb-4">
          <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Machine, Worker, or Needle Type..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Machine</th>
                <th className="px-6 py-3">Worker</th>
                <th className="px-6 py-3">Needle Type</th>
                <th className="px-6 py-3">Log Type</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {needleLogData.map((log) => (
                <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{log.date}</td>
                  <td className="px-6 py-4">{log.machine}</td>
                  <td className="px-6 py-4">{log.worker}</td>
                  <td className="px-6 py-4">{log.needleType}</td>
                  <td className="px-6 py-4">
                    <LogTypeBadge type={log.type} />
                  </td>
                  <td className="px-6 py-4">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ToolStatusDashboardPage;
