// src/pages/damaged-goods-repair/ApproveRepairRequestPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Check, X, UserPlus, MessageSquare, ArrowLeft } from "lucide-react";
import type { RepairRequest } from "./types";

const mockRequests: RepairRequest[] = [
  {
    id: "RR-001",
    creationDate: "2023-10-26",
    poCode: "PO-12345",
    productCode: "STY-ABC-01",
    process: "Embroidery",
    defectType: "Thêu sai chỉ",
    defectQty: 15,
    assignee: "Nguyễn Văn A",
    creator: "Trần Thị B",
    status: "In Progress",
    description: "Chỉ thêu màu xanh bị lệch so với mẫu thiết kế.",
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
  },
  {
    id: "RR-002",
    creationDate: "2023-10-26",
    poCode: "PO-12346",
    productCode: "STY-XYZ-02",
    process: "Heat Press",
    defectType: "Ép bong tróc",
    defectQty: 8,
    creator: "Lê Văn C",
    status: "Pending Approval",
    description: "Logo ở ngực trái bị bong tróc sau khi ép nhiệt.",
    images: ["https://via.placeholder.com/150"],
  },
];

const InfoField = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
);

const ApproveRepairRequestPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [decision, setDecision] = useState<"Approve" | "Reject" | null>(null);

  useEffect(() => {
    setRequest(mockRequests.find((r) => r.id === requestId) || null);
  }, [requestId]);

  if (!request) {
    return <div>Request not found.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Request ${request.id} has been ${decision}d!`);
    navigate("/decoration/productivity/display-data-list");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        to="/decoration/productivity/display-data-list"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to List
      </Link>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Approve Repair Request: {request.id}
        </h1>
        <p className="text-md text-gray-500 mb-6 border-b pb-4">
          Review the details below and make a decision.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Request Details
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              <InfoField label="PO / Job" value={request.poCode} />
              <InfoField label="Product Code" value={request.productCode} />
              <InfoField label="Process" value={request.process} />
              <InfoField label="Defect Type" value={request.defectType} />
              <InfoField
                label="Defect Quantity"
                value={
                  <span className="font-bold text-red-600">
                    {request.defectQty}
                  </span>
                }
              />
              <InfoField label="Creator" value={request.creator} />
              <InfoField label="Creation Date" value={request.creationDate} />
            </dl>
            <div className="col-span-2">
              <InfoField
                label="Description"
                value={request.description || "N/A"}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Attached Images
              </h3>
              <div className="flex gap-4">
                {request.images?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`defect-${index}`}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Approval Section
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decision
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setDecision("Approve")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg ${
                    decision === "Approve"
                      ? "bg-green-100 border-green-400 text-green-800"
                      : "bg-white"
                  }`}
                >
                  <Check className="w-5 h-5" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setDecision("Reject")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg ${
                    decision === "Reject"
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-white"
                  }`}
                >
                  <X className="w-5 h-5" />
                  Reject
                </button>
              </div>
            </div>
            {decision === "Approve" && (
              <div>
                <label
                  htmlFor="assignee"
                  className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Assign to
                </label>
                <select
                  id="assignee"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select a worker</option>
                  <option value="Nguyen Van A">Nguyễn Văn A</option>
                  <option value="Tran Thi B">Trần Thị B</option>
                  <option value="Le Van C">Lê Văn C</option>
                </select>
              </div>
            )}
            <div>
              <label
                htmlFor="notes"
                className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {decision === "Reject"
                  ? "Rejection Reason"
                  : "Approver's Notes"}
              </label>
              <textarea
                id="notes"
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder={
                  decision === "Reject"
                    ? "Must provide a reason for rejection..."
                    : "Optional notes for the assignee..."
                }
                required={decision === "Reject"}
              ></textarea>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!decision}
                className="px-6 py-2 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApproveRepairRequestPage;
