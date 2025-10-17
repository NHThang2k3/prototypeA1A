// Path: src/pages/qr-scan/QRScanInterfacePage.tsx

import React, { useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Package } from "lucide-react";
import type {
  OperationMode,
  InboundScanState,
  OutboundScanState,
  TransferScanState,
  ItemCategory,
  ScannedItem,
  ScannedLocation,
  IssueRequest,
} from "./types";
import {
  fetchScannedData,
  submitPutAwayAction,
  submitIssueAction,
  submitTransferAction,
} from "./data";
import Scanner from "./components/Scanner";
import ActionFeedback from "./components/ActionFeedback";
import ModeSelector from "./components/ModeSelector";
import PickingList from "./components/PickingList";
import InboundPutAway from "./components/InboundPutAway";
import CategorySelector from "./components/CategorySelector";

const QRScanInterfacePage: React.FC = () => {
  // State chung
  const [mode, setMode] = useState<OperationMode | "SELECT">("SELECT");
  type FeedbackStatus = "HIDDEN" | "PROCESSING" | "SUCCESS" | "ERROR";
  const [feedback, setFeedback] = useState<{
    status: FeedbackStatus;
    message: string;
  }>({ status: "HIDDEN", message: "" });

  // State cho luồng Nhập Kho (Inbound)
  const [inboundState, setInboundState] =
    useState<InboundScanState>("SCANNING_LOCATION");
  const [scannedInboundLocation, setScannedInboundLocation] =
    useState<ScannedLocation | null>(null);
  const [scannedItemsForPutAway, setScannedItemsForPutAway] = useState<
    ScannedItem[]
  >([]);

  // State cho luồng Xuất Kho (Outbound)
  const [outboundState, setOutboundState] =
    useState<OutboundScanState>("SELECTING_CATEGORY");
  const [issueRequest, setIssueRequest] = useState<IssueRequest | null>(null);
  const [itemCategory, setItemCategory] = useState<ItemCategory | null>(null);

  // State cho luồng Chuyển Kho (Transfer)
  const [transferState, setTransferState] = useState<TransferScanState>(
    "SCANNING_ITEM_TO_MOVE"
  );
  const [itemToMove, setItemToMove] = useState<ScannedItem | null>(null);

  const resetAllStates = useCallback(() => {
    setMode("SELECT");
    setFeedback({ status: "HIDDEN", message: "" });
    // Reset Inbound
    setInboundState("SCANNING_LOCATION");
    setScannedInboundLocation(null);
    setScannedItemsForPutAway([]);
    // Reset Outbound
    setOutboundState("SELECTING_CATEGORY");
    setIssueRequest(null);
    setItemCategory(null);
    // Reset Transfer
    setTransferState("SCANNING_ITEM_TO_MOVE");
    setItemToMove(null);
  }, []);

  const handleError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";
    toast.error(errorMessage);
    setFeedback({ status: "ERROR", message: errorMessage });
  };

  const handleModeSelect = (selectedMode: OperationMode) => {
    setMode(selectedMode);
    if (selectedMode === "OUTBOUND") {
      setOutboundState("SELECTING_CATEGORY");
    }
  };

  const handleCategorySelect = (category: ItemCategory) => {
    setItemCategory(category);
    setOutboundState("SCANNING_REQUEST");
  };

  const getCategoryName = (category: ItemCategory | null): string => {
    if (!category) return "";
    switch (category) {
      case "FABRIC":
        return "VẢI";
      case "ACCESSORY":
        return "PHỤ LIỆU";
      case "PACKAGING":
        return "ĐÓNG GÓI";
      default:
        return "";
    }
  };

  // --- LOGIC NHẬP KHO (INBOUND) ---
  const handleInboundScan = async (qrCode: string) => {
    try {
      const data = await fetchScannedData(qrCode);
      if (inboundState === "SCANNING_LOCATION") {
        if (data.type === "location") {
          setScannedInboundLocation(data as ScannedLocation);
          setInboundState("AWAITING_ITEMS");
          toast.success(`Đã chọn vị trí: ${data.locationCode}`);
        } else {
          toast.error("Vui lòng quét mã VỊ TRÍ KHO trước.");
        }
      } else if (inboundState === "AWAITING_ITEMS") {
        if (data.type === "item") {
          if (
            scannedItemsForPutAway.some((item) => item.qrCode === data.qrCode)
          ) {
            toast.error("Vật tư này đã được quét rồi.");
            return;
          }
          if ((data as ScannedItem).currentLocation) {
            toast.error(
              `Cảnh báo: Vật tư này đã có vị trí (${
                (data as ScannedItem).currentLocation
              }). Dùng chức năng Chuyển Kho.`
            );
            return;
          }
          setScannedItemsForPutAway((prev) => [...prev, data as ScannedItem]);
          toast.success(`Đã quét vật tư: ${data.sku}`);
        } else {
          toast.error("Vui lòng quét mã VẬT TƯ (cuộn vải, thùng hàng...).");
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handlePutAwaySubmit = async () => {
    if (!scannedInboundLocation || scannedItemsForPutAway.length === 0) {
      toast.error("Chưa có vật tư nào để cất vào kho.");
      return;
    }
    setInboundState("PROCESSING");
    setFeedback({ status: "PROCESSING", message: "Đang cập nhật vị trí..." });
    try {
      const result = await submitPutAwayAction(
        scannedItemsForPutAway,
        scannedInboundLocation
      );
      setFeedback({
        status: result.success ? "SUCCESS" : "ERROR",
        message: result.message,
      });
    } catch (error) {
      handleError(error);
    }
  };

  // --- LOGIC XUẤT KHO (OUTBOUND) ---
  const handleOutboundScan = async (qrCode: string) => {
    try {
      const data = await fetchScannedData(qrCode);
      if (outboundState === "SCANNING_REQUEST") {
        if (data.type === "issue_request") {
          setIssueRequest(data as IssueRequest);
          setOutboundState("REQUEST_LOADED");
          toast.success(`Đã tải phiếu yêu cầu: ${data.id}`);
        } else {
          toast.error(
            `Vui lòng quét mã PHIẾU YÊU CẦU ${getCategoryName(itemCategory)}.`
          );
        }
      } else if (outboundState === "SCANNING_ITEM_FOR_ISSUE" && issueRequest) {
        if (data.type === "item") {
          const itemInPickingList = issueRequest.pickingList.find(
            (p) => p.sku === data.sku
          );
          if (!itemInPickingList) {
            toast.error(`Vật tư ${data.sku} không có trong phiếu yêu cầu này!`);
            return;
          }
          if (
            itemInPickingList.pickedQuantity >=
            itemInPickingList.requiredQuantity
          ) {
            toast.error(`Đã lấy đủ số lượng cho mã hàng ${data.sku}.`);
            return;
          }
          await handleIssueSubmit(data as ScannedItem);
        } else {
          toast.error("Vui lòng quét mã VẬT TƯ.");
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleIssueSubmit = async (scannedItem: ScannedItem) => {
    if (!issueRequest) return;
    setOutboundState("PROCESSING_ISSUE");
    setFeedback({
      status: "PROCESSING",
      message: `Đang xuất kho ${scannedItem.name}...`,
    });
    try {
      const result = await submitIssueAction(
        issueRequest,
        scannedItem,
        scannedItem.quantity
      );
      setIssueRequest(result.updatedRequest);
      setFeedback({ status: "SUCCESS", message: result.message });
    } catch (error) {
      handleError(error);
    }
  };

  // --- LOGIC CHUYỂN KHO (TRANSFER) ---
  const handleTransferScan = async (qrCode: string) => {
    try {
      const data = await fetchScannedData(qrCode);
      if (transferState === "SCANNING_ITEM_TO_MOVE") {
        if (data.type === "item") {
          if (!data.currentLocation) {
            toast.error(
              "Vật tư này chưa có vị trí. Vui lòng dùng chức năng Nhập Kho."
            );
            return;
          }
          setItemToMove(data as ScannedItem);
          setTransferState("SCANNING_NEW_LOCATION");
          toast.success(
            `Đã chọn vật tư: ${data.name}. Giờ hãy quét vị trí mới.`
          );
        } else {
          toast.error("Vui lòng quét mã VẬT TƯ cần chuyển.");
        }
      } else if (transferState === "SCANNING_NEW_LOCATION" && itemToMove) {
        if (data.type === "location") {
          if (data.locationCode === itemToMove.currentLocation) {
            toast.error("Vị trí mới không được trùng với vị trí cũ.");
            return;
          }
          await handleTransferSubmit(itemToMove, data as ScannedLocation);
        } else {
          toast.error("Vui lòng quét mã VỊ TRÍ KHO mới.");
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleTransferSubmit = async (
    item: ScannedItem,
    newLocation: ScannedLocation
  ) => {
    setTransferState("PROCESSING");
    setFeedback({
      status: "PROCESSING",
      message: `Đang chuyển ${item.name} đến ${newLocation.locationCode}...`,
    });
    try {
      const result = await submitTransferAction(item, newLocation);
      setFeedback({ status: "SUCCESS", message: result.message });
    } catch (error) {
      handleError(error);
    }
  };

  const renderFeedback = () => (
    <ActionFeedback
      status={feedback.status as "PROCESSING" | "SUCCESS" | "ERROR"}
      message={feedback.message}
      onClose={() => {
        if (mode === "INBOUND") {
          setInboundState("SCANNING_LOCATION");
          setScannedInboundLocation(null);
          setScannedItemsForPutAway([]);
        }
        if (mode === "OUTBOUND") {
          setOutboundState("REQUEST_LOADED");
        }
        if (mode === "TRANSFER") {
          setTransferState("SCANNING_ITEM_TO_MOVE");
          setItemToMove(null);
        }
        setFeedback({ status: "HIDDEN", message: "" });
      }}
    />
  );

  const renderContent = () => {
    if (feedback.status !== "HIDDEN") return renderFeedback();
    if (mode === "SELECT")
      return <ModeSelector onSelectMode={handleModeSelect} />;

    // --- RENDER LUỒNG NHẬP KHO ---
    if (mode === "INBOUND") {
      switch (inboundState) {
        case "SCANNING_LOCATION":
          return (
            <Scanner
              onScan={handleInboundScan}
              scanPrompt="NHẬP KHO: Quét mã VỊ TRÍ KHO"
              mode={mode}
            />
          );
        case "AWAITING_ITEMS":
          return (
            scannedInboundLocation && (
              <InboundPutAway
                location={scannedInboundLocation}
                scannedItems={scannedItemsForPutAway}
                onScanItem={handleInboundScan}
                onSubmit={handlePutAwaySubmit}
                onCancel={() => {
                  setInboundState("SCANNING_LOCATION");
                  setScannedInboundLocation(null);
                  setScannedItemsForPutAway([]);
                }}
              />
            )
          );
        default:
          return null;
      }
    }

    // --- RENDER LUỒNG XUẤT KHO ---
    if (mode === "OUTBOUND") {
      switch (outboundState) {
        case "SELECTING_CATEGORY":
          return (
            <CategorySelector
              onSelectCategory={handleCategorySelect}
              onBack={() => setMode("SELECT")}
            />
          );
        case "SCANNING_REQUEST":
          return (
            <Scanner
              onScan={handleOutboundScan}
              scanPrompt={`XUẤT ${getCategoryName(
                itemCategory
              )}: Quét mã PHIẾU YÊU CẦU`}
              mode={mode}
            />
          );
        case "REQUEST_LOADED":
          return (
            issueRequest && (
              <PickingList
                request={issueRequest}
                onStartScanning={() =>
                  setOutboundState("SCANNING_ITEM_FOR_ISSUE")
                }
                onBack={() => {
                  setOutboundState("SELECTING_CATEGORY");
                  setIssueRequest(null);
                  setItemCategory(null);
                }}
              />
            )
          );
        case "SCANNING_ITEM_FOR_ISSUE":
          return (
            <Scanner
              onScan={handleOutboundScan}
              scanPrompt={`Phiếu ${issueRequest?.id}: Quét ${getCategoryName(
                itemCategory
              )} cần lấy`}
              mode={mode}
            />
          );
        default:
          return null;
      }
    }

    // --- RENDER LUỒNG CHUYỂN KHO ---
    if (mode === "TRANSFER") {
      switch (transferState) {
        case "SCANNING_ITEM_TO_MOVE":
          return (
            <Scanner
              onScan={handleTransferScan}
              scanPrompt="CHUYỂN KHO: Quét VẬT TƯ cần chuyển"
              mode={mode}
            />
          );
        case "SCANNING_NEW_LOCATION":
          return (
            <div className="text-center">
              <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg mb-4 max-w-md mx-auto">
                <p className="font-semibold">Đang chuyển vật tư:</p>
                <div className="font-mono text-blue-800 text-lg flex items-center justify-center gap-2 mt-1">
                  <Package size={20} /> {itemToMove?.name}
                </div>
                <p className="text-sm">
                  Từ vị trí:{" "}
                  <span className="font-mono">
                    {itemToMove?.currentLocation}
                  </span>
                </p>
              </div>
              <Scanner
                onScan={handleTransferScan}
                scanPrompt="Quét VỊ TRÍ KHO mới"
                mode={mode}
              />
            </div>
          );
        default:
          return null;
      }
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto">
        {mode !== "SELECT" && (
          <button
            onClick={resetAllStates}
            className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Chọn lại tác vụ
          </button>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default QRScanInterfacePage;
