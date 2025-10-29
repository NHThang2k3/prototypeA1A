import React from "react";
import RecordReworkResultPage from "../../Decoration/RecordReworkResultPage";

const RecordReworkResultPageWrapper: React.FC = () => {
  // 'RR-001' có status "In Progress", phù hợp cho việc ghi nhận kết quả.
  const mockRequestId = "RR-001";

  return <RecordReworkResultPage requestIdForShowcase={mockRequestId} />;
};

export default RecordReworkResultPageWrapper;
