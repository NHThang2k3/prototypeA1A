import React from "react";
import IssueAccessoryFormPage from "../../issue-accessory-form/IssueAccessoryFormPage";

const IssueAccessoryFormPageWrapper: React.FC = () => {
  return (
    <div>
      <p className="text-red-500 mb-4">Note: To see the full form, please select an accessory request from the dropdown.</p>
      <IssueAccessoryFormPage />
    </div>
  );
};

export default IssueAccessoryFormPageWrapper;
