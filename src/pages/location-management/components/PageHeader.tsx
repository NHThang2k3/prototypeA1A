// Path: src/pages/location-management/components/PageHeader.tsx
import React, { useMemo } from "react";
import { Plus, Printer, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { LocationItem } from "../types";

interface PageHeaderProps {
  onAddLocation: () => void;
  onPrintSelected: () => void;
  onDeleteSelected: () => void;
  selectedCount: number;
  allLocations: LocationItem[];
  currentFilter: { country: string; factory: string };
  onFilterChange: (newFilter: { country: string; factory: string }) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  onAddLocation,
  onPrintSelected,
  onDeleteSelected,
  selectedCount,
  allLocations,
  currentFilter,
  onFilterChange,
}) => {
  const hasSelection = selectedCount > 0;

  const filterOptions = useMemo(() => {
    const options: { [country: string]: Set<string> } = {};
    allLocations.forEach((loc) => {
      if (!options[loc.country]) {
        options[loc.country] = new Set();
      }
      options[loc.country].add(loc.factory);
    });
    return options;
  }, [allLocations]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [country, factory] = e.target.value.split(":");
    onFilterChange({ country, factory });
  };

  const filterValue = `${currentFilter.country}:${currentFilter.factory}`;

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
        <div className="flex items-center space-x-2">
          {/* Filter Dropdown */}
          <select
            onChange={handleFilterChange}
            value={filterValue}
            className="block w-56 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all:all">All Countries & Factories</option>
            {Object.entries(filterOptions).map(([country, factories]) => (
              <optgroup label={country} key={country}>
                <option value={`${country}:all`}>
                  All Factories in {country}
                </option>
                {Array.from(factories).map((factory) => (
                  <option key={factory} value={`${country}:${factory}`}>
                    {factory}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {hasSelection && (
            <>
              <Button variant="outline" onClick={onPrintSelected}>
                <Printer className="w-4 h-4 mr-2" />
                Print QR ({selectedCount})
              </Button>
              <Button variant="destructive" onClick={onDeleteSelected}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedCount})
              </Button>
            </>
          )}
          <Button onClick={onAddLocation}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
