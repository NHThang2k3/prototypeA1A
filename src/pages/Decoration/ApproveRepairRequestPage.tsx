// src/pages/damaged-goods-repair/ApproveRepairRequestPage.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, X, UserPlus, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
  status: "Pending Approval" | "In Progress" | "Completed" | "Rejected";
  description?: string;
  images?: string[];
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
    images: [
      "https://via.placeholder.com/150/818CF8/FFFFFF?Text=Img+1",
      "https://via.placeholder.com/150/FBCFE8/FFFFFF?Text=Img+2",
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
    images: ["https://via.placeholder.com/150/FDBA74/FFFFFF?Text=Img+3"],
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
  // Gán cứng requestId là "RR-002" theo yêu cầu
  // Nếu muốn lấy từ URL, dùng: const { requestId } = useParams<{ requestId: string }>();
  const requestId = "RR-002";

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
    // Dùng console.log thay vì navigate để không gây lỗi khi review
    console.log("Navigating to /decoration/productivity/display-data-list");
    // navigate("/decoration/productivity/display-data-list");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 bg-gray-50">
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
              Approve Repair Request: {request.id}
            </CardTitle>
            <CardDescription>
              Review the details below and make a decision.
            </CardDescription>
          </CardHeader>
          <Separator className="mb-6" />
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-6">
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
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700">
                Approval Section
              </h2>
              <div className="space-y-2">
                <Label>Decision</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setDecision("Approve")}
                    variant={decision === "Approve" ? "default" : "outline"}
                    className="flex-1"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Approve
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setDecision("Reject")}
                    variant={decision === "Reject" ? "destructive" : "outline"}
                    className="flex-1"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
              {decision === "Approve" && (
                <div className="space-y-2">
                  <Label htmlFor="assignee" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Assign to
                  </Label>
                  <Select name="assignee" required>
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select a worker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nguyen Van A">Nguyễn Văn A</SelectItem>
                      <SelectItem value="Tran Thi B">Trần Thị B</SelectItem>
                      <SelectItem value="Le Van C">Lê Văn C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {decision === "Reject"
                    ? "Rejection Reason"
                    : "Approver's Notes"}
                </Label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder={
                    decision === "Reject"
                      ? "Must provide a reason for rejection..."
                      : "Optional notes for the assignee..."
                  }
                  required={decision === "Reject"}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-4">
            <Button type="submit" disabled={!decision}>
              Confirm Decision
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ApproveRepairRequestPage;
