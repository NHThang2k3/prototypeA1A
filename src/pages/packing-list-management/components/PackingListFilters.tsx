// src/pages/packing-list-management/components/PackingListFilters.tsx

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, Filter } from "lucide-react";

const PackingListFilters = () => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label
            htmlFor="item-search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Item
          </label>
          <div className="relative">
            <Input
              id="item-search"
              placeholder="Enter PO, Item Code, Color, Lot..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div>
          <label
            htmlFor="print-status-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Print Status
          </label>
          <select
            id="print-status-filter"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="NOT_PRINTED">Not Printed</option>
            <option value="PRINTED">Printed</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="qc-status-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            QC Status
          </label>
          <select
            id="qc-status-filter"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Yes">Passed</option>
            <option value="No">Failed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button>
          <Filter className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default PackingListFilters;
