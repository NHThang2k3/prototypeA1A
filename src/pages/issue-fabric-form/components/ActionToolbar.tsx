// Path: src/pages/issue-fabric-form/components/ActionToolbar.tsx

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
    <div className="mt-6 p-4 bg-white border-t sticky bottom-0 flex justify-end items-center space-x-4">
      <button
        onClick={onSaveDraft}
        className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
      >
        <Save size={18} className="mr-2" />
        Lưu nháp
      </button>
      <button
        onClick={onSubmit}
        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
      >
        <Send size={18} className="mr-2" />
        Gửi Yêu cầu
      </button>
    </div>
  );
};

export default ActionToolbar;
