// src/components/InboundDashboardPage.tsx

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

// --- START: MOCK DATA & TYPES ---
interface Job {
  JOB_NO: string;
  Fabric_Type: string;
  Quantity: number;
  UoM: "m" | "kg" | "pcs";
  // Updated status order for clarity
  Status: "Incoming" | "Relaxation" | "Preparation" | "Cutting" | "Completed";
  Created_Timestamp: string;
  Preparation_Start_Timestamp?: string;
  Preparation_End_Timestamp?: string;
  Relaxation_Start_Timestamp?: string;
  Relaxation_End_Timestamp?: string;
  Issued_Timestamp?: string;
  Cutting_Start_Timestamp?: string;
  Planned_Completion_Date: string;
  Assigned_User: string;
}

const mockJobs: Job[] = [
  // Incoming jobs
  {
    JOB_NO: "J009",
    Fabric_Type: "Denim",
    Quantity: 2500,
    UoM: "m",
    Status: "Incoming",
    Created_Timestamp: "2024-05-25T10:00:00Z",
    Assigned_User: "Fuc Tran",
    Planned_Completion_Date: "2024-06-05",
  },
  {
    JOB_NO: "J010",
    Fabric_Type: "Wool",
    Quantity: 1000,
    UoM: "m",
    Status: "Incoming",
    Created_Timestamp: "2024-05-26T11:30:00Z",
    Assigned_User: "Giang Nguyen",
    Planned_Completion_Date: "2024-06-06",
  },
  // Existing jobs with statuses updated for the new flow
  {
    JOB_NO: "J001",
    Fabric_Type: "Cotton",
    Quantity: 1200,
    UoM: "m",
    Status: "Cutting",
    Created_Timestamp: "2024-05-20T08:00:00Z",
    Assigned_User: "An Nguyen",
    Planned_Completion_Date: "2024-05-28",
  },
  {
    JOB_NO: "J002",
    Fabric_Type: "Polyester",
    Quantity: 800,
    UoM: "m",
    Status: "Preparation",
    Created_Timestamp: "2024-05-21T09:30:00Z",
    Assigned_User: "Binh Le",
    Planned_Completion_Date: "2024-05-29",
  },
  {
    JOB_NO: "J003",
    Fabric_Type: "Silk",
    Quantity: 500,
    UoM: "m",
    Status: "Preparation", // Was Relaxation, now Preparation
    Created_Timestamp: "2024-05-22T10:00:00Z",
    Assigned_User: "Chi Tran",
    Planned_Completion_Date: "2024-05-30",
  },
  {
    JOB_NO: "J004",
    Fabric_Type: "Cotton",
    Quantity: 1500,
    UoM: "m",
    Status: "Relaxation", // Was Preparation, now Relaxation
    Created_Timestamp: "2024-05-23T11:00:00Z",
    Assigned_User: "Dung Pham",
    Planned_Completion_Date: "2024-06-01",
  },
  {
    JOB_NO: "J005",
    Fabric_Type: "Linen",
    Quantity: 750,
    UoM: "m",
    Status: "Relaxation", // Was Preparation, now Relaxation
    Created_Timestamp: "2024-05-24T08:30:00Z",
    Assigned_User: "An Nguyen",
    Planned_Completion_Date: "2024-06-02",
  },
  {
    JOB_NO: "J006",
    Fabric_Type: "Polyester",
    Quantity: 950,
    UoM: "m",
    Status: "Relaxation",
    Created_Timestamp: "2024-05-24T14:00:00Z",
    Assigned_User: "Chi Tran",
    Planned_Completion_Date: "2024-06-03",
  },
  {
    JOB_NO: "J007",
    Fabric_Type: "Cotton",
    Quantity: 2000,
    UoM: "m",
    Status: "Cutting",
    Created_Timestamp: "2024-05-19T13:00:00Z",
    Assigned_User: "Binh Le",
    Planned_Completion_Date: "2024-05-27",
  },
  {
    JOB_NO: "J008",
    Fabric_Type: "Silk",
    Quantity: 600,
    UoM: "m",
    Status: "Completed",
    Created_Timestamp: "2024-05-18T16:00:00Z",
    Assigned_User: "Dung Pham",
    Planned_Completion_Date: "2024-05-25",
  },
];

