import { FileDown, Filter } from "lucide-react";

const incentiveData = [
  {
    id: "W001",
    name: "Nguyen Van A",
    efficiency: 105,
    base: 250,
    incentive: 50,
    ot: 25,
    total: 325,
  },
  {
    id: "W002",
    name: "Tran Thi B",
    efficiency: 98,
    base: 250,
    incentive: 50,
    ot: 25,
    total: 325,
  },
  {
    id: "W002",
    name: "Tran Thi B",
    efficiency: 98,
    base: 250,
    incentive: 20,
    ot: 0,
    total: 270,
  },
  {
    id: "W003",
    name: "Le Van C",
    efficiency: 110,
    base: 250,
    incentive: 65,
    ot: 25,
    total: 340,
  },
  {
    id: "W004",
    name: "Pham Thi D",
    efficiency: 89,
    base: 250,
    incentive: 0,
    ot: 0,
    total: 250,
  },
];

const IncentiveCalculationPage = () => (
  <div className="space-y-6">
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Incentive & OT Calculation
        </h1>
        <p className="text-sm text-gray-500">
          Review automated incentive and overtime pay for workers.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="month"
          defaultValue="2023-11"
          className="px-4 py-2 border rounded-lg"
        />
        <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg">
          <Filter className="w-4 h-4" /> Line
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700">
          <FileDown className="w-5 h-5" /> Export
        </button>
      </div>
    </header>

    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Worker ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Efficiency (%)</th>
              <th className="px-6 py-3">Base Pay ($)</th>
              <th className="px-6 py-3">Incentive ($)</th>
              <th className="px-6 py-3">OT Pay ($)</th>
              <th className="px-6 py-3">Total Earnings ($)</th>
            </tr>
          </thead>
          <tbody>
            {incentiveData.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{d.id}</td>
                <td className="px-6 py-4">{d.name}</td>
                <td
                  className="px-6 py-4 font-bold"
                  style={{ color: d.efficiency >= 100 ? "green" : "orange" }}
                >
                  {d.efficiency}%
                </td>
                <td className="px-6 py-4">{d.base.toFixed(2)}</td>
                <td className="px-6 py-4 text-green-600 font-medium">
                  {d.incentive.toFixed(2)}
                </td>
                <td className="px-6 py-4">{d.ot.toFixed(2)}</td>
                <td className="px-6 py-4 text-blue-600 font-bold text-base">
                  ${d.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
export default IncentiveCalculationPage;
