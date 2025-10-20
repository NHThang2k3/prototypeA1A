// Path: src/pages/location-management/components/LocationTable.tsx

import React, { useState, useMemo } from "react";
import type { LocationItem } from "../types";
import { Button } from "../../../components/ui/button";
import { Edit, Eye, ChevronDown, ChevronRight } from "lucide-react";

interface LocationTableProps {
  locations: LocationItem[];
  onEdit: (location: LocationItem) => void;
  onViewItems: (location: LocationItem) => void;
}

const LocationTable: React.FC<LocationTableProps> = ({
  locations,
  onEdit,
  onViewItems,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const groupedData = useMemo(() => {
    const warehouses: {
      [key: string]: {
        shelves: { [key: number]: LocationItem[] };
        totals: { capacity: number; occupancy: number };
      };
    } = {};

    locations.forEach((location) => {
      if (!warehouses[location.warehouse]) {
        warehouses[location.warehouse] = {
          shelves: {},
          totals: { capacity: 0, occupancy: 0 },
        };
      }
      if (!warehouses[location.warehouse].shelves[location.shelf]) {
        warehouses[location.warehouse].shelves[location.shelf] = [];
      }
      warehouses[location.warehouse].shelves[location.shelf].push(location);
      warehouses[location.warehouse].totals.capacity += location.capacity;
      warehouses[location.warehouse].totals.occupancy +=
        location.currentOccupancy;
    });

    // Expand all warehouses by default
    const initialExpanded = new Set(
      Object.keys(warehouses).map((w) => `wh-${w}`)
    );
    setExpandedRows(initialExpanded);

    return warehouses;
  }, [locations]);

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderOccupancy = (occupancy: number, capacity: number) => {
    const percentage = capacity > 0 ? (occupancy / capacity) * 100 : 0;
    return (
      <div className="flex items-center">
        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600">
          {occupancy} / {capacity}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Occupancy / Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedData).map(([warehouseId, warehouseData]) => {
              const whKey = `wh-${warehouseId}`;
              const isWhExpanded = expandedRows.has(whKey);
              return (
                <React.Fragment key={whKey}>
                  {/* Warehouse Row */}
                  <tr
                    className="bg-gray-100 font-bold hover:bg-gray-200 cursor-pointer"
                    onClick={() => toggleRow(whKey)}
                  >
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">
                      <div className="flex items-center">
                        {isWhExpanded ? (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                        Warehouse {warehouseId}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {renderOccupancy(
                        warehouseData.totals.occupancy,
                        warehouseData.totals.capacity
                      )}
                    </td>
                    <td colSpan={2} className="px-6 py-3 text-sm text-gray-600">
                      Total for warehouse {warehouseId}
                    </td>
                  </tr>

                  {isWhExpanded &&
                    Object.entries(warehouseData.shelves).map(
                      ([shelfId, locations]) => {
                        const shelfKey = `${whKey}-sh-${shelfId}`;
                        const isShelfExpanded = expandedRows.has(shelfKey);
                        const shelfTotals = locations.reduce(
                          (acc, loc) => ({
                            capacity: acc.capacity + loc.capacity,
                            occupancy: acc.occupancy + loc.currentOccupancy,
                          }),
                          { capacity: 0, occupancy: 0 }
                        );

                        return (
                          <React.Fragment key={shelfKey}>
                            {/* Shelf Row */}
                            <tr
                              className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
                              onClick={() => toggleRow(shelfKey)}
                            >
                              <td className="pl-12 pr-6 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                <div className="flex items-center">
                                  {isShelfExpanded ? (
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                  )}
                                  Shelf {shelfId}
                                </div>
                              </td>
                              <td className="px-6 py-3">
                                {renderOccupancy(
                                  shelfTotals.occupancy,
                                  shelfTotals.capacity
                                )}
                              </td>
                              <td
                                colSpan={2}
                                className="px-6 py-3 text-sm text-gray-500"
                              >
                                Summary for shelf {shelfId}
                              </td>
                            </tr>

                            {isShelfExpanded &&
                              locations.map((location) => (
                                // Pallet/Location Row
                                <tr
                                  key={location.id}
                                  className="hover:bg-blue-50"
                                >
                                  <td className="pl-20 pr-6  whitespace-nowrap text-sm font-medium text-gray-900">
                                    {location.id}
                                  </td>
                                  <td className="px-6 ">
                                    {renderOccupancy(
                                      location.currentOccupancy,
                                      location.capacity
                                    )}
                                  </td>
                                  <td className="px-6  whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                    {location.description}
                                  </td>
                                  <td className="px-6  whitespace-nowrap text-right text-sm font-medium">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => onViewItems(location)}
                                      title="View Items"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => onEdit(location)}
                                      title="Edit Location"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </React.Fragment>
                        );
                      }
                    )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationTable;
