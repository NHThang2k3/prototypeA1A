import React from "react";
import ApproveRepairRequestPage from "../../damaged-goods-repair/ApproveRepairRequestPage";

const ApproveRepairRequestPageWrapper: React.FC = () => {
  // Lấy một ID hợp lệ từ mock data của component gốc để hiển thị
  // 'RR-002' có status "Pending Approval", rất phù hợp cho trang này.
  const mockRequestId = "RR-002";

  return <ApproveRepairRequestPage requestIdForShowcase={mockRequestId} />;
};

export default ApproveRepairRequestPageWrapper;
