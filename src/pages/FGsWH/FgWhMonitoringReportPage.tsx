import { useState } from "react";
import { Search, List, MapPin } from "lucide-react";

// Mock data
const inventory = [
  {
    id: "CARTON-001",
    po: "PO77881",
    style: "A-STYLE-01",
    color: "Black",
    size: "M",
    qty: 50,
    location: "A-01-03",
    status: "QC Pass",
  },
  {
    id: "CARTON-002",
    po: "PO77881",
    style: "A-STYLE-01",
    color: "Black",
    size: "L",
    qty: 50,
    location: "A-01-04",
    status: "Awaiting Shipment",
  },
  {
    id: "CARTON-003",
    po: "PO77882",
    style: "P-STYLE-02",
    color: "Red",
    size: "S",
    qty: 30,
    location: "B-05-11",
    status: "Packed",
  },
  {
    id: "CARTON-004",
    po: "PO77884",
    style: "A-STYLE-04",
    color: "White",
    size: "M",
    qty: 40,
    location: "C-02-01",
    status: "QC Pass",
  },
  {
    id: "CARTON-005",
    po: "PO77884",
    style: "A-STYLE-04",
    color: "White",
    size: "M",
    qty: 40,
    location: "C-02-02",
    status: "QC Pass",
  },
];

const statusColors: { [key: string]: string } = {
  "QC Pass": "bg-green-100 text-green-800",
  "Awaiting Shipment": "bg-purple-100 text-purple-800",
  Packed: "bg-blue-100 text-blue-800",
};

const WarehouseMap = () => {
  // Simplified representation of a warehouse layout
  const layout = Array.from({ length: 5 }, (_, rack) =>
    Array.from({ length: 10 }, (_, shelf) => ({
      id: `R${rack + 1}-S${shelf + 1}`,
      status: Math.random() > 0.4 ? "Occupied" : "Empty",
    }))
  );

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-4 text-lg">Warehouse Visual Map</h3>
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>Occupied
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-300 rounded-sm"></div>Empty
        </div>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {layout.flat().map((loc) => (
          <div
            key={loc.id}
            title={`${loc.id} - ${loc.status}`}
            className={`h-12 w-full rounded-md cursor-pointer transition-transform hover:scale-110 ${
              loc.status === "Occupied" ? "bg-blue-500" : "bg-green-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

const FgWhMonitoringReportPage = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        FG Warehouse Monitoring
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("list")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "list"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <List className="w-5 h-5" /> Inventory List
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "map"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <MapPin className="w-5 h-5" /> Warehouse Map
            </button>
          </nav>
        </div>

        <div className="pt-6">
          {activeTab === "list" && (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Carton ID, PO, Style, Location..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Carton ID</th>
                      <th className="px-6 py-3">PO</th>
                      <th className="px-6 py-3">Style</th>
                      <th className="px-6 py-3">Color</th>
                      <th className="px-6 py-3">Size</th>
                      <th className="px-6 py-3">Qty</th>
                      <th className="px-6 py-3">Location</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr
                        key={item.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.id}
                        </td>
                        <td className="px-6 py-4">{item.po}</td>
                        <td className="px-6 py-4">{item.style}</td>
                        <td className="px-6 py-4">{item.color}</td>
                        <td className="px-6 py-4">{item.size}</td>
                        <td className="px-6 py-4">{item.qty}</td>
                        <td className="px-6 py-4 font-mono text-blue-700">
                          {item.location}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              statusColors[item.status]
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {activeTab === "map" && <WarehouseMap />}
        </div>
      </div>
    </div>
  );
};

export default FgWhMonitoringReportPage;
