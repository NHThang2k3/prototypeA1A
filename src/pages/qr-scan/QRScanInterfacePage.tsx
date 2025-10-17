// Path: src/pages/qr-scan/QRScanInterfacePage.tsx

import React, { useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import type {
  OperationMode,
  InboundScanState,
  OutboundScanState,
  ScannedItem,
  ScannedLocation,
  IssueRequest,
  PickingListItem,
} from "./types";
import {
  fetchScannedData,
  submitPutAwayAction,
  submitIssueAction,
} from "./data";
import Scanner from "./components/Scanner";
// REMOVED: ScanResult không còn dùng cho Inbound
import ActionFeedback from "./components/ActionFeedback";
import ModeSelector from "./components/ModeSelector";
import PickingList from "./components/PickingList";
import IssueQuantityInput from "./components/IssueQuantityInput";
// NEW: Import component mới
import InboundPutAway from "./components/InboundPutAway";

const QRScanInterfacePage: React.FC = () => {
  // State chung
  const [mode, setMode] = useState<OperationMode | "SELECT">("SELECT");
  const [feedback, setFeedback] = useState({ status: "HIDDEN", message: "" });

  // State cho luồng Nhập Kho (Inbound) - Cập nhật lại
  const [inboundState, setInboundState] =
    useState<InboundScanState>("SCANNING_LOCATION");
  const [scannedInboundLocation, setScannedInboundLocation] =
    useState<ScannedLocation | null>(null);
  const [scannedItemsForPutAway, setScannedItemsForPutAway] = useState<
    ScannedItem[]
  >([]);

  // State cho luồng Xuất Kho (Outbound)
  const [outboundState, setOutboundState] =
    useState<OutboundScanState>("SCANNING_REQUEST");
  const [issueRequest, setIssueRequest] = useState<IssueRequest | null>(null);
  const [scannedOutboundItem, setScannedOutboundItem] =
    useState<ScannedItem | null>(null);
  const [currentItemPickingInfo, setCurrentItemPickingInfo] =
    useState<PickingListItem | null>(null);

  const resetInboundState = useCallback(() => {
    setInboundState("SCANNING_LOCATION");
    setScannedInboundLocation(null);
    setScannedItemsForPutAway([]);
  }, []);

  const resetAllStates = useCallback(() => {
    setMode("SELECT");
    setFeedback({ status: "HIDDEN", message: "" });
    // Reset Inbound
    resetInboundState();
    // Reset Outbound
    setOutboundState("SCANNING_REQUEST");
    setIssueRequest(null);
    setScannedOutboundItem(null);
    setCurrentItemPickingInfo(null);
  }, [resetInboundState]);

  const handleError = (error: unknown) => {
    const errorMessage = (error as Error).message;
    toast.error(errorMessage);
    setFeedback({ status: "ERROR", message: errorMessage });
  };

  // --- LOGIC CHO LUỒNG NHẬP KHO (INBOUND) - VIẾT LẠI HOÀN TOÀN ---
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
          // Kiểm tra xem item đã được quét chưa
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
              }).`
            );
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
    setFeedback({
      status: "PROCESSING",
      message: "Đang cập nhật vị trí cho các vật tư...",
    });
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

  // --- LOGIC CHO LUỒNG XUẤT KHO (OUTBOUND) - Không thay đổi ---
  const handleOutboundScan = async (qrCode: string) => {
    try {
      const data = await fetchScannedData(qrCode);
      if (outboundState === "SCANNING_REQUEST") {
        if (data.type === "issue_request") {
          setIssueRequest(data as IssueRequest);
          setOutboundState("REQUEST_LOADED");
          toast.success(`Đã tải phiếu yêu cầu: ${data.id}`);
        } else {
          toast.error("Vui lòng quét mã PHIẾU YÊU CẦU.");
        }
      } else if (outboundState === "SCANNING_ITEM_FOR_ISSUE") {
        if (data.type === "item" && issueRequest) {
          const itemInPickingList = issueRequest.pickingList.find(
            (p) => p.sku === data.sku
          );
          if (itemInPickingList) {
            if (
              itemInPickingList.pickedQuantity >=
              itemInPickingList.requiredQuantity
            ) {
              toast.error(`Đã lấy đủ số lượng cho mã hàng ${data.sku}.`);
              return;
            }
            setScannedOutboundItem(data as ScannedItem);
            setCurrentItemPickingInfo(itemInPickingList);
            setOutboundState("AWAITING_QUANTITY");
          } else {
            toast.error(`Vật tư ${data.sku} không có trong phiếu yêu cầu này!`);
          }
        } else {
          toast.error("Vui lòng quét mã VẬT TƯ.");
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleIssueSubmit = async (quantity: number) => {
    if (!issueRequest || !scannedOutboundItem) return;
    setOutboundState("PROCESSING_ISSUE");
    setFeedback({ status: "PROCESSING", message: "Đang ghi nhận xuất kho..." });
    try {
      const result = await submitIssueAction(
        issueRequest,
        scannedOutboundItem,
        quantity
      );
      setIssueRequest(result.updatedRequest); // Cập nhật lại request với số lượng mới
      setFeedback({ status: "SUCCESS", message: result.message });
    } catch (error) {
      handleError(error);
    }
  };

  const renderContent = () => {
    if (
      feedback.status === "PROCESSING" ||
      feedback.status === "SUCCESS" ||
      feedback.status === "ERROR"
    ) {
      return (
        <ActionFeedback
          status={feedback.status}
          message={feedback.message}
          onClose={() => {
            // Sau khi xử lý xong, quay lại bước phù hợp
            if (mode === "INBOUND") {
              resetInboundState(); // Quay lại bước quét vị trí
            }
            if (mode === "OUTBOUND") {
              setOutboundState("REQUEST_LOADED"); // Quay lại màn hình picking list
              setScannedOutboundItem(null);
              setCurrentItemPickingInfo(null);
            }
            setFeedback({ status: "HIDDEN", message: "" });
          }}
        />
      );
    }

    if (mode === "SELECT") {
      return <ModeSelector onSelectMode={setMode} />;
    }

    // --- RENDER LUỒNG NHẬP KHO - Cập nhật lại ---
    if (mode === "INBOUND") {
      switch (inboundState) {
        case "SCANNING_LOCATION":
          return (
            <Scanner
              onScan={handleInboundScan}
              scanPrompt="NHẬP KHO: Vui lòng quét mã QR của VỊ TRÍ KHO"
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
                onCancel={resetInboundState} // Nút Hủy sẽ reset lại từ đầu
              />
            )
          );
        default:
          return <div>Trạng thái không xác định</div>;
      }
    }

    // --- RENDER LUỒNG XUẤT KHO - Không thay đổi ---
    if (mode === "OUTBOUND") {
      switch (outboundState) {
        case "SCANNING_REQUEST":
          return (
            <Scanner
              onScan={handleOutboundScan}
              scanPrompt="XUẤT KHO: Vui lòng quét mã PHIẾU YÊU CẦU"
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
                  setOutboundState("SCANNING_REQUEST");
                  setIssueRequest(null);
                }}
              />
            )
          );
        case "SCANNING_ITEM_FOR_ISSUE":
          return (
            <Scanner
              onScan={handleOutboundScan}
              scanPrompt={`Phiếu ${issueRequest?.id}: Quét mã VẬT TƯ cần lấy`}
              mode={mode}
            />
          );
        case "AWAITING_QUANTITY":
          return (
            scannedOutboundItem &&
            currentItemPickingInfo && (
              <IssueQuantityInput
                item={scannedOutboundItem}
                pickingInfo={currentItemPickingInfo}
                onSubmit={handleIssueSubmit}
                onCancel={() => setOutboundState("SCANNING_ITEM_FOR_ISSUE")}
              />
            )
          );
        default:
          return <div>Trạng thái không xác định</div>;
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
