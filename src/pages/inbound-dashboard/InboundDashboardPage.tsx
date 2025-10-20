// src/pages/inbound-dashboard/InboundDashboardPage.tsx

import { useMemo, useState } from "react";
import {
  differenceInDays,
  addDays,
  isAfter,
  differenceInMilliseconds,
  format,
} from "date-fns";
import {
  Package,
  Layers,
  ClipboardList,
  CheckCircle,
  Ship,
  Landmark,
} from "lucide-react";

import {
  inventoryData,
  warehouseData,
  cuttingPlanData,
  shipmentData,
} from "./data";
import type { SummaryData, DashboardFilters, GanttChartData } from "./types";

// --- CHILD COMPONENTS ---
import ChartContainer from "./components/ChartContainer";
import SummaryCard from "./components/SummaryCard";
import DashboardFiltersComponent from "./components/DashboardFilters";
import InventoryByItemChart from "./components/charts/InventoryByItemChart";
import QcStatusChart from "./components/charts/QcStatusChart";
import InventoryBySupplierChart from "./components/charts/InventoryBySupplierChart";
import InventoryAgingChart from "./components/charts/InventoryAgingChart";
import FillRateByLocationChart from "./components/charts/FillRateByLocationChart";
import CuttingPlanProgressChart from "./components/charts/CuttingPlanProgressChart";
import ShipmentTimelineChart from "./components/charts/ShipmentTimelineChart";

// --- INITIAL STATE ---
const initialFilters: DashboardFilters = {
  factory: "",
  supplier: "",
  itemCode: "",
  dateRange: { from: null, to: null },
};

