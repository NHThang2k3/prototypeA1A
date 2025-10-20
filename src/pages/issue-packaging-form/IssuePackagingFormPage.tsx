// Path: src/pages/issue-packaging-form/IssuePackagingFormPage.tsx

import { useState } from "react";
import type { PackagingRequest, SelectedPackagingItem } from "./types";
import PageHeader from "./components/PageHeader";
import ActionToolbar from "./components/ActionToolbar";
import PackagingRequestSelection from "./components/PackagingRequestSelection";
import RequestDetails from "./components/RequestDetails";
import PackagingInventoryTable from "./components/PackagingInventoryTable";

const IssuePackagingFormPage = () => {
  const [selectedRequest, setSelectedRequest] =
    useState<PackagingRequest | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedPackagingItem[]>([]);

  const handleRequestSelect = (request: PackagingRequest) => {
    setSelectedRequest(request);
    setSelectedItems([]); // Reset danh sách bao bì đã chọn khi đổi yêu cầu
  };

  const handleClearRequest = () => {
    setSelectedRequest(null);
    setSelectedItems([]);
  };

  const handleSelectionChange = (items: SelectedPackagingItem[]) => {
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
      alert("Please select at least one packaging item to issue.");
      return;
    }
    if (totalIssuedQuantity === 0) {
      alert("Please enter the quantity to issue for the selected packaging.");
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
    alert("Packaging issued successfully! Check the console for details.");

    // Reset state
    setSelectedRequest(null);
    setSelectedItems([]);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="Issue Packaging From Request" />
      <div className="max-w-screen-2xl mx-auto">
        {!selectedRequest ? (
          <PackagingRequestSelection onRequestSelect={handleRequestSelect} />
        ) : (
          <div>
            <RequestDetails
              request={selectedRequest}
              onClearRequest={handleClearRequest}
              currentlyIssuingQuantity={totalIssuedQuantity}
            />
            <PackagingInventoryTable
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

export default IssuePackagingFormPage;