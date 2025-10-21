// Path: src/pages/issue-fabric-form/components/CuttingPlanSelection.tsx

import React, { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";
import type { CuttingPlanJob } from "../types";
import { getCuttingPlanJobs } from "../data";

interface Props {
  onJobSelect: (job: CuttingPlanJob) => void;
}

const CuttingPlanSelection: React.FC<Props> = ({ onJobSelect }) => {
  const [allJobs, setAllJobs] = useState<CuttingPlanJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedJobs, setUploadedJobs] = useState<CuttingPlanJob[]>([]);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  useEffect(() => {
    // Tải tất cả các job có sẵn một lần để mô phỏng
    getCuttingPlanJobs().then((data) => {
      setAllJobs(data);
      setLoading(false);
    });
  }, []);

  // Mô phỏng việc upload và đọc file excel
  const handleUploadClick = () => {
    setIsSimulatingUpload(true);
    // Giả lập độ trễ của việc đọc file
    setTimeout(() => {
      // Lấy một vài JOB mẫu để hiển thị (ví dụ: các job đang "Planned" hoặc "In Progress")
      const jobsFromFile = allJobs.filter(
        (job) => job.Status === "Planned" || job.Status === "In Progress"
      );
      setUploadedJobs(jobsFromFile);
      setIsSimulatingUpload(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          1. Select a Job from Uploaded Kanban
        </h2>
        <button
          onClick={handleUploadClick}
          disabled={isSimulatingUpload}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:bg-gray-400"
        >
          {isSimulatingUpload ? (
            <Loader2 size={18} className="mr-2 animate-spin" />
          ) : (
            <Upload size={18} className="mr-2" />
          )}
          Upload Kanban (Excel)
        </button>
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto max-h-[60vh]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th className="p-3">JOB</th>
              <th className="p-3">Item Code</th>
              <th className="p-3">Color</th>
              <th className="p-3">Required</th>
              <th className="p-3">Issued</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {uploadedJobs.length === 0 && !isSimulatingUpload && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  Please upload a Kanban file to see the list of jobs.
                </td>
              </tr>
            )}
            {isSimulatingUpload && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  <div className="flex justify-center items-center">
                    <Loader2
                      className="animate-spin text-indigo-600 mr-2"
                      size={20}
                    />
                    <span>Simulating file upload...</span>
                  </div>
                </td>
              </tr>
            )}
            {uploadedJobs.map((job) => (
              <tr key={job.ID} className="bg-white border-b hover:bg-gray-50">
                <td className="p-3 font-semibold text-indigo-600">{job.JOB}</td>
                <td className="p-3">{job.ItemCode}</td>
                <td className="p-3">{job.Color}</td>
                <td className="p-3">{job.RequestQuantity}</td>
                <td className="p-3">{job.IssuedQuantity}</td>
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
