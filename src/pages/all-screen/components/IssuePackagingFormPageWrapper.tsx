import React from "react";
import IssuePackagingFormPage from "../../Warehouse/IssuePackagingFormPage";

const IssuePackagingFormPageWrapper: React.FC = () => {
  return (
    <div>
      <p className="text-red-500 mb-4">
        Note: To see the full form, please select a packaging request from the
        dropdown.
      </p>
      <IssuePackagingFormPage />
    </div>
  );
};

export default IssuePackagingFormPageWrapper;
