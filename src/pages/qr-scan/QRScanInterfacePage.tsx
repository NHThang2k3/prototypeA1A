// Path: src/pages/qr-scan/QRScanInterfacePage.tsx

import React, { useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import type {
  ScannedItem,
  ScannedLocation,
  IssueRequest,
  ScannedData,
} from "./types";
import {
  fetchScannedData,
  submitPutAwayAction,
  submitIssueAction,
  submitTransferAction,
} from "./data";
import Scanner from "./components/Scanner";
import ActionFeedback from "./components/ActionFeedback";
import PickingList from "./components/PickingList";
import InboundPutAway from "./components/InboundPutAway";
import TransferItem from "./components/TransferItem";

// NEW: Thêm trường `details` vào trạng thái FEEDBACK
type OperationState =
  | { name: "AWAITING_FIRST_SCAN" }
  | { name: "PUT_AWAY"; location: ScannedLocation; items: ScannedItem[] }
  | { name: "TRANSFER"; item: ScannedItem }
  | { name: "ISSUE"; request: IssueRequest }
  | { name: "ISSUE_SCANNING_ITEM"; request: IssueRequest }
  | { name: "PROCESSING"; message: string }
  | {
      name: "FEEDBACK";
      status: "SUCCESS" | "ERROR";
      message: string;
      details?: {
        type: "PUT_AWAY_SUCCESS";
        items: ScannedItem[];
        location: ScannedLocation;
      };
    };

// NEW: Helper function để kiểm tra phiếu xuất đã hoàn thành chưa
const isRequestCompleted = (request: IssueRequest): boolean => {
  return request.pickingList.every(
    (item) => item.pickedQuantity >= item.requiredQuantity
  );
};

const QRScanInterfacePage: React.FC = () => {
  const [operation, setOperation] = useState<OperationState>({
    name: "AWAITING_FIRST_SCAN",
  });

  // ... (resetAllStates, handleError, handleScan, handleFirstScan, handlePutAwayItemScan không đổi)

  const resetAllStates = useCallback(() => {
    setOperation({ name: "AWAITING_FIRST_SCAN" });
  }, []);

  const handleError = (error: unknown, prefix?: string) => {
    const errorMessage = (error as Error).message;
    toast.error(prefix ? `${prefix}: ${errorMessage}` : errorMessage);
    setOperation({
      name: "FEEDBACK",
      status: "ERROR",
      message: errorMessage,
    });
  };

  const handleScan = async (qrCode: string) => {
    try {
      const data = await fetchScannedData(qrCode);
      switch (operation.name) {
        case "AWAITING_FIRST_SCAN":
          handleFirstScan(data);
          break;
        case "PUT_AWAY":
          handlePutAwayItemScan(data);
          break;
        case "TRANSFER":
          handleTransferLocationScan(data);
          break;
        case "ISSUE_SCANNING_ITEM":
          handleIssueAndSubmitScan(data);
          break;
      }
    } catch (error) {
      handleError(error, "Lỗi quét mã");
    }
  };

  const handleFirstScan = (data: ScannedData) => {
    if (data.type === "location") {
      setOperation({
        name: "PUT_AWAY",
        location: data as ScannedLocation,
        items: [],
      });
      toast.success(`Starting PUT AWAY task for location: ${data.locationCode}`);
    } else if (data.type === "item") {
      const item = data as ScannedItem;
      if (!item.currentLocation) {
        toast.error(
          "This fabric roll has no location, cannot TRANSFER. Please Put Away first."
        );
        return;
      }
      setOperation({ name: "TRANSFER", item: data as ScannedItem });
      toast.success(`Starting TRANSFER task for fabric roll: ${data.sku}`);
    } else if (data.type === "issue_request") {
      setOperation({ name: "ISSUE", request: data as IssueRequest });
      toast.success(`Starting ISSUE task for request: ${data.id}`);
    } else {
      toast.error("QR code is not suitable for starting a task.");
    }
  };

  const handlePutAwayItemScan = (data: ScannedData) => {
    if (operation.name !== "PUT_AWAY") return;
        if (data.type === "item") {
          if (operation.items.some((item) => item.qrCode === data.qrCode)) {
            toast.error("This fabric roll has already been scanned.");
            return;
          }
          if ((data as ScannedItem).currentLocation) {
            toast.error(
              `Warning: This fabric roll already has a location (${(data as ScannedItem).currentLocation
              }).`
            );
          }
          setOperation({
            ...operation,
            items: [...operation.items, data as ScannedItem],
          });
          toast.success(`Added fabric roll: ${data.sku}`);
        } else {
          toast.error("Please scan a FABRIC QR code (fabric roll).");
        }
      };

  // UPDATED: handlePutAwaySubmit để truyền dữ liệu chi tiết
  const handlePutAwaySubmit = async () => {
    if (operation.name !== "PUT_AWAY" || operation.items.length === 0) return;
    const { items, location } = operation;
    setOperation({
      name: "PROCESSING",
      message: "Updating location for the fabric rolls...",
    });
    try {
      const result = await submitPutAwayAction(items, location);
      setOperation({
        name: "FEEDBACK",
        status: result.success ? "SUCCESS" : "ERROR",
        message: result.message,
        details: {
          // Truyền dữ liệu chi tiết vào đây
          type: "PUT_AWAY_SUCCESS",
          items: items,
          location: location,
        },
      });
    } catch (error) {
      handleError(error);
    }
  };

  // ... (handleTransferLocationScan không đổi)
  const handleTransferLocationScan = async (data: ScannedData) => {
    if (operation.name !== "TRANSFER") return;
    if (data.type === "location") {
      setOperation({
        name: "PROCESSING",
        message: "Performing location transfer...",
      });
      try {
        const result = await submitTransferAction(
          operation.item,
          data as ScannedLocation
        );
        setOperation({
          name: "FEEDBACK",
          status: result.success ? "SUCCESS" : "ERROR",
          message: result.message,
        });
      } catch (error) {
        handleError(error);
      }
    } else {
      toast.error("Please scan the NEW WAREHOUSE LOCATION QR code.");
    }
  };

  // UPDATED: handleIssueAndSubmitScan để kiểm tra hoàn thành
  const handleIssueAndSubmitScan = async (data: ScannedData) => {
    if (operation.name !== "ISSUE_SCANNING_ITEM") return;
    const { request } = operation;

        if (data.type !== "item") {

          toast.error("Please scan a FABRIC QR code.");

          return;

        }

    

        const scannedItem = data as ScannedItem;

        const itemInPickingList = request.pickingList.find(

          (p) => p.sku === scannedItem.sku

        );

    

        if (!itemInPickingList) {

          toast.error(`Fabric ${scannedItem.sku} is not in this request!`);

          return;

        }

        const remainingNeeded = 

          itemInPickingList.requiredQuantity - itemInPickingList.pickedQuantity;

        if (remainingNeeded <= 0) {

          toast.error(`Sufficient quantity already picked for fabric ${scannedItem.sku}.`);

          return;

        }

        const quantityToIssue = Math.min(scannedItem.quantity, remainingNeeded);

        if (quantityToIssue <= 0) {

          toast.error(`Cannot take more fabric from this roll.`);

          return;

        }

    

        setOperation({

          name: "PROCESSING",

          message: `Recording issue of ${quantityToIssue} ${scannedItem.uom}...`,

        });

        try {

          const result = await submitIssueAction(

            request,

            scannedItem,

            quantityToIssue

          );

    

          // Check if the request is completed after the update

          if (isRequestCompleted(result.updatedRequest)) {

            // If completed, show the final feedback screen

            setOperation({

              name: "FEEDBACK",

              status: "SUCCESS",

              message: `Picking completed for request ${result.updatedRequest.id}! `,

            });

          } else {

            // Otherwise, return to the scanning screen to continue

            setOperation({

              name: "ISSUE_SCANNING_ITEM",

              request: result.updatedRequest,

            });

            toast.success(result.message);

          }

        } catch (error) {

          handleError(error);

        }

      };

  // UPDATED: renderContent để truyền `details`
  const renderContent = () => {
    switch (operation.name) {
      // ... (các case khác giữ nguyên)
      case "AWAITING_FIRST_SCAN":
        return (
          <Scanner
            onScan={handleScan}
            scanPrompt="Please scan a QR code to begin (Location, Fabric Roll, or Issue Request)"
            context="INITIAL"
          />
        );
      case "PUT_AWAY":
        return (
          <InboundPutAway
            location={operation.location}
            scannedItems={operation.items}
            onScanItem={handleScan}
            onSubmit={handlePutAwaySubmit}
            onCancel={resetAllStates}
          />
        );
      case "TRANSFER":
        return (
          <TransferItem
            item={operation.item}
            onScanLocation={handleScan}
            onCancel={resetAllStates}
          />
        );
      case "ISSUE":
        return (
          <PickingList
            request={operation.request}
            onStartScanning={() =>
              setOperation({ ...operation, name: "ISSUE_SCANNING_ITEM" })
            }
            onBack={resetAllStates}
          />
        );
      case "ISSUE_SCANNING_ITEM":
        return (
          <Scanner
            onScan={handleScan}
            scanPrompt={`Request ${operation.request.id}: Scan FABRIC QR code to pick`}
            context="ISSUE_ITEM"
          />
        );

      case "PROCESSING":
      case "FEEDBACK":
        return (
          <ActionFeedback
            status={
              operation.name === "PROCESSING" ? "PROCESSING" : operation.status
            }
            message={operation.message}
            onClose={resetAllStates}
            details={
              operation.name === "FEEDBACK" ? operation.details : undefined
            }
          />
        );
      default:
        return <div>Unknown state</div>;
    }
  };

  // ... (phần return JSX không đổi)
  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto">
        {operation.name !== "AWAITING_FIRST_SCAN" &&
          operation.name !== "ISSUE_SCANNING_ITEM" && (
            <button
              onClick={resetAllStates}
              className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={16} className="mr-1" />
              Start Over
            </button>
          )}
        {operation.name === "ISSUE_SCANNING_ITEM" && (
          <button
            onClick={() =>
              setOperation({ name: "ISSUE", request: operation.request })
            }
            className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Review Request
          </button>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default QRScanInterfacePage;
