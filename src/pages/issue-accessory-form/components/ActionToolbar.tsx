// Path: src/pages/issue-accessory-form/components/ActionToolbar.tsx

import React from "react";
import { Send } from "lucide-react";

interface ActionToolbarProps {
  onSubmit: () => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({ onSubmit }) => {
  return (
    <div className="mt-6 p-4 bg-white border-t sticky bottom-0 flex justify-end items-center space-x-4">
      <button
        onClick={onSubmit}
        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
      >
        <Send size={18} className="mr-2" />
        Finish
      </button>
    </div>
  );
};

export default ActionToolbar;
