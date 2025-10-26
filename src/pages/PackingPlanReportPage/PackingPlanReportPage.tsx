import { Search, Filter, RefreshCw } from "lucide-react";

// Mock data
const packingPlans = [
  {
    id: "PO77881",
    customer: "Adidas",
    style: "A-STYLE-01",
    totalQty: 5000,
    packedQty: 5000,
    status: "Completed",
    date: "2023-10-26",
  },
  {
    id: "PO77882",
    customer: "Puma",
    style: "P-STYLE-02",
    totalQty: 8000,
    packedQty: 6500,
    status: "In Progress",
    date: "2023-10-25",
  },
  {
    id: "PO77883",
    customer: "Nike",
    style: "N-STYLE-03",
    totalQty: 3200,
    packedQty: 0,
    status: "New",
    date: "2023-10-25",
  },
  {
    id: "PO77884",
    customer: "Adidas",
    style: "A-STYLE-04",
    totalQty: 12000,
    packedQty: 11500,
    status: "In Progress",
    date: "2023-10-24",
  },
  {
    id: "PO77885",
    customer: "New Balance",
    style: "NB-STYLE-05",
    totalQty: 7500,
    packedQty: 7500,
    status: "Completed",
    date: "2023-10-23",
  },
];

const statusColors: { [key: string]: string } = {
  Completed: "bg-green-100 text-green-800",
  "In Progress": "bg-blue-100 text-blue-800",
  New: "bg-yellow-100 text-yellow-800",
};

const PackingPlanReportPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Packing Plan Report
        </h1>
        <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
          Create Final Plan Load
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by PO..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Customers</option>
            <option>Adidas</option>
            <option>Puma</option>
            <option>Nike</option>
          </select>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Statuses</option>
            <option>New</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Apply</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  PO Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3">
                  Style
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Total Qty
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Packed Qty
                </th>
                <th scope="col" className="px-6 py-3">
                  Progress
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Creation Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {packingPlans.map((plan) => {
                const progress =
                  plan.totalQty > 0
                    ? (plan.packedQty / plan.totalQty) * 100
                    : 0;
                return (
                  <tr
                    key={plan.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {plan.id}
                    </td>
                    <td className="px-6 py-4">{plan.customer}</td>
                    <td className="px-6 py-4">{plan.style}</td>
                    <td className="px-6 py-4 text-right">
                      {plan.totalQty.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {plan.packedQty.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-500">
                        {progress.toFixed(0)}%
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          statusColors[plan.status]
                        }`}
                      >
                        {plan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{plan.date}</td>
                    <td className="px-6 py-4">
                      <button className="font-medium text-blue-600 hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackingPlanReportPage;
