import { PlusCircle, FileDown, Search, SlidersHorizontal } from "lucide-react";

// Mock data for demonstration
const productionOrders = [
  {
    id: "PO001",
    style: "T-SHIRT-01",
    color: "Black",
    quantity: 5000,
    startDate: "2023-10-25",
    endDate: "2023-11-05",
    status: "Planned",
    requestedLayout: true,
    requestedAcc: false,
  },
  {
    id: "PO002",
    style: "JACKET-V2",
    color: "Navy",
    quantity: 2500,
    startDate: "2023-10-28",
    endDate: "2023-11-10",
    status: "Planned",
    requestedLayout: true,
    requestedAcc: true,
  },
  {
    id: "PO003",
    style: "PANT-SLIM",
    color: "Khaki",
    quantity: 3000,
    startDate: "2023-11-01",
    endDate: "2023-11-12",
    status: "Waiting",
    requestedLayout: false,
    requestedAcc: false,
  },
  {
    id: "PO004",
    style: "T-SHIRT-01",
    color: "White",
    quantity: 5000,
    startDate: "2023-11-06",
    endDate: "2023-11-15",
    status: "Waiting",
    requestedLayout: false,
    requestedAcc: false,
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  const statusClasses = {
    Planned: "bg-blue-100 text-blue-800",
    Waiting: "bg-gray-100 text-gray-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`${baseClasses} ${
        statusClasses[status as keyof typeof statusClasses] ||
        statusClasses.Waiting
      }`}
    >
      {status}
    </span>
  );
};

const RequestStatus = ({
  requested,
  type,
}: {
  requested: boolean;
  type: "Layout" | "Accessories";
}) => {
  if (requested) {
    return (
      <span className="text-xs font-semibold text-green-600">Requested</span>
    );
  }
  return (
    <button className="px-2 py-1 text-xs text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
      Request {type}
    </button>
  );
};

const ProductionPlanPage = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Production Plan</h1>
          <p className="text-sm text-gray-500">
            View overall plans and create booking kanbans for sewing lines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusCircle className="w-5 h-5" />
            Create Booking Kanban
          </button>
        </div>
      </header>

      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by PO or Style..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FileDown className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Production Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th scope="col" className="px-6 py-3">
                  PO Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Style
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  Planned Dates
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Resources Request
                </th>
              </tr>
            </thead>
            <tbody>
              {productionOrders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    {order.style} ({order.color})
                  </td>
                  <td className="px-6 py-4">
                    {order.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {order.startDate} to {order.endDate}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-4">
                      <RequestStatus
                        requested={order.requestedLayout}
                        type="Layout"
                      />
                      <RequestStatus
                        requested={order.requestedAcc}
                        type="Accessories"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionPlanPage;
