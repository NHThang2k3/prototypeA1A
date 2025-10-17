// Path: src/pages/issue-accessory-form/components/ActionToolbar.tsx

import React from "react";
import { Save, Send } from "lucide-react";

interface ActionToolbarProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onSaveDraft,
  onSubmit,
}) => {
  return (
    <div className="sticky bottom-0 bg-white bg-opacity-80 backdrop-blur-sm border-t border-gray-200 p-4 mt-6">
      <div className="flex justify-end space-x-4">
        <button
          onClick={onSaveDraft}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Save className="w-4 h-4 mr-2" />
          Lưu nháp
        </button>
        <button
          onClick={onSubmit}
          className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <Send className="w-4 h-4 mr-2" />
          Gửi Yêu cầu
        </button>
      </div>
    </div>
  );
};

export default ActionToolbar;
