// Path: src/pages/issue-accessory-form/IssueAccessoryFormPage.tsx

import React, { useState } from "react";
import type { AccessoryRequestFormState, AccessoryRequestItem } from "./types";
import PageHeader from "./components/PageHeader";
import FormHeader from "./components/FormHeader";
import AccessoryRequestTable from "./components/AccessoryRequestTable";
import ActionToolbar from "./components/ActionToolbar";
import { mockBOMs, mockAccessories } from "./data";

const initialState: AccessoryRequestFormState = {
  productionOrder: "",
  requestor: "Admin", // Giả sử đã đăng nhập
  department: "Chuyền may A",
  requiredDate: new Date().toISOString().split("T")[0], // Ngày hôm nay
  notes: "",
  items: [],
};

const IssueAccessoryFormPage = () => {
  const [formData, setFormData] =
    useState<AccessoryRequestFormState>(initialState);

  const handleFieldChange = (
    field: keyof AccessoryRequestFormState,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductionOrderChange = (po: string) => {
    setFormData((prev) => {
      const bomItems = mockBOMs[po] || [];
      const newItems = bomItems.map((bomItem) => {
        const accessoryInfo = mockAccessories.find(
          (acc) => acc.sku === bomItem.sku
        );
        return {
          id: crypto.randomUUID(),
          sku: bomItem.sku,
          quantity: bomItem.quantity,
          name: accessoryInfo?.name || "N/A",
          uom: accessoryInfo?.uom || "",
          stock: accessoryInfo?.stock || 0,
        };
      });
      return { ...prev, productionOrder: po, items: newItems };
    });
  };

  const handleAddItem = () => {
    const newItem: AccessoryRequestItem = {
      id: crypto.randomUUID(),
      sku: "",
      name: "",
      uom: "",
      stock: 0,
      quantity: 0,
    };
    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleItemChange = (
    id: string,
    field: keyof AccessoryRequestItem,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleRemoveItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = () => {
    console.log("Submitting Form Data:", formData);
    // Logic: validate form, gửi API
    alert("Yêu cầu đã được gửi! (Xem chi tiết trong console)");
  };

  const handleSaveDraft = () => {
    console.log("Saving Draft:", formData);
    alert("Đã lưu nháp! (Xem chi tiết trong console)");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <PageHeader />
      <FormHeader
        formData={formData}
        handleFieldChange={handleFieldChange}
        handleProductionOrderChange={handleProductionOrderChange}
      />
      <AccessoryRequestTable
        items={formData.items}
        handleAddItem={handleAddItem}
        handleItemChange={handleItemChange}
        handleRemoveItem={handleRemoveItem}
      />
      <ActionToolbar onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} />
    </div>
  );
};

export default IssueAccessoryFormPage;
