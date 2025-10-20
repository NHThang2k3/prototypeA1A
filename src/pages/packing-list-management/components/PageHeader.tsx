// src/pages/packing-list-management/components/PageHeader.tsx

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface PageHeaderProps {
  onImportClick: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onImportClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      {/* Page title, on the left */}
      <h1 className="text-3xl font-bold text-gray-900">
        Packing List Management
      </h1>

      {/* Import button, on the right */}
      <Button
        onClick={onImportClick}
        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
      >
        <Plus className="-ml-1 mr-2 h-5 w-5" />
        Import Packing List
      </Button>
    </div>
  );
};

export default PageHeader;
