import React from "react";
import QRScanInterfacePage from "../../qr-scan/QRScanInterfacePage";

// --- START: Imports for Showcase ---
// Import các component con để render chúng một cách độc lập
import Scanner from "../../qr-scan/components/Scanner";
import InboundPutAway from "../../qr-scan/components/InboundPutAway";
import TransferItem from "../../qr-scan/components/TransferItem";
import PickingList from "../../qr-scan/components/PickingList";
import ActionFeedback from "../../qr-scan/components/ActionFeedback";

// Import dữ liệu giả để cung cấp cho các component
// import { fetchScannedData } from "../../qr-scan/data";
import type {
  ScannedItem,
  ScannedLocation,
  IssueRequest,
} from "../../qr-scan/types";
// --- END: Imports for Showcase ---

const QRScanInterfacePageWrapper: React.FC = () => {
  // --- START: Prepare Dummy Data for Showcase ---
  // Dữ liệu giả này sẽ được truyền vào các component UI tĩnh
  const dummyLocation: ScannedLocation = {
    qrCode: "LOC_QR_A_01_B",
    type: "location",
    locationCode: "A-01-B",
    description: "Kệ A, Tầng 1, Ngăn B",
  };

  const dummyPutAwayItems: ScannedItem[] = [
    {
      qrCode: "ITEM_QR_FAB_001",
      type: "item",
      sku: "FAB-BLUE-01",
      name: "Vải Cotton Xanh Navy",
      quantity: 150,
      uom: "Mét",
      currentLocation: null,
      shipmentId: "SH-2023-101",
      color: "Xanh Navy",
      length: 100,
      weight: 25.5,
    },
    {
      qrCode: "ITEM_QR_FAB_004",
      type: "item",
      sku: "FAB-DENIM-04",
      name: "Vải Denim Xanh Đậm",
      quantity: 250,
      uom: "Mét",
      currentLocation: null,
      shipmentId: "SH-2023-103",
      color: "Xanh Đậm",
      length: 150,
      weight: 50,
    },
  ];

  const dummyTransferItem: ScannedItem = {
    qrCode: "ITEM_QR_FAB_002",
    type: "item",
    sku: "FAB-RED-02",
    name: "Vải Kate Đỏ",
    quantity: 120.5,
    uom: "Mét",
    currentLocation: "A-01-B",
    shipmentId: "SH-2023-101",
    color: "Đỏ",
    length: 80,
    weight: 22,
  };

  const dummyIssueRequest: IssueRequest = {
    qrCode: "ISSUE_REQ_001",
    type: "issue_request",
    id: "PXK-2023-088",
    destination: "Bộ phận Cắt",
    status: "in_progress",
    pickingList: [
      {
        sku: "FAB-RED-02",
        name: "Vải Kate Đỏ",
        uom: "Mét",
        requiredQuantity: 200,
        pickedQuantity: 80,
        locations: ["A-01-B", "A-01-C"],
      },
      {
        sku: "FAB-SILK-03",
        name: "Vải Lụa Trắng",
        uom: "Mét",
        requiredQuantity: 88,
        pickedQuantity: 0,
        locations: ["B-02-C"],
      },
    ],
  };

  const dummyCompletedIssueRequest: IssueRequest = {
    ...dummyIssueRequest,
    pickingList: dummyIssueRequest.pickingList.map((item) => ({
      ...item,
      pickedQuantity: item.requiredQuantity,
    })),
  };
  // --- END: Prepare Dummy Data ---

  return (
    <div className="flex flex-col space-y-8">
      {/* 1. Render trang quét QR tương tác như bình thường */}
      <div>
        <h3 className="text-xl font-bold text-center text-gray-600 mb-4">
          --- Interactive Component ---
        </h3>
        <div className="border p-4 rounded-lg bg-white shadow-inner">
          <QRScanInterfacePage />
        </div>
      </div>

      {/* 2. Render các trạng thái UI tĩnh để review */}
      <div className="border-t-2 border-dashed border-gray-300 pt-8">
        <h3 className="text-xl font-bold text-center text-gray-600 mb-6">
          --- UI States Showcase ---
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* State: Awaiting First Scan */}
          <div className="border p-4 rounded-lg bg-white">
            <h4 className="font-bold text-center mb-2">
              State: Awaiting First Scan
            </h4>
            <Scanner
              onScan={() => {}}
              scanPrompt="Please scan a QR code to begin..."
              context="INITIAL"
            />
          </div>

          {/* State: Put Away (Scanning Items) */}
          <div className="border p-4 rounded-lg bg-white">
            <h4 className="font-bold text-center mb-2">
              State: Put Away (Scanning Items)
            </h4>
            <InboundPutAway
              location={dummyLocation}
              scannedItems={dummyPutAwayItems}
              onScanItem={() => {}}
              onSubmit={() => {}}
              onCancel={() => {}}
            />
          </div>

          {/* State: Transfer Item */}
          <div className="border p-4 rounded-lg bg-white">
            <h4 className="font-bold text-center mb-2">State: Transfer Item</h4>
            <TransferItem
              item={dummyTransferItem}
              onScanLocation={() => {}}
              onCancel={() => {}}
            />
          </div>

          {/* State: Issue (Reviewing Picking List) */}
          <div className="border p-4 rounded-lg bg-white">
            <h4 className="font-bold text-center mb-2">
              State: Issue (Reviewing Picking List)
            </h4>
            <PickingList
              request={dummyIssueRequest}
              onStartScanning={() => {}}
              onBack={() => {}}
            />
            <h4 className="font-bold text-center mb-2 mt-4">
              State: Issue (Completed)
            </h4>
            <PickingList
              request={dummyCompletedIssueRequest}
              onStartScanning={() => {}}
              onBack={() => {}}
            />
          </div>

          {/* State: Action Feedback (All variations) */}
          <div className="border p-4 rounded-lg bg-white md:col-span-2">
            <h4 className="font-bold text-center mb-2">
              State: Action Feedback
            </h4>
            <div className="space-y-4 divide-y">
              {/* Processing */}
              <ActionFeedback
                status="PROCESSING"
                message="Updating location for the fabric rolls..."
                onClose={() => {}}
              />
              {/* Error */}
              <ActionFeedback
                status="ERROR"
                message="QR code is not valid or does not exist."
                onClose={() => {}}
              />
              {/* Simple Success */}
              <ActionFeedback
                status="SUCCESS"
                message="Successfully transferred item to new location."
                onClose={() => {}}
              />
              {/* Detailed Success (Put Away) */}
              <ActionFeedback
                status="SUCCESS"
                message={`Successfully put away ${dummyPutAwayItems.length} fabric rolls.`}
                onClose={() => {}}
                details={{
                  type: "PUT_AWAY_SUCCESS",
                  items: dummyPutAwayItems,
                  location: dummyLocation,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanInterfacePageWrapper;
