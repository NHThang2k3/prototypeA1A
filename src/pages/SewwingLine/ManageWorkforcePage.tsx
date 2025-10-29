import { useState } from "react";
import { Users, UserCheck, UserX, Save } from "lucide-react";

// Mock Data
const linePositionsData = [
  {
    id: 1,
    operation: "Sleeve Placket",
    requiredSkill: "Single Needle",
    assignedWorkerId: "W003",
  },
  {
    id: 2,
    operation: "Sleeve Attach",
    requiredSkill: "Overlock 5-thread",
    assignedWorkerId: "W005",
  },
  {
    id: 3,
    operation: "Side Seam",
    requiredSkill: "Overlock 5-thread",
    assignedWorkerId: null,
  },
  {
    id: 4,
    operation: "Collar Attach",
    requiredSkill: "Single Needle - High",
    assignedWorkerId: "W001",
  },
  {
    id: 5,
    operation: "Hemming",
    requiredSkill: "Coverstitch",
    assignedWorkerId: null,
  },
];

const availableWorkersData = [
  { id: "W001", name: "Nguyen Van A" },
  { id: "W002", name: "Tran Thi B" },
  { id: "W003", name: "Le Van C" },
  { id: "W004", name: "Pham Thi D" },
  { id: "W005", name: "Hoang Van E" },
];

const ManageWorkforcePage = () => {
  const [linePositions, setLinePositions] = useState(linePositionsData);

  const handleAssignmentChange = (
    positionId: number,
    workerId: string | null
  ) => {
    setLinePositions((prevPositions) =>
      prevPositions.map((pos) =>
        pos.id === positionId ? { ...pos, assignedWorkerId: workerId } : pos
      )
    );
  };

  const assignedCount = linePositions.filter((p) => p.assignedWorkerId).length;
  const requiredCount = linePositions.length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Workforce Management
          </h1>
          <p className="text-sm text-gray-500">
            Assign workers to sewing line positions for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>Line 05</option>
            <option>Line 06</option>
          </select>
          <input
            type="date"
            defaultValue={new Date().toISOString().substring(0, 10)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </header>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white border rounded-lg flex items-center gap-4">
          <Users className="w-6 h-6 text-gray-500" />
          <div>
            <p className="font-bold">{requiredCount}</p>
            <p className="text-sm text-gray-600">Positions Required</p>
          </div>
        </div>
        <div className="p-4 bg-white border rounded-lg flex items-center gap-4">
          <UserCheck className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-bold">{assignedCount}</p>
            <p className="text-sm text-gray-600">Workers Assigned</p>
          </div>
        </div>
        <div className="p-4 bg-white border rounded-lg flex items-center gap-4">
          <UserX className="w-6 h-6 text-red-500" />
          <div>
            <p className="font-bold">{requiredCount - assignedCount}</p>
            <p className="text-sm text-gray-600">Positions Unfilled</p>
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Position #</th>
                <th className="px-6 py-3">Operation</th>
                <th className="px-6 py-3">Required Skill</th>
                <th className="px-6 py-3">Assigned Worker</th>
              </tr>
            </thead>
            <tbody>
              {linePositions.map((pos) => (
                <tr key={pos.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{pos.id}</td>
                  <td className="px-6 py-4">{pos.operation}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
                      {pos.requiredSkill}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={pos.assignedWorkerId || ""}
                      onChange={(e) =>
                        handleAssignmentChange(pos.id, e.target.value || null)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Unassigned --</option>
                      {availableWorkersData.map((worker) => (
                        <option key={worker.id} value={worker.id}>
                          {worker.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <button className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
            <Save className="w-4 h-4" />
            Save Assignments
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageWorkforcePage;
