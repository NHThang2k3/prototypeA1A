// src/pages/CuttingWeeklyDailyPlanPage/CuttingWeeklyDailyPlanPage.tsx

import React, { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import { enUS } from "date-fns/locale"; // Changed from 'vi' to 'enUS'
import {
  Search,
  Calendar,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  CalendarPlus,
} from "lucide-react";

// --- TYPE DEFINITIONS (Unchanged) ---

type ProductionOrder = {
  id: string;
  style: string;
  color: string;
  quantity: number;
  fabricRequired: string;
  deliveryDate: string;
};

type CuttingTable = {
  id: string;
  name: string;
};

type PlannedItem = {
  kanbanId: string;
  planDate: Date;
  tableId: string;
  po: ProductionOrder;
};

// --- MOCK DATA (Table names translated) ---

const mockUnplannedPOs: ProductionOrder[] = [
  {
    id: "PO-78901",
    style: "TSHIRT-V2",
    color: "Black",
    quantity: 500,
    fabricRequired: "250m",
    deliveryDate: "2023-12-10",
  },
  {
    id: "PO-78902",
    style: "POLO-X1",
    color: "White",
    quantity: 300,
    fabricRequired: "180m",
    deliveryDate: "2023-12-12",
  },
  {
    id: "PO-78903",
    style: "JACKET-Z9",
    color: "Navy",
    quantity: 150,
    fabricRequired: "300m",
    deliveryDate: "2023-12-15",
  },
  {
    id: "PO-78904",
    style: "PANTS-C4",
    color: "Khaki",
    quantity: 400,
    fabricRequired: "480m",
    deliveryDate: "2023-12-18",
  },
];

const mockCuttingTables: CuttingTable[] = [
  { id: "table-1", name: "Cutting Table 1" }, // Translated
  { id: "table-2", name: "Cutting Table 2" }, // Translated
  { id: "table-3", name: "Cutting Table 3" }, // Translated
  { id: "table-4", name: "Cutting Table 4" }, // Translated
];

// --- SCHEDULING MODAL COMPONENT ---

type SchedulePOModalProps = {
  isOpen: boolean;
  onClose: () => void;
  po: ProductionOrder | null;
  tables: CuttingTable[];
  defaultDate: Date;
  onSchedule: (poId: string, tableId: string, date: Date) => void;
};

const SchedulePOModal: React.FC<SchedulePOModalProps> = ({
  isOpen,
  onClose,
  po,
  tables,
  defaultDate,
  onSchedule,
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string>(
    tables[0]?.id || ""
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    format(defaultDate, "yyyy-MM-dd")
  );

  if (!isOpen || !po) return null;

  const handleSubmit = () => {
    if (selectedTableId && selectedDate) {
      onSchedule(po.id, selectedTableId, parseISO(selectedDate));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Schedule PO: <span className="text-blue-600">{po.id}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="cuttingTable"
              className="block text-sm font-medium text-gray-700"
            >
              Select Cutting Table
            </label>
            <select
              id="cuttingTable"
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="planDate"
              className="block text-sm font-medium text-gray-700"
            >
              Select Cutting Date
            </label>
            <input
              type="date"
              id="planDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const CuttingWeeklyDailyPlanPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [unplannedPOs, setUnplannedPOs] =
    useState<ProductionOrder[]>(mockUnplannedPOs);
  const [plannedItems, setPlannedItems] = useState<PlannedItem[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<ProductionOrder | null>(null);

  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i)
  );

  const handleOpenScheduleModal = (po: ProductionOrder) => {
    setSelectedPO(po);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPO(null);
  };

  const handleConfirmSchedule = (poId: string, tableId: string, date: Date) => {
    const poToSchedule = unplannedPOs.find((p) => p.id === poId);
    if (poToSchedule) {
      setUnplannedPOs((prev) => prev.filter((p) => p.id !== poId));
      const newPlannedItem: PlannedItem = {
        kanbanId: `CUT-${Date.now()}`,
        planDate: date,
        tableId: tableId,
        po: poToSchedule,
      };
      setPlannedItems((prev) => [...prev, newPlannedItem]);
    }
  };

  const handleRemovePlannedItem = (kanbanId: string) => {
    const itemToRemove = plannedItems.find(
      (item) => item.kanbanId === kanbanId
    );
    if (itemToRemove) {
      setPlannedItems((prev) =>
        prev.filter((item) => item.kanbanId !== kanbanId)
      );
      setUnplannedPOs((prev) => [itemToRemove.po, ...prev]);
    }
  };

  const changeDate = (amount: number) => {
    const newDate = addDays(
      currentDate,
      viewMode === "day" ? amount : amount * 7
    );
    setCurrentDate(newDate);
  };

  const handleSendPlan = () => {
    alert(
      `Plan sent for ${format(
        currentDate,
        "MM/dd/yyyy"
      )}!\n\n(This is a simulation. You would call a real API here.)`
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Cutting Plan (Weekly & Daily)
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Select POs from the Master Plan to create Kanbans for the cutting
            tables.
          </p>
        </div>
        <button
          onClick={handleSendPlan}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700"
        >
          <Send className="w-5 h-5" />
          <span>Save & Send Plan</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex h-full overflow-hidden">
        {/* Left Panel: Unplanned POs */}
        <aside className="w-1/3 xl:w-1/4 h-full flex flex-col border-r bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Master Plan (Unscheduled)
          </h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search PO, Style..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex-grow space-y-3 overflow-y-auto pr-2">
            {unplannedPOs.length > 0 ? (
              unplannedPOs.map((po) => (
                <div
                  key={po.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <p className="font-bold text-blue-600">{po.id}</p>
                  <p className="text-sm text-gray-700">
                    {po.style} - {po.color}
                  </p>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Qty: {po.quantity}</span>
                    <span>Fabric: {po.fabricRequired}</span>
                  </div>
                  <button
                    onClick={() => handleOpenScheduleModal(po)}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Schedule
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-gray-500 mt-8">
                No production orders are waiting to be scheduled.
              </p>
            )}
          </div>
        </aside>

        {/* Right Panel: Planning Board */}
        <main className="w-2/3 xl:w-3/4 h-full flex flex-col p-4">
          {/* Board Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode("day")}
                className={`px-3 py-1 text-sm rounded-md ${
                  viewMode === "day"
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600"
                }`}
              >
                <LayoutGrid className="w-4 h-4 inline mr-1" /> Day
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-3 py-1 text-sm rounded-md ${
                  viewMode === "week"
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600"
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-1" /> Week
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeDate(-1)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold text-lg text-gray-700 w-64 text-center">
                {viewMode === "day"
                  ? format(currentDate, "eeee, MMMM dd, yyyy", { locale: enUS })
                  : `Week ${format(currentDate, "w")}, ${format(
                      startOfWeek(currentDate, { weekStartsOn: 1 }),
                      "MM/dd"
                    )} - ${format(
                      addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6),
                      "MM/dd/yyyy"
                    )}`}
              </span>
              <button
                onClick={() => changeDate(1)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Board Content */}
          <div className="flex-grow overflow-auto">
            {viewMode === "day" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
                {mockCuttingTables.map((table) => (
                  <div
                    key={table.id}
                    className="flex flex-col h-full bg-slate-100 rounded-lg"
                  >
                    <h3 className="p-2 font-semibold text-center text-gray-700 bg-slate-200 rounded-t-lg">
                      {table.name}
                    </h3>
                    <div className="p-2 space-y-2 overflow-y-auto flex-grow">
                      {plannedItems
                        .filter(
                          (item) =>
                            item.tableId === table.id &&
                            isSameDay(item.planDate, currentDate)
                        )
                        .map((item) => (
                          <div
                            key={item.kanbanId}
                            className="relative p-2 bg-white rounded border border-green-300 group"
                          >
                            <p className="font-semibold text-sm text-green-800">
                              {item.po.id}
                            </p>
                            <p className="text-xs text-gray-600">
                              {item.po.style}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.po.quantity}
                            </p>
                            <button
                              onClick={() =>
                                handleRemovePlannedItem(item.kanbanId)
                              }
                              className="absolute top-1 right-1 p-0.5 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Weekly View
              <div className="grid grid-cols-7 gap-2 h-full">
                {weekDays.map((day) => (
                  <div
                    key={day.toString()}
                    className="bg-slate-100 rounded-lg p-2 flex flex-col"
                  >
                    <p className="font-semibold text-center text-sm">
                      {format(day, "eee", { locale: enUS })}
                    </p>
                    <p className="text-center text-xs text-gray-500 mb-2">
                      {format(day, "MM/dd")}
                    </p>
                    <div className="space-y-1 overflow-y-auto">
                      {plannedItems
                        .filter((item) => isSameDay(item.planDate, day))
                        .map((item) => (
                          <div
                            key={item.kanbanId}
                            className="p-1.5 bg-white rounded-md text-xs shadow-sm border-l-4 border-blue-400"
                          >
                            <p className="font-semibold text-blue-800">
                              {item.po.style}
                            </p>
                            <p className="text-gray-600">{item.po.id}</p>
                            <p className="text-gray-500">
                              Table:{" "}
                              {mockCuttingTables
                                .find((t) => t.id === item.tableId)
                                ?.name.replace("Cutting Table ", "")}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Component */}
      <SchedulePOModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        po={selectedPO}
        tables={mockCuttingTables}
        defaultDate={currentDate}
        onSchedule={handleConfirmSchedule}
      />
    </div>
  );
};

export default CuttingWeeklyDailyPlanPage;
