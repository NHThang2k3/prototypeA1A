// Path: src/pages/issue-fabric-form/IssueFabricFormPage.tsx

import React, { useState } from "react";
import PageHeader from "./components/PageHeader";
import FormHeader from "./components/FormHeader";
import FabricRequestTable from "./components/FabricRequestTable";
import ActionToolbar from "./components/ActionToolbar";
import type { FabricIssueFormData } from "./types";

const IssueFabricFormPage = () => {
  const [formData, setFormData] = useState<FabricIssueFormData>({
    productionOrder: "",
    requiredDate: "",
    notes: "",
    items: [],
  });

  const handleHeaderChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemsChange = (items: FabricIssueFormData["items"]) => {
    setFormData((prev) => ({ ...prev, items }));
  };

  const handleSaveDraft = () => {
    console.log("Saving Draft:", formData);
    alert("Đã lưu nháp (xem console log để biết chi tiết)!");
  };

  const handleSubmit = () => {
    // Thêm validation ở đây trước khi gửi
    if (!formData.productionOrder || formData.items.length === 0) {
      alert("Vui lòng điền Lệnh sản xuất và thêm ít nhất một loại vải.");
      return;
    }
    console.log("Submitting Form:", formData);
    alert("Đã gửi yêu cầu thành công (xem console log để biết chi tiết)!");
    // Reset form sau khi submit
    setFormData({
      productionOrder: "",
      requiredDate: "",
      notes: "",
      items: [],
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-full">
      <PageHeader />

      <div className="max-w-7xl mx-auto">
        <FormHeader
          productionOrder={formData.productionOrder}
          requiredDate={formData.requiredDate}
          notes={formData.notes}
          onFieldChange={handleHeaderChange}
        />
        <FabricRequestTable
          items={formData.items}
          onItemsChange={handleItemsChange}
        />
      </div>

      <ActionToolbar onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} />
    </div>
  );
};

export default IssueFabricFormPage;
