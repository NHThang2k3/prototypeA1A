import { Download, Calendar, Users, Sliders } from "lucide-react";

// Giả lập component biểu đồ, trong dự án thực tế bạn sẽ dùng thư viện như Recharts, Chart.js
const MockLineChart = () => (
  <div className="w-full h-72 bg-gray-100 rounded-lg flex items-center justify-center">
    <p className="text-gray-500">Line Chart Placeholder</p>
  </div>
);

const workerStats = [
  {
    id: "W001",
    name: "John Doe",
    total: 1250,
    good: 1240,
    defect: 10,
    efficiency: "95%",
  },
  {
    id: "W002",
    name: "Jane Smith",
    total: 1180,
    good: 1175,
    defect: 5,
    efficiency: "98%",
  },
  {
    id: "W003",
    name: "Peter Jones",
    total: 1300,
    good: 1270,
    defect: 30,
    efficiency: "90%",
  },
];

const StatisticsAndReportsPage = () => {
  // This title would be dynamic based on the route, e.g., 'Heat Press Stats'
  const pageTitle = "Heat Press Statistics";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Select Date Range"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by Worker"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="relative">
          <Sliders className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by Machine"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Worker Performance */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Worker Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3">Worker ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Total Output</th>
                <th className="px-6 py-3">Good Qty</th>
                <th className="px-6 py-3">Defect Qty</th>
                <th className="px-6 py-3">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {workerStats.map((w) => (
                <tr key={w.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {w.id}
                  </td>
                  <td className="px-6 py-4">{w.name}</td>
                  <td className="px-6 py-4">{w.total}</td>
                  <td className="px-6 py-4 text-green-600">{w.good}</td>
                  <td className="px-6 py-4 text-red-600">{w.defect}</td>
                  <td className="px-6 py-4 font-semibold">{w.efficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Machine Parameters */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Heat Press Temperature Report (PO12345)
        </h2>
        <MockLineChart />
        <p className="text-xs text-gray-500 mt-2 text-center">
          Temperature (°C) over Time for Job Batch #J45-B1
        </p>
      </div>
    </div>
  );
};

export default StatisticsAndReportsPage;
