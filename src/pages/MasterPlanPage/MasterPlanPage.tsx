import {
  FileUp,
  Search,
  Filter,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  MoreVertical,
  PlusCircle,
} from "lucide-react";

// Mock Data
const masterPlanData = [
  {
    id: 1,
    po: "PO12345",
    style: "STYLE-A01",
    customer: "Nike",
    qty: 5000,
    decoration: "Heat Press",
    start: "2023-10-25",
    end: "2023-10-28",
    status: "In Progress",
  },
  {
    id: 2,
    po: "PO12346",
    style: "STYLE-B02",
    customer: "Adidas",
    qty: 3000,
    decoration: "Embroidery",
    start: "2023-10-26",
    end: "2023-10-29",
    status: "Not Started",
  },
  {
    id: 3,
    po: "PO12347",
    style: "STYLE-C03",
    customer: "Puma",
    qty: 7500,
    decoration: "Pad-Print",
    start: "2023-10-24",
    end: "2023-10-30",
    status: "In Progress",
  },
  {
    id: 4,
    po: "PO12348",
    style: "STYLE-D04",
    customer: "Under Armour",
    qty: 2000,
    decoration: "Bonding",
    start: "2023-10-20",
    end: "2023-10-25",
    status: "Completed",
  },
  {
    id: 5,
    po: "PO12349",
    style: "STYLE-E05",
    customer: "Nike",
    qty: 10000,
    decoration: "Embroidery",
    start: "2023-10-28",
    end: "2023-11-05",
    status: "Not Started",
  },
  // ... more data
];

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses =
    "px-2.5 py-1 text-xs font-medium rounded-full inline-block";
  switch (status) {
    case "In Progress":
      return (
        <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
          In Progress
        </span>
      );
    case "Not Started":
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          Not Started
        </span>
      );
    case "Completed":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          Completed
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          {status}
        </span>
      );
  }
};

const MasterPlanPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Master Plan</h1>
        <div className="flex items-center space-x-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            <FileUp size={16} /> Import Plan
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700">
            <PlusCircle size={16} /> Create Job
          </button>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by PO, Style, Customer..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option>All Statuses</option>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            <Filter size={16} /> Apply Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                PO Number
              </th>
              <th scope="col" className="px-6 py-3">
                Style
              </th>
              <th scope="col" className="px-6 py-3">
                Customer
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Decoration Type
              </th>
              <th scope="col" className="px-6 py-3">
                Start Date
              </th>
              <th scope="col" className="px-6 py-3">
                End Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {masterPlanData.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.po}
                </td>
                <td className="px-6 py-4">{item.style}</td>
                <td className="px-6 py-4">{item.customer}</td>
                <td className="px-6 py-4">{item.qty.toLocaleString()}</td>
                <td className="px-6 py-4">{item.decoration}</td>
                <td className="px-6 py-4">{item.start}</td>
                <td className="px-6 py-4">{item.end}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="relative inline-block">
                    {/* Placeholder for dropdown menu */}
                    <button className="p-2 rounded-full hover:bg-gray-200">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-700">
          Showing 1 to 5 of 57 results
        </span>
        <div className="inline-flex items-center space-x-1">
          <button
            className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md">
            1
          </span>
          <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-200">
            2
          </button>
          <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-200">
            3
          </button>
          <span className="text-sm">...</span>
          <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-200">
            12
          </button>
          <button className="p-2 rounded-md hover:bg-gray-200">
            <ChevronRight size={16} />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-200">
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterPlanPage;
