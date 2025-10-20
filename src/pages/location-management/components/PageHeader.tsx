// Path: src/pages/location-management/components/PageHeader.tsx
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface PageHeaderProps {
  onAddLocation: () => void; // Renamed from onAddRootLocation
}

const PageHeader: React.FC<PageHeaderProps> = ({ onAddLocation }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Warehouse Location Management
          </h1>
          <p className="text-sm text-gray-500">
            View, manage, and organize all warehouse storage locations.
          </p>
        </div>
        <Button onClick={onAddLocation}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Location
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
