import React from "react";
import IssueFabricFromJobPage from "../../Warehouse/IssueFabricFromJobPage";

const IssueFabricFromJobPageWrapper: React.FC = () => {
  return (
    <div>
      <p className="text-red-500 mb-4">
        Note: To see the full form, please upload a Kanban file and select JOBs.
      </p>
      <IssueFabricFromJobPage />
    </div>
  );
};

export default IssueFabricFromJobPageWrapper;
