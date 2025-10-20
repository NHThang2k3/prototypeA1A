// src/pages/import-packing-list/components/ActionToolbar.tsx

import React from "react";

interface ActionToolbarProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="sticky bottom-0 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200 p-4 z-10">
      <div className="max-w-7xl mx-auto flex justify-end items-center space-x-4">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Complete"}
        </button>
      </div>
    </div>
  );
};

export default ActionToolbar;
