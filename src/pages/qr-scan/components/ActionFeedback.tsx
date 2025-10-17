// Path: src/pages/qr-scan/components/ActionFeedback.tsx

import React from "react";
import { CheckCircle, AlertTriangle, Loader } from "lucide-react";
import type { ScannedItem, ScannedLocation } from "../types";

// NEW: Định nghĩa kiểu dữ liệu cho chi tiết thành công
interface PutAwaySuccessDetails {
  type: "PUT_AWAY_SUCCESS";
  items: ScannedItem[];
  location: ScannedLocation;
}

interface ActionFeedbackProps {
  status: "PROCESSING" | "SUCCESS" | "ERROR";
  message: string;
  onClose: () => void;
  // NEW: Thêm prop để nhận dữ liệu chi tiết
  details?: PutAwaySuccessDetails;
}

const ActionFeedback: React.FC<ActionFeedbackProps> = ({
  status,
  message,
  onClose,
  details,
}) => {
  const renderSuccessContent = () => {
    // Nếu có chi tiết cất hàng, hiển thị bảng
    if (details?.type === "PUT_AWAY_SUCCESS") {
      const { items, location } = details;
      const timestamp = new Date().toLocaleString("vi-VN");
      return (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold">Thành công!</h2>
          <p className="text-gray-600 text-center mb-4">{message}</p>

          <div className="w-full max-w-2xl mt-4 border rounded-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 font-semibold">Mã Vải (SKU)</th>
                    <th className="p-2 font-semibold">Số Mét</th>
                    <th className="p-2 font-semibold">Cân Nặng</th>
                    <th className="p-2 font-semibold">Vị Trí Cất</th>
                    <th className="p-2 font-semibold">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {items.map((item) => (
                    <tr key={item.qrCode} className="border-t">
                      <td className="p-2 font-mono">{item.sku}</td>
                      <td className="p-2">
                        {item.quantity} {item.uom}
                      </td>
                      <td className="p-2">{item.weight} kg</td>
                      <td className="p-2 font-mono bg-gray-50">
                        {location.locationCode}
                      </td>
                      <td className="p-2 text-xs">{timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Quét Tiếp
          </button>
        </>
      );
    }

    // Fallback: Hiển thị thông báo đơn giản
    return (
      <>
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-xl font-semibold">Thành công!</h2>
        <p className="text-gray-600 text-center">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
        >
          Quét Tiếp
        </button>
      </>
    );
  };

  const renderContent = () => {
    switch (status) {
      case "PROCESSING":
        return (
          <>
            <Loader className="w-16 h-16 text-blue-500 animate-spin mb-4" />
            <h2 className="text-xl font-semibold">Đang xử lý...</h2>
            <p className="text-gray-600">{message}</p>
          </>
        );
      case "SUCCESS":
        return renderSuccessContent();
      case "ERROR":
        return (
          <>
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold">Đã xảy ra lỗi!</h2>
            <p className="text-gray-600 text-center">{message}</p>
            <button
              onClick={onClose}
              className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              Thử Lại
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full flex flex-col items-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default ActionFeedback;
