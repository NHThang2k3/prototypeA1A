// Path: src/pages/qr-scan/components/ActionFeedback.tsx

import React from "react";
import { CheckCircle, AlertTriangle, Loader } from "lucide-react";

interface ActionFeedbackProps {
  status: "PROCESSING" | "SUCCESS" | "ERROR";
  message: string;
  onClose: () => void;
}

const ActionFeedback: React.FC<ActionFeedbackProps> = ({
  status,
  message,
  onClose,
}) => {
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
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full flex flex-col items-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default ActionFeedback;
