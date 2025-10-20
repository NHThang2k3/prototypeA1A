// Path: src/pages/issue-fabric-form/components/FormHeader.tsx

import React from "react";

// Props will include values and change handlers
interface FormHeaderProps {
  productionOrder: string;
  requiredDate: string;
  notes: string;
  onFieldChange: (field: string, value: string) => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  productionOrder,
  requiredDate,
  notes,
  onFieldChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        General Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="productionOrder"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Production Order / Style Code
          </label>
          <input
            type="text"
            id="productionOrder"
            value={productionOrder}
            onChange={(e) => onFieldChange("productionOrder", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., PO-456"
          />
        </div>
        <div>
          <label
            htmlFor="requiredDate"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Required Date
          </label>
          <input
            type="date"
            id="requiredDate"
            value={requiredDate}
            onChange={(e) => onFieldChange("requiredDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => onFieldChange("notes", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Additional requests (if any)"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
