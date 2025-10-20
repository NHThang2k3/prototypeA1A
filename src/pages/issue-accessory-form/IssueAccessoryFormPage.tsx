// Path: src/pages/issue-accessory-form/IssueAccessoryFormPage.tsx

import { useState } from "react";
import type { AccessoryRequest, SelectedAccessoryItem } from "./types";
import PageHeader from "./components/PageHeader";
import ActionToolbar from "./components/ActionToolbar";
import AccessoryRequestSelection from "./components/AccessoryRequestSelection";
import RequestDetails from "./components/RequestDetails";
import AccessoryInventoryTable from "./components/AccessoryInventoryTable";

const IssueAccessoryFormPage = () => {
  const [selectedRequest, setSelectedRequest] =
    useState<AccessoryRequest | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedAccessoryItem[]>(
    []
  );

  const handleRequestSelect = (request: AccessoryRequest) => {
    setSelectedRequest(request);
    setSelectedItems([]); // Reset danh sách phụ liệu đã chọn khi đổi yêu cầu
  };

  const handleClearRequest = () => {
    setSelectedRequest(null);
    setSelectedItems([]);
  };

  const handleSelectionChange = (items: SelectedAccessoryItem[]) => {
    setSelectedItems(items);
  };

  // Tính tổng số lượng đang được chọn để xuất
  const totalIssuedQuantity = selectedItems.reduce(
    (sum, item) => sum + item.issuedQuantity,
    0
  );

  const handleSubmit = () => {
    if (!selectedRequest) {
      alert("Please select a request first.");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please select at least one accessory to issue.");
      return;
    }
    if (totalIssuedQuantity === 0) {
      alert("Please enter the quantity to issue for the selected accessories.");
      return;
    }

    const submissionData = {
      requestId: selectedRequest.ID,
      job: selectedRequest.JOB,
      style: selectedRequest.Style,
      issuedItems: selectedItems.map((item) => ({
        QRCode: item.QRCode,
        ItemNumber: item.ItemNumber,
        MaterialName: item.MaterialName,
        issuedQuantity: item.issuedQuantity,
        Unit: item.Unit,
      })),
      totalIssuedQuantity: totalIssuedQuantity.toFixed(2),
    };

    console.log("Submitting Data:", submissionData);
    alert("Accessory issued successfully! Check the console for details.");

    // Reset state
    setSelectedRequest(null);
    setSelectedItems([]);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="Issue Accessory From Request" />
      <div className="max-w-screen-2xl mx-auto">
        {!selectedRequest ? (
          <AccessoryRequestSelection onRequestSelect={handleRequestSelect} />
        ) : (
          <div>
            <RequestDetails
              request={selectedRequest}
              onClearRequest={handleClearRequest}
              currentlyIssuingQuantity={totalIssuedQuantity}
            />
            <AccessoryInventoryTable
              bomId={selectedRequest.BOMID}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        )}
      </div>
      <ActionToolbar onSubmit={handleSubmit} />
    </div>
  );
};

export default IssueAccessoryFormPage;
