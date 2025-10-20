// Path: src/pages/issue-fabric-form/components/JobDetails.tsx

import React from "react";
import type { CuttingPlanJob } from "../types";
import { X } from "lucide-react";

interface Props {
  job: CuttingPlanJob;
  onClearJob: () => void;
  currentlyIssuingYards: number; // Prop mới để nhận số yard đang chọn
}

const JobDetails: React.FC<Props> = ({
  job,
  onClearJob,
  currentlyIssuingYards,
}) => {
  // Tính toán các giá trị mới
  const totalIssued = job.IssuedQuantity + currentlyIssuingYards;
  const remaining = job.RequestQuantity - totalIssued;

  // Component nhỏ để render trạng thái Thiếu/Dư
  const renderStatus = () => {
    if (remaining > 0) {
      return (
        <div className="p-3 bg-yellow-100 rounded-lg text-center">
          <p className="text-sm text-yellow-700">Still Needed</p>
          <p className="font-bold text-lg text-yellow-900">
            {remaining.toFixed(2)} yards
          </p>
        </div>
      );
    }
    if (remaining < 0) {
      return (
        <div className="p-3 bg-blue-100 rounded-lg text-center">
          <p className="text-sm text-blue-700">Surplus</p>
          <p className="font-bold text-lg text-blue-900">
            {Math.abs(remaining).toFixed(2)} yards
          </p>
        </div>
      );
    }
    return (
      <div className="p-3 bg-green-100 rounded-lg text-center">
        <p className="text-sm text-green-700">Fulfilled</p>
        <p className="font-bold text-lg text-green-900">Request Met</p>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-200 mb-6 relative">
      <button
        onClick={onClearJob}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        title="Change Job"
      >
        <X size={20} />
      </button>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Selected Job: <span className="text-indigo-600">{job.JOB}</span>
        <span className="ml-4 text-sm font-normal text-gray-500">
          ({job.ItemCode} - {job.Color})
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột 1: Request Quantity */}
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500">Request Quantity</p>
          <p className="font-bold text-2xl text-gray-800">
            {job.RequestQuantity} yards
          </p>
        </div>

        {/* Cột 2: Issued Quantity */}
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Issued</p>
          <div className="font-bold text-2xl text-indigo-600">
            {totalIssued.toFixed(2)} yards
          </div>
          {currentlyIssuingYards > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              ({job.IssuedQuantity} existing +{" "}
              {currentlyIssuingYards.toFixed(2)} new)
            </p>
          )}
        </div>

        {/* Cột 3: Status (Thiếu/Dư) */}
        {renderStatus()}
      </div>
    </div>
  );
};

export default JobDetails;
