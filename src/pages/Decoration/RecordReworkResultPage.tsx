// src/pages/damaged-goods-repair/RecordReworkResultPage.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, FileText, Save } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Định nghĩa type ngay tại đây để file có thể chạy độc lập
export interface RepairRequest {
  id: string;
  creationDate: string;
  poCode: string;
  productCode: string;
  process: string;
  defectType: string;
  defectQty: number;
  creator: string;
  assignee?: string;
  status:
    | "Pending Approval"
    | "In Progress"
    | "Completed"
    | "Rejected"
    | "Approved";
  description?: string;
  images?: string[];
  approverNotes?: string; // Thêm field này
}

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
  // Gán cứng requestId là "RR-001" theo yêu cầu
  // Nếu muốn lấy từ URL, dùng: const { requestId } = useParams<{ requestId: string }>();
  const requestId = "RR-001";

  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [repairedQty, setRepairedQty] = useState(0);
  const [unrepairableQty, setUnrepairableQty] = useState(0);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const foundRequest = mockRequests.find((r) => r.id === requestId);
    if (foundRequest) {
      setRequest(foundRequest);
      // Khởi tạo số lượng sửa bằng tổng số lượng lỗi ban đầu
      setRepairedQty(foundRequest.defectQty);
    }
  }, [requestId]);

  useEffect(() => {
    if (request) {
      const total = repairedQty + unrepairableQty;
      if (total !== request.defectQty) {
        setValidationError(
          `Tổng số lượng (${total}) phải khớp với số lượng lỗi ban đầu (${request.defectQty}).`
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
      alert("Vui lòng sửa các lỗi trước khi gửi.");
      return;
    }
    alert(`Kết quả cho yêu cầu ${request.id} đã được ghi nhận thành công!`);
    // Dùng console.log thay vì navigate để không gây lỗi khi review
    console.log("Navigating to /decoration/productivity/display-data-list");
    // navigate("/decoration/productivity/display-data-list");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 bg-gray-50">
      <Button variant="link" asChild className="pl-0">
        <Link to="/decoration/productivity/display-data-list">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Link>
      </Button>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Record Rework Result: {request.id}
            </CardTitle>
            <CardDescription>
              Enter the final quantities after completing the rework.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <div className="space-y-2">
                  <Label
                    htmlFor="repairedQty"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Successfully Repaired Qty
                  </Label>
                  <Input
                    type="number"
                    id="repairedQty"
                    min="0"
                    max={request.defectQty}
                    value={repairedQty}
                    onChange={(e) =>
                      setRepairedQty(parseInt(e.target.value) || 0)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="unrepairableQty"
                    className="flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5 text-red-500" />
                    Unrepairable Qty (Scrap)
                  </Label>
                  <Input
                    type="number"
                    id="unrepairableQty"
                    min="0"
                    max={request.defectQty}
                    value={unrepairableQty}
                    onChange={(e) =>
                      setUnrepairableQty(parseInt(e.target.value) || 0)
                    }
                    required
                  />
                </div>
              </div>
              {validationError && (
                <p className="mt-2 text-sm text-red-600 font-semibold">
                  {validationError}
                </p>
              )}
              <div className="mt-6 space-y-2">
                <Label
                  htmlFor="workerNotes"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-5 h-5 text-gray-500" />
                  Worker's Notes
                </Label>
                <Textarea
                  id="workerNotes"
                  rows={3}
                  placeholder="Optional: Note any difficulties or suggestions..."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!!validationError}>
              <Save className="w-4 h-4 mr-2" />
              Complete & Save Result
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default RecordReworkResultPage;
