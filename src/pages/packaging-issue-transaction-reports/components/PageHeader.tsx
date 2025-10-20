// Path: src/pages/packaging-issue-transaction-reports/components/PageHeader.tsx

import { Download } from "lucide-react";

interface PageHeaderProps {
  selectedCount: number;
  onExport: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ selectedCount, onExport }) => {
  const hasSelection = selectedCount > 0;

  return (
    <div className="bg-white p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Packaging Issue Transaction Report
          </h1>
          <p className="text-sm text-gray-500">
            View, filter, and export packaging transaction history.
          </p>
        </div>
        <button
          className={`flex items-center text-white px-4 py-2 rounded-lg transition-colors ${
            hasSelection
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={onExport}
          disabled={!hasSelection}
        >
          <Download className="w-4 h-4 mr-2" />
          Export to Excel {hasSelection && `(${selectedCount})`}
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
