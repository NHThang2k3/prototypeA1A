import React, { useState } from "react";
import GarmentInspectionPage from "../../GarmentInspectionPage/GarmentInspectionPage";
import { AlertTriangle } from "lucide-react";

const GarmentInspectionPageWrapper: React.FC = () => {
  const [showFailModal, setShowFailModal] = useState(true);

  return (
    // Thêm flex flex-col để các component con xếp chồng lên nhau một cách nhất quán
    <div className="flex flex-col">
      {/* Render the original page */}
      <GarmentInspectionPage />

      {/* Render the Fail Modal directly */}
      {showFailModal && (
        // --- THAY ĐỔI Ở ĐÂY (LỚP VỎ MODAL) ---
        // Bỏ các class popup, chỉ giữ lại một div với khoảng cách ở trên (mt-6)
        <div className="mt-6">
          {/* --- THAY ĐỔI Ở ĐÂY (CARD NỘI DUNG) --- */}
          {/* Thêm mx-auto để căn giữa, giảm shadow và thêm border cho đẹp hơn */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 max-w-lg w-full mx-auto">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                Inspection Failed: 1st Time
              </h2>
            </div>
            <p className="mt-2 text-gray-600">
              This garment has failed the initial inspection. Please provide
              comments and submit to notify the QAM for a decision.
            </p>
            <div className="mt-6">
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Comments
              </label>
              <textarea
                id="comments"
                rows={4}
                className="w-full p-2 border rounded-md"
                placeholder="Describe the issue..."
              ></textarea>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowFailModal(false)}
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowFailModal(false)}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700"
              >
                Submit to QAM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarmentInspectionPageWrapper;
