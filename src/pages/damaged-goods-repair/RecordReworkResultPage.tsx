// src/pages/damaged-goods-repair/RecordReworkResultPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, FileText, Save } from "lucide-react";
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
    approverNotes: "Sửa lại theo đúng mẫu, chú ý đường may.",
  },
  {
    id: "RR-005",
    creationDate: "2023-10-27",
    poCode: "PO-12348",
    productCode: "STY-RTY-04",
    process: "Embroidery",
    defectType: "Thêu lệch vị trí",
    defectQty: 12,
    creator: "Trần Thị B",
    status: "Approved",
    assignee: "Nguyễn Thị D",
    approverNotes: "Yêu cầu hoàn thành trước cuối ngày.",
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

const RecordReworkResultPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [repairedQty, setRepairedQty] = useState(0);
  const [unrepairableQty, setUnrepairableQty] = useState(0);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const foundRequest = mockRequests.find((r) => r.id === requestId);
    if (foundRequest) {
      setRequest(foundRequest);
      setRepairedQty(foundRequest.defectQty);
    }
  }, [requestId]);

  useEffect(() => {
    if (request) {
      const total = repairedQty + unrepairableQty;
      if (total !== request.defectQty) {
        setValidationError(
          `Total quantity (${total}) must match the initial defect quantity (${request.defectQty}).`
        );
      } else {
        setValidationError("");
      }
    }
  }, [repairedQty, unrepairableQty, request]);

  if (!request) {
    return <div>Request not found or you don't have permission.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) {
      alert("Please fix the errors before submitting.");
      return;
    }
    alert(`Result for ${request.id} recorded successfully!`);
    navigate("/decoration/productivity/display-data-list");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
          Record Rework Result: {request.id}
        </h1>
        <p className="text-md text-gray-500 mb-6 border-b pb-4">
          Enter the final quantities after completing the rework.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Initial Request Information
            </h2>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoField label="PO / Job" value={request.poCode} />
                <InfoField label="Process" value={request.process} />
                <InfoField label="Assignee" value={request.assignee} />
                <InfoField label="Defect Type" value={request.defectType} />
                <InfoField
                  label="Initial Defect Qty"
                  value={
                    <span className="font-bold text-lg text-red-600">
                      {request.defectQty}
                    </span>
                  }
                />
              </dl>
              <div className="mt-4">
                <InfoField
                  label="Approver's Notes"
                  value={
                    <span className="text-blue-700 italic">
                      {request.approverNotes || "No specific notes."}
                    </span>
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Result Entry Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="repairedQty"
                  className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Successfully Repaired Qty
                </label>
                <input
                  type="number"
                  id="repairedQty"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  min="0"
                  value={repairedQty}
                  onChange={(e) =>
                    setRepairedQty(parseInt(e.target.value) || 0)
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="unrepairableQty"
                  className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5 text-red-500" />
                  Unrepairable Qty (Scrap)
                </label>
                <input
                  type="number"
                  id="unrepairableQty"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  min="0"
                  value={unrepairableQty}
                  onChange={(e) =>
                    setUnrepairableQty(parseInt(e.target.value) || 0)
                  }
                  required
                />
              </div>
            </div>
            {validationError && (
              <p className="mt-2 text-sm text-red-600">{validationError}</p>
            )}
            <div className="mt-6">
              <label
                htmlFor="workerNotes"
                className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
              >
                <FileText className="w-5 h-5 text-gray-500" />
                Worker's Notes
              </label>
              <textarea
                id="workerNotes"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Optional: Note any difficulties or suggestions..."
              ></textarea>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-4 border-t pt-6">
          <button
            type="submit"
            disabled={!!validationError}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            <Save className="w-4 h-4" />
            Complete & Save Result
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordReworkResultPage;
