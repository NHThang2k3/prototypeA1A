// Path: src/pages/sewing-trims-kanban/components/SewingTrimsTaskDetailsModal.tsx
// Note: This is a new file.
import React from "react";
import type { SewingTrimsTask } from "../types";
import { X } from "lucide-react";
import PriorityTag from "./PriorityTag";
import AssigneeAvatar from "./AssigneeAvatar";

interface Props {
  task: SewingTrimsTask;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="text-md text-gray-800 mt-1">{children}</div>
  </div>
);

const SewingTrimsTaskDetailsModal: React.FC<Props> = ({ task, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {task.requestName}
            </h2>
            <p className="text-sm text-gray-500">Request ID: {task.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 border-t border-b py-4">
          <DetailItem label="JOB">{task.job}</DetailItem>
          <DetailItem label="Style">{task.style}</DetailItem>
          <DetailItem label="Factory Line">{task.factoryLine}</DetailItem>
          <DetailItem label="Date Required">{task.dateRequired}</DetailItem>
          <DetailItem label="Date Created">{task.dateCreated}</DetailItem>
          <DetailItem label="PO Number">{task.poNumber}</DetailItem>
          <DetailItem label="BOM ID">{task.bomId}</DetailItem>
          <DetailItem label="Color">{task.color}</DetailItem>
          <DetailItem label="Size">{task.size}</DetailItem>
          <DetailItem label="Progress">
            <span className="font-semibold">
              {task.issuedQuantity} / {task.requiredQuantity}
            </span>
          </DetailItem>
          <DetailItem label="Priority">
            <PriorityTag priority={task.priority} />
          </DetailItem>
          <DetailItem label="Created By">
            <div className="flex items-center space-x-2">
              <AssigneeAvatar assignee={task.createdBy} />
              <span>{task.createdBy.name}</span>
            </div>
          </DetailItem>
        </div>

        {/* Remarks */}
        {task.remarks && (
          <div>
            <p className="text-sm font-medium text-gray-500">Remarks</p>
            <p className="text-md text-gray-700 bg-gray-50 p-3 rounded-md mt-1">
              {task.remarks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SewingTrimsTaskDetailsModal;
