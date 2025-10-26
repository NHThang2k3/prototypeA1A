import { Filter, FileDown, Calendar, Users, BarChart } from "lucide-react";

// Mock data for the consolidated report
const reportData = [
  {
    date: "2023-11-06",
    line: "Line 05",
    po: "PO001",
    style: "T-SHIRT-01",
    target: 500,
    actual: 485,
    efficiency: 97,
    downtime: 15,
    firstPassYield: 98.5,
    defects: 7,
  },
  {
    date: "2023-11-06",
    line: "Line 06",
    po: "PO002",
    style: "JACKET-V2",
    target: 250,
    actual: 255,
    efficiency: 102,
    downtime: 5,
    firstPassYield: 99.1,
    defects: 2,
  },
  {
    date: "2023-11-05",
    line: "Line 05",
    po: "PO001",
    style: "T-SHIRT-01",
    target: 500,
    actual: 510,
    efficiency: 102,
    downtime: 8,
    firstPassYield: 99.0,
    defects: 5,
  },
  {
    date: "2023-11-05",
    line: "Line 06",
    po: "PO002",
    style: "JACKET-V2",
    target: 250,
    actual: 240,
    efficiency: 96,
    downtime: 25,
    firstPassYield: 97.5,
    defects: 6,
  },
  {
    date: "2023-11-04",
    line: "Line 05",
    po: "PO001",
    style: "T-SHIRT-01",
    target: 500,
    actual: 490,
    efficiency: 98,
    downtime: 12,
    firstPassYield: 98.2,
    defects: 9,
  },
  {
    date: "2023-11-04",
    line: "Line 06",
    po: "PO002",
    style: "JACKET-V2",
    target: 250,
    actual: 248,
    efficiency: 99,
    downtime: 10,
    firstPassYield: 98.8,
    defects: 3,
  },
];

const ConsolidatedReportPage = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">
          Consolidated Sewing Line Report
        </h1>
        <p className="text-sm text-gray-500">
          Detailed historical performance data for in-depth analysis.
        </p>
      </header>

      {/* Filters Section */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Date Range
            </label>
            <div className="relative mt-1">
              <Calendar className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Select date range"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Sewing Line
            </label>
            <div className="relative mt-1">
              <Users className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Lines</option>
                <option>Line 05</option>
                <option>Line 06</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              PO / Style
            </label>
            <div className="relative mt-1">
              <BarChart className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g., PO001 or T-SHIRT-01"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Filter className="w-4 h-4" /> Apply Filters
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <FileDown className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Date
                </th>
                <th scope="col" className="px-4 py-3">
                  Line
                </th>
                <th scope="col" className="px-4 py-3">
                  PO
                </th>
                <th scope="col" className="px-4 py-3">
                  Style
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Target
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Actual
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Efficiency (%)
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Downtime (min)
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  FPY (%)
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Defects
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="px-4 py-4">{row.line}</td>
                  <td className="px-4 py-4">{row.po}</td>
                  <td className="px-4 py-4">{row.style}</td>
                  <td className="px-4 py-4 text-right">{row.target}</td>
                  <td className="px-4 py-4 text-right font-bold">
                    {row.actual}
                  </td>
                  <td
                    className={`px-4 py-4 text-right font-bold ${
                      row.efficiency >= 100
                        ? "text-green-600"
                        : row.efficiency >= 95
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {row.efficiency}%
                  </td>
                  <td className="px-4 py-4 text-right">{row.downtime}</td>
                  <td
                    className={`px-4 py-4 text-right font-bold ${
                      row.firstPassYield >= 99
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {row.firstPassYield}%
                  </td>
                  <td className="px-4 py-4 text-right">{row.defects}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-bold">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right">
                  Totals / Averages
                </td>
                <td className="px-4 py-3 text-right">2500</td>
                <td className="px-4 py-3 text-right">2488</td>
                <td className="px-4 py-3 text-right text-green-600">99.5%</td>
                <td className="px-4 py-3 text-right">75</td>
                <td className="px-4 py-3 text-right text-green-600">98.5%</td>
                <td className="px-4 py-3 text-right">32</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedReportPage;
