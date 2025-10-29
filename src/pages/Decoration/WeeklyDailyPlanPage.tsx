// src/pages/WeeklyDailyPlanPage/WeeklyDailyPlanPage.tsx

import { useState } from "react";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";

// ADD: Định nghĩa một type cho đối tượng Job để thay thế 'any'
type Job = {
  id: number;
  po: string;
  style: string;
  decoration: string;
  qty: number;
};

// FIX 1: Sử dụng type 'Job' đã định nghĩa cho prop 'job'
const JobCard = ({ job }: { job: Job }) => (
  <div className="p-3 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <p className="font-bold text-gray-800 text-sm">{job.po}</p>
      <GripVertical className="text-gray-400" size={16} />
    </div>
    <p className="text-xs text-gray-500">{job.style}</p>
    <div className="flex justify-between items-center mt-2">
      <span className="text-xs font-semibold text-blue-600">
        {job.decoration}
      </span>
      <span className="px-2 py-0.5 text-xs font-semibold text-white bg-gray-700 rounded-full">
        {job.qty}
      </span>
    </div>
  </div>
);

// FIX 2: Sử dụng type 'Job[]' cho prop 'jobs'
const KanbanColumn = ({ day, jobs }: { day: string; jobs: Job[] }) => (
  <div className="flex-shrink-0 w-72 bg-gray-50 rounded-lg p-3">
    <h3 className="font-bold text-gray-700 mb-3 px-1">{day}</h3>
    <div className="space-y-2 h-[60vh] overflow-y-auto pr-1">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  </div>
);

// (Best Practice) Thêm kiểu cho mock data để đảm bảo tính nhất quán
const weeklyJobs: Record<string, Job[]> = {
  "Monday, Oct 23": [
    {
      id: 1,
      po: "PO12345",
      style: "STYLE-A01",
      decoration: "Heat Press",
      qty: 1200,
    },
    {
      id: 2,
      po: "PO12347",
      style: "STYLE-C03",
      decoration: "Pad-Print",
      qty: 2500,
    },
  ],
  "Tuesday, Oct 24": [
    {
      id: 3,
      po: "PO12345",
      style: "STYLE-A01",
      decoration: "Heat Press",
      qty: 1500,
    },
    {
      id: 4,
      po: "PO12348",
      style: "STYLE-D04",
      decoration: "Bonding",
      qty: 800,
    },
  ],
  "Wednesday, Oct 25": [
    {
      id: 5,
      po: "PO12346",
      style: "STYLE-B02",
      decoration: "Embroidery",
      qty: 1000,
    },
  ],
  "Thursday, Oct 26": [
    {
      id: 6,
      po: "PO12349",
      style: "STYLE-E05",
      decoration: "Embroidery",
      qty: 2000,
    },
    {
      id: 7,
      po: "PO12347",
      style: "STYLE-C03",
      decoration: "Pad-Print",
      qty: 3000,
    },
  ],
  "Friday, Oct 27": [
    {
      id: 8,
      po: "PO12345",
      style: "STYLE-A01",
      decoration: "Heat Press",
      qty: 2300,
    },
  ],
};

const WeeklyDailyPlanPage = () => {
  const [view, setView] = useState("weekly"); // 'weekly' or 'daily'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Weekly & Daily Plan
        </h1>
        <div className="flex items-center p-1 bg-gray-200 rounded-lg">
          <button
            onClick={() => setView("weekly")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              view === "weekly" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("daily")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              view === "daily" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            Daily
          </button>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-700">
            Week 43: October 23 - 29, 2023
          </h2>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {Object.entries(weeklyJobs).map(([day, jobs]) => (
          <KanbanColumn key={day} day={day} jobs={jobs} />
        ))}
      </div>
    </div>
  );
};

export default WeeklyDailyPlanPage;
