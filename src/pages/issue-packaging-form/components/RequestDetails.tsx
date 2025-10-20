// Path: src/pages/issue-packaging-form/components/RequestDetails.tsx

import React from "react";
import type { PackagingRequest } from "../types";
import { X } from "lucide-react";

interface Props {
  request: PackagingRequest;
  onClearRequest: () => void;
  currentlyIssuingQuantity: number;
}

const RequestDetails: React.FC<Props> = ({
  request,
  onClearRequest,
  currentlyIssuingQuantity,
}) => {
  const totalIssued = request.IssuedQuantity + currentlyIssuingQuantity;
  const remaining = request.RequiredQuantity - totalIssued;

  const renderStatus = () => {
    if (remaining > 0) {
      return (
        <div className="p-3 bg-yellow-100 rounded-lg text-center">
          <p className="text-sm text-yellow-700">Still Needed</p>
          <p className="font-bold text-lg text-yellow-900">
            {remaining.toFixed(2)} units
          </p>
        </div>
      );
    }
    if (remaining < 0) {
      return (
        <div className="p-3 bg-blue-100 rounded-lg text-center">
          <p className="text-sm text-blue-700">Surplus</p>
          <p className="font-bold text-lg text-blue-900">
            {Math.abs(remaining).toFixed(2)} units
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
        onClick={onClearRequest}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        title="Change Request"
      >
        <X size={20} />
      </button>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Selected Request: <span className="text-indigo-600">{request.ID}</span>
        <span className="ml-4 text-sm font-normal text-gray-500">
          ({request.Style} - {request.JOB})
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500">Required Quantity</p>
          <p className="font-bold text-2xl text-gray-800">
            {request.RequiredQuantity} units
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Issued</p>
          <div className="font-bold text-2xl text-indigo-600">
            {totalIssued.toFixed(2)} units
          </div>
          {currentlyIssuingQuantity > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              ({request.IssuedQuantity} existing +{" "}
              {currentlyIssuingQuantity.toFixed(2)} new)
            </p>
          )}
        </div>
        {renderStatus()}
      </div>
    </div>
  );
};

export default RequestDetails;