// --- MAIN DASHBOARD COMPONENT ---
const InboundDashboardPage = () => {
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);

  const filterOptions = useMemo(() => {
    const factories = [...new Set(inventoryData.map((i) => i.Factory))].sort();
    const suppliers = [
      ...new Set([
        ...inventoryData.map((i) => i.Supplier),
        ...shipmentData.map((s) => s.Supplier),
      ]),
    ].sort();
    const itemCodes = [
      ...new Set([
        ...inventoryData.map((i) => i["Item Code"]),
        ...shipmentData.map((s) => s["Item Code"]),
      ]),
    ].sort();
    return { factories, suppliers, itemCodes };
  }, []);

  const handleFilterChange = <K extends keyof DashboardFilters>(
    name: K,
    value: DashboardFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const analytics = useMemo(() => {
    const today = new Date();
    // Apply filters to data sources
    const filteredInventory = inventoryData.filter((item) => {
      const date = item["Date In House"];
      const dateFrom = filters.dateRange.from;
      const dateTo = filters.dateRange.to;
      const dateMatch =
        !date ||
        ((!dateFrom || date >= dateFrom) && (!dateTo || date <= dateTo));
      const factoryMatch = !filters.factory || item.Factory === filters.factory;
      const supplierMatch =
        !filters.supplier || item.Supplier === filters.supplier;
      const itemCodeMatch =
        !filters.itemCode || item["Item Code"] === filters.itemCode;
      return dateMatch && factoryMatch && supplierMatch && itemCodeMatch;
    });

    const filteredCuttingPlan = cuttingPlanData.filter((plan) => {
      const factoryMatch = !filters.factory || plan.Factory === filters.factory;
      const itemCodeMatch =
        !filters.itemCode || plan["Item Code"] === filters.itemCode;
      return factoryMatch && itemCodeMatch;
    });

    const filteredShipments = shipmentData.filter((shipment) => {
      const supplierMatch =
        !filters.supplier || shipment.Supplier === filters.supplier;
      const itemCodeMatch =
        !filters.itemCode || shipment["Item Code"] === filters.itemCode;
      return supplierMatch && itemCodeMatch;
    });

    const filteredWarehouse = warehouseData;

    // 1. KPIs
    const totalRolls = filteredInventory.length;
    const totalYards = filteredInventory.reduce(
      (sum, item) => sum + item["Balance Yards"],
      0
    );
    const activeCuttingPlans = filteredCuttingPlan.filter(
      (p) => p["Status"] === "In Progress"
    ).length;
    const qcPassRate =
      filteredInventory.length > 0
        ? (filteredInventory.filter((i) => i["QC Status"] === "Passed").length /
            filteredInventory.length) *
          100
        : 0;
    const inTransitShipments = filteredShipments.filter(
      (s) => s.Status !== "Arrived"
    ).length;
    const yardsArrivingSoon = filteredShipments
      .filter(
        (s) => s.ETA && s.ETA <= addDays(today, 7) && isAfter(s.ETA, today)
      )
      .reduce((sum, s) => sum + s["Quantity (Yards)"], 0);

    // 2. Chart Data
    const groupAndSum = <T, K extends keyof T = keyof T>(
      data: T[],
      groupBy: K,
      sumBy: K
    ) => {
      const grouped = data.reduce((acc: Record<string, number>, item) => {
        const key = String(item[groupBy] as unknown);
        const value = item[sumBy] as unknown;
        if (typeof value === "number") {
          acc[key] = (acc[key] || 0) + value;
        }
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(grouped)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    };

    const inventoryByItemCode = groupAndSum(
      filteredInventory,
      "Item Code",
      "Balance Yards"
    );
    const inventoryBySupplier = groupAndSum(
      filteredInventory,
      "Supplier",
      "Balance Yards"
    );
    const qcStatusChartData = Object.entries(
      filteredInventory.reduce((acc: Record<string, number>, item) => {
        const status = item["QC Status"] || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    const inventoryAgingChartData = Object.entries(
      filteredInventory.reduce((acc: Record<string, number>, item) => {
        const daysOld = item["Date In House"]
          ? differenceInDays(today, item["Date In House"])
          : Infinity;
        let bucket = ">90 days";
        if (daysOld <= 30) bucket = "0-30 days";
        else if (daysOld <= 60) bucket = "31-60 days";
        else if (daysOld <= 90) bucket = "61-90 days";
        acc[bucket] = (acc[bucket] || 0) + item["Balance Yards"];
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    const fillRateByLocation = filteredWarehouse
      .map((w) => ({
        name: w["Location"],
        value:
          w["Capacity"] > 0
            ? (w["Current Occupancy"] / w["Capacity"]) * 100
            : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const cuttingPlanProgress = filteredCuttingPlan.map((p) => ({
      name: p["JOB"],
      issued: p["Issued Quantity"],
      remaining: p["Request Quantity"] - p["Issued Quantity"],
    }));

    // Gantt Chart Data for Shipments
    const chartStartDate = today;
    const upcomingShipmentsForChart = filteredShipments
      .filter((s) => s.Status !== "Arrived" && s.ETD && s.ETA)
      .sort((a, b) => a.ETA!.getTime() - b.ETA!.getTime());

    const ganttCategories = upcomingShipmentsForChart.map(
      (s) => s["PO Number"]
    );
    const ganttChartData: GanttChartData[] = upcomingShipmentsForChart.map(
      (shipment, index) => {
        const etdMillis = differenceInMilliseconds(
          shipment.ETD!,
          chartStartDate
        );
        const etaMillis = differenceInMilliseconds(
          shipment.ETA!,
          chartStartDate
        );
        const colorMap = { "In Transit": "#3b82f6", Delayed: "#ef4444" };
        return {
          name: shipment["PO Number"],
          value: [index, etdMillis, etaMillis, etaMillis - etdMillis],
          itemStyle: {
            color:
              colorMap[shipment.Status as keyof typeof colorMap] || "#6b7280",
          },
          supplier: shipment.Supplier,
          itemCode: shipment["Item Code"],
        };
      }
    );

    // 3. Table Data
    const nearlyFullLocations = filteredWarehouse
      .map((w) => ({
        ...w,
        fillRate:
          w["Capacity"] > 0
            ? (w["Current Occupancy"] / w["Capacity"]) * 100
            : 0,
      }))
      .filter((w) => w.fillRate > 90)
      .sort((a, b) => b.fillRate - a.fillRate);
    const upcomingFabricNeeds = filteredCuttingPlan.filter(
      (p) => p["Status"] === "Planned"
    );
    const upcomingShipmentsTable = upcomingShipmentsForChart.map((s) => ({
      ...s,
      daysToArrival: s.ETA ? differenceInDays(s.ETA, today) : -1,
    }));

    return {
      kpis: {
        totalRolls,
        totalYards,
        activeCuttingPlans,
        qcPassRate,
        inTransitShipments,
        yardsArrivingSoon,
      },
      charts: {
        inventoryByItemCode,
        inventoryBySupplier,
        qcStatusChartData,
        inventoryAgingChartData,
        fillRateByLocation,
        cuttingPlanProgress,
        ganttChartData,
        ganttCategories,
        chartStartDate,
      },
      tables: {
        nearlyFullLocations,
        upcomingFabricNeeds,
        upcomingShipmentsTable,
      },
    };
  }, [filters]);

  const summaryData: SummaryData[] = [
    {
      title: "Total Fabric Rolls in Stock",
      value: analytics.kpis.totalRolls,
      icon: Package,
      color: "bg-blue-500",
      unit: "rolls",
    },
    {
      title: "Total Fabric Yardage in Stock",
      value: analytics.kpis.totalYards.toLocaleString(),
      icon: Layers,
      color: "bg-indigo-500",
      unit: "Yards",
    },
    {
      title: "Active Cutting Plans",
      value: analytics.kpis.activeCuttingPlans,
      icon: ClipboardList,
      color: "bg-teal-500",
      unit: "plans",
    },
    {
      title: "Fabric QC Pass Rate",
      value: analytics.kpis.qcPassRate.toFixed(1),
      icon: CheckCircle,
      color: "bg-green-500",
      unit: "%",
    },
    {
      title: "In-Transit Shipments",
      value: analytics.kpis.inTransitShipments,
      icon: Ship,
      color: "bg-orange-500",
      unit: "POs",
    },
    {
      title: "Yards Arriving (Next 7 days)",
      value: analytics.kpis.yardsArrivingSoon.toLocaleString(),
      icon: Landmark,
      color: "bg-purple-500",
      unit: "Yards",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Inbound Dashboard
        </h1>
        <DashboardFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          options={filterOptions}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
          {summaryData.map((item) => (
            <SummaryCard key={item.title} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <ChartContainer title="Upcoming Shipment Timeline (ETA)">
            <ShipmentTimelineChart
              data={analytics.charts.ganttChartData}
              categories={analytics.charts.ganttCategories}
              chartStartDate={analytics.charts.chartStartDate}
            />
          </ChartContainer>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              Upcoming Shipment Details
            </h3>
            <div className="overflow-x-auto max-h-[280px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      PO
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Supplier
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      ETA
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Days Left
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.tables.upcomingShipmentsTable.map((shipment) => (
                    <tr key={shipment["PO Number"]}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        {shipment["PO Number"]}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {shipment.Supplier}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {shipment.ETA
                          ? format(shipment.ETA, "MMM dd, yyyy")
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold">
                        {shipment.daysToArrival >= 0
                          ? shipment.daysToArrival
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            shipment.Status === "Delayed"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {shipment.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <ChartContainer title="Inventory by Fabric Type (Yards)">
            <InventoryByItemChart data={analytics.charts.inventoryByItemCode} />
          </ChartContainer>
          <ChartContainer title="Inventory by QC Status">
            <QcStatusChart data={analytics.charts.qcStatusChartData} />
          </ChartContainer>
          <ChartContainer title="Inventory by Supplier (Yards)">
            <InventoryBySupplierChart
              data={analytics.charts.inventoryBySupplier}
            />
          </ChartContainer>
          <ChartContainer title="Inventory Aging (Yards)">
            <InventoryAgingChart
              data={analytics.charts.inventoryAgingChartData}
            />
          </ChartContainer>
          <ChartContainer title="Fill Rate by Location (%)">
            <FillRateByLocationChart
              data={analytics.charts.fillRateByLocation}
            />
          </ChartContainer>
          <ChartContainer title="Fabric Issuance Progress for Cutting Plans">
            <CuttingPlanProgressChart
              data={analytics.charts.cuttingPlanProgress}
            />
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              Nearly Full Locations (Above 90%)
            </h3>
            <div className="overflow-x-auto max-h-80">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Capacity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Occupancy
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Fill Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.tables.nearlyFullLocations.map((loc) => (
                    <tr key={loc.Location}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        {loc.Location}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {loc.Capacity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {loc["Current Occupancy"]}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-red-600">
                        {loc.fillRate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              Upcoming Fabric Needs
            </h3>
            <div className="overflow-x-auto max-h-80">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Plan Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      JOB
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Item Code
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Request Qty
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.tables.upcomingFabricNeeds.map((plan) => (
                    <tr key={plan.ID}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {plan["Plan Name"]}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        {plan.JOB}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {plan["Item Code"]}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold">
                        {plan["Request Quantity"]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboundDashboardPage;
