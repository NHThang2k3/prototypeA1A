// src/pages/MachineLocationPage/MachineLocationPage.tsx

import { Circle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/ui/custom-table";

// --- TYPE DEFINITIONS ---
type MachineStatus = "Running" | "Idle" | "Maintenance";

type Machine = {
  id: string;
  type: string;
  location: string;
  status: MachineStatus;
  lastMaint: string;
  nextMaint: string;
};

// --- DATA ---
const machines: Machine[] = [
  {
    id: "HP-01",
    type: "Heat Press",
    location: "Zone A, Row 1",
    status: "Running",
    lastMaint: "2023-09-15",
    nextMaint: "2023-12-15",
  },
  {
    id: "EMB-05",
    type: "Embroidery",
    location: "Zone B, Row 3",
    status: "Idle",
    lastMaint: "2023-08-20",
    nextMaint: "2023-11-20",
  },
  {
    id: "BND-02",
    type: "Bonding",
    location: "Zone A, Row 2",
    status: "Maintenance",
    lastMaint: "2023-10-25",
    nextMaint: "2024-01-25",
  },
  {
    id: "PP-03",
    type: "Pad-Print",
    location: "Zone C, Row 1",
    status: "Running",
    lastMaint: "2023-10-01",
    nextMaint: "2024-01-01",
  },
];

// --- HELPER COMPONENTS ---
interface StatusIndicatorProps {
  status: MachineStatus;
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  let colorClass = "";
  switch (status) {
    case "Running":
      colorClass = "text-green-500";
      break;
    case "Idle":
      colorClass = "text-yellow-500";
      break;
    case "Maintenance":
      colorClass = "text-red-500";
      break;
    default:
      colorClass = "text-gray-400";
  }
  return (
    <div className="flex items-center gap-2">
      <Circle size={10} className={`${colorClass} fill-current`} />
      {status}
    </div>
  );
};

// --- TABLE COLUMN DEFINITIONS ---
const columns: ColumnDef<Machine>[] = [
  {
    accessorKey: "id",
    header: "Machine ID",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusIndicator status={row.original.status} />,
  },
  {
    accessorKey: "lastMaint",
    header: "Last Maintenance",
  },
  {
    accessorKey: "nextMaint",
    header: "Next Maintenance",
  },
];

const ListView = () => (
  <CustomTable
    columns={columns}
    data={machines}
    showCheckbox={false}
    showColumnVisibility={false}
  />
);

const MachineLocationPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Machine Management</h1>
      </div>
      <ListView />
    </div>
  );
};

export default MachineLocationPage;
