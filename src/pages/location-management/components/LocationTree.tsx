// Path: src/pages/location-management/components/LocationTree.tsx

import React, { useState } from "react";
import type { LocationNode, LocationType } from "../types";
import {
  ChevronRight,
  ChevronDown,
  Warehouse,
  Folder,
  Rows,
  Archive,
  Box,
} from "lucide-react";

// Icon map
const typeIcons: Record<LocationType, React.ElementType> = {
  WAREHOUSE: Warehouse,
  ZONE: Folder,
  AISLE: Rows,
  SHELF: Archive,
  BIN: Box,
};

interface TreeNodeProps {
  node: LocationNode;
  selectedNodeId: string | null;
  onSelect: (nodeId: string) => void;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  selectedNodeId,
  onSelect,
  level,
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Mặc định mở 2 cấp đầu
  const hasChildren = node.children && node.children.length > 0;
  const IconComponent = typeIcons[node.type];

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
  };

  const isSelected = selectedNodeId === node.id;

  return (
    <div>
      <div
        className={`flex items-center p-2 rounded-md cursor-pointer ${
          isSelected ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
        }`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={handleSelect}
      >
        <div className="w-6" onClick={handleToggle}>
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            ))}
        </div>
        <IconComponent className="w-5 h-5 mr-2 text-gray-500" />
        <span className="flex-grow font-medium">{node.name}</span>
      </div>
      {isExpanded && hasChildren && (
        <div className="pl-4 border-l-2 border-gray-200 ml-5">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface LocationTreeProps {
  data: LocationNode;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

const LocationTree: React.FC<LocationTreeProps> = ({
  data,
  selectedNodeId,
  onSelectNode,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Cấu trúc kho</h2>
      <TreeNode
        node={data}
        selectedNodeId={selectedNodeId}
        onSelect={onSelectNode}
        level={0}
      />
    </div>
  );
};

export default LocationTree;