const performanceData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  actual: [1800, 2200, 1900, 2500, 2300],
  target: [2000, 2100, 2100, 2400, 2400],
};

const relaxationData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  output: [1500, 1700, 1650, 1800, 1900],
};
// --- END: MOCK DATA & TYPES ---

// --- KPI Card Child Component ---
interface KpiCardProps {
  title: string;
  value: string | number;
  description: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, description }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <p className="text-xs text-gray-400 mt-2">{description}</p>
  </div>
);

const InboundDashboardPage: React.FC = () => {
  const jobsInProcess = mockJobs.filter((j) => j.Status !== "Completed");

  // A. AREA 1: KPI OVERVIEW CALCULATIONS
  const kpiData = useMemo(() => {
    const totalJobs = jobsInProcess.length;
    const incomingJobs = jobsInProcess.filter(
      (j) => j.Status === "Incoming"
    ).length;
    const relaxJobs = jobsInProcess.filter(
      (j) => j.Status === "Relaxation"
    ).length;
    const prepJobs = jobsInProcess.filter(
      (j) => j.Status === "Preparation"
    ).length;
    const cuttingJobs = jobsInProcess.filter(
      (j) => j.Status === "Cutting"
    ).length;
    const avgPrepTime = "1.2 days";
    const onTimeCompletionRate = "92%";

    return {
      totalJobs,
      incomingJobs,
      prepJobs,
      relaxJobs,
      cuttingJobs,
      avgPrepTime,
      onTimeCompletionRate,
    };
  }, [jobsInProcess]);

  // B. AREA 2: FLOW ANALYSIS & WIP CHARTS
  const jobStatusPieOption: EChartsOption = useMemo(() => {
    const statusCounts = jobsInProcess.reduce((acc, job) => {
      acc[job.Status] = (acc[job.Status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      title: { text: "Job Status Distribution", left: "center" },
      tooltip: { trigger: "item" },
      legend: { orient: "vertical", left: "left" },
      series: [
        {
          name: "Job Status",
          type: "pie",
          radius: "50%",
          data: Object.entries(statusCounts).map(([name, value]) => ({
            value,
            name,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  }, [jobsInProcess]);

  // --- WIP Chart updated with new flow order ---
  const wipAreaOption: EChartsOption = {
    title: { text: "Work in Progress (WIP) Over Time", left: "left" },
    tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
    legend: {
      data: ["Incoming", "Relaxation", "Preparation", "Cutting"], // Updated order
      top: 30,
      left: "center",
      orient: "horizontal",
    },
    grid: {
      left: "3%",
      right: "12%",
      bottom: "3%",
      top: 70,
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
    ],
    yAxis: [{ type: "value" }],
    series: [
      // Series reordered to match legend and new flow
      {
        name: "Incoming",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: { focus: "series" },
        data: [1, 2, 1, 3, 2, 2, 3],
      },
      {
        name: "Relaxation",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: { focus: "series" },
        data: [3, 2, 3, 2, 4, 3, 3],
      },
      {
        name: "Preparation",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: { focus: "series" },
        data: [2, 3, 2, 4, 3, 5, 4],
      },
      {
        name: "Cutting",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: { focus: "series" },
        data: [2, 1, 2, 1, 2, 1, 2],
      },
    ],
  };

  // C. AREA 3: PERFORMANCE ANALYSIS CHARTS
  const prepPerformanceOption: EChartsOption = {
    title: { text: "Preparation Performance (m)" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Actual", "Target"], left: "right", top: 5 },
    xAxis: { type: "category", data: performanceData.labels },
    yAxis: { type: "value" },
    series: [
      { name: "Actual", type: "bar", data: performanceData.actual },
      { name: "Target", type: "line", data: performanceData.target },
    ],
  };

  const relaxationOutputOption: EChartsOption = {
    title: { text: "Relaxation Output (m)" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: relaxationData.labels },
    yAxis: { type: "value" },
    series: [{ data: relaxationData.output, type: "bar" }],
  };

  return (
    <div className="p-4 md:p-6  min-h-screen font-sans">
      {/* HEADER & FILTERS */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Data updated on: {new Date().toLocaleDateString("en-US")}
        </p>

        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm flex flex-wrap gap-4 items-center">
          <div className="flex-grow">
            <label
              htmlFor="date-range"
              className="text-sm font-medium text-gray-700"
            >
              Date Range
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="date"
                className="border-gray-300 rounded-md shadow-sm w-full"
              />
              <span className="text-gray-500">-</span>
              <input
                type="date"
                className="border-gray-300 rounded-md shadow-sm w-full"
              />
            </div>
          </div>
          <div className="flex-grow">
            <label
              htmlFor="job-no"
              className="text-sm font-medium text-gray-700"
            >
              JOB NO
            </label>
            <input
              id="job-no"
              type="text"
              placeholder="e.g., J001"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="flex-grow">
            <label
              htmlFor="fabric-type"
              className="text-sm font-medium text-gray-700"
            >
              Fabric Type
            </label>
            <select
              id="fabric-type"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option>All</option>
              <option>Cotton</option>
              <option>Polyester</option>
              <option>Silk</option>
              <option>Linen</option>
            </select>
          </div>
          <button className="self-end bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">
            Filter
          </button>
        </div>
      </header>

      <main className="space-y-6">
        {/* A. AREA 1: KPI OVERVIEW */}
        <section>
          {/* --- KPI Cards reordered to match new flow --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <KpiCard
              title="Total Jobs In Progress"
              value={kpiData.totalJobs}
              description="Excludes 'Completed' jobs"
            />
            <KpiCard
              title="Jobs Incoming"
              value={kpiData.incomingJobs}
              description="Waiting to enter warehouse"
            />
            <KpiCard
              title="Jobs in Relaxation"
              value={kpiData.relaxJobs}
              description="Relaxation stage"
            />
            <KpiCard
              title="Jobs in Preparation"
              value={kpiData.prepJobs}
              description="Preparation stage"
            />
            <KpiCard
              title="Jobs in Cutting"
              value={kpiData.cuttingJobs}
              description="Cutting stage"
            />
            <KpiCard
              title="Avg. Prep Time"
              value={kpiData.avgPrepTime}
              description="Average time to complete preparation"
            />
            <KpiCard
              title="On-time Rate"
              value={kpiData.onTimeCompletionRate}
              description="Completed within planned time"
            />
          </div>
        </section>

        {/* MAIN CHART AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT COLUMN: PERFORMANCE ANALYSIS */}
          <section className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <ReactECharts
                option={prepPerformanceOption}
                style={{ height: 300 }}
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <ReactECharts
                option={relaxationOutputOption}
                style={{ height: 300 }}
              />
            </div>
          </section>

          {/* RIGHT COLUMN: FLOW & WIP ANALYSIS */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <ReactECharts
                option={jobStatusPieOption}
                style={{ height: 300 }}
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <ReactECharts option={wipAreaOption} style={{ height: 300 }} />
            </div>
          </section>
        </div>

        {/* D. AREA 4: DETAIL TABLE */}
        <section className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Job Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    JOB NO
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Fabric Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Creation Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Planned Completion
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Assigned To
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockJobs.map((job) => (
                  <tr
                    key={job.JOB_NO}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {job.JOB_NO}
                    </td>
                    <td className="px-6 py-4">{job.Fabric_Type}</td>
                    <td className="px-6 py-4">
                      {job.Quantity} {job.UoM}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          job.Status === "Incoming"
                            ? "bg-gray-100 text-gray-800"
                            : ""
                        }
                        ${
                          job.Status === "Relaxation"
                            ? "bg-purple-100 text-purple-800"
                            : ""
                        }
                        ${
                          job.Status === "Preparation"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                        ${
                          job.Status === "Cutting"
                            ? "bg-orange-100 text-orange-800"
                            : ""
                        }
                        ${
                          job.Status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      `}
                      >
                        {job.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(job.Created_Timestamp).toLocaleDateString(
                        "en-US"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(job.Planned_Completion_Date).toLocaleDateString(
                        "en-US"
                      )}
                    </td>
                    <td className="px-6 py-4">{job.Assigned_User}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InboundDashboardPage;
