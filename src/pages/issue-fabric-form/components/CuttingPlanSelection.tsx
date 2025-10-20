// Path: src/pages/issue-fabric-form/components/CuttingPlanSelection.tsx

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Search } from "lucide-react";
import type { CuttingPlanJob } from "../types";
import { getCuttingPlanJobs } from "../data";

interface Props {
  onJobSelect: (job: CuttingPlanJob) => void;
}

const CuttingPlanSelection: React.FC<Props> = ({ onJobSelect }) => {
  const [jobs, setJobs] = useState<CuttingPlanJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [factoryFilter, setFactoryFilter] = useState("");

  useEffect(() => {
    getCuttingPlanJobs().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        job.JOB.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (factoryFilter === "" || job.Factory === factoryFilter)
    );
  }, [jobs, searchTerm, factoryFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        1. Select a Job from Cutting Plan
      </h2>
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative flex-grow">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by JOB..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={factoryFilter}
          onChange={(e) => setFactoryFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Factories</option>
          {[...new Set(jobs.map((j) => j.Factory))].map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto max-h-[60vh]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th className="p-3">JOB</th>
              <th className="p-3">Item Code</th>
              <th className="p-3">Color</th>
              <th className="p-3">Factory</th>
              <th className="p-3">Plan Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.ID} className="bg-white border-b hover:bg-gray-50">
                <td className="p-3 font-semibold text-indigo-600">{job.JOB}</td>
                <td className="p-3">{job.ItemCode}</td>
                <td className="p-3">{job.Color}</td>
                <td className="p-3">{job.Factory}</td>
                <td className="p-3">
                  {new Date(job.PlanDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      job.Status === "Planned"
                        ? "bg-blue-100 text-blue-800"
                        : job.Status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {job.Status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onJobSelect(job)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-xs font-medium"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CuttingPlanSelection;
