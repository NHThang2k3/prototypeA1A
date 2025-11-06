import { useState } from "react";
import { Users, UserCheck, UserX, Save } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/ui/custom-table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type LinePosition = {
  id: number;
  operation: string;
  requiredSkill: string;
  assignedWorkerId: string | null;
};

// Mock Data
const linePositionsData: LinePosition[] = [
  {
    id: 1,
    operation: "Sleeve Placket",
    requiredSkill: "Single Needle",
    assignedWorkerId: "W003",
  },
  {
    id: 2,
    operation: "Sleeve Attach",
    requiredSkill: "Overlock 5-thread",
    assignedWorkerId: "W005",
  },
  {
    id: 3,
    operation: "Side Seam",
    requiredSkill: "Overlock 5-thread",
    assignedWorkerId: null,
  },
  {
    id: 4,
    operation: "Collar Attach",
    requiredSkill: "Single Needle - High",
    assignedWorkerId: "W001",
  },
  {
    id: 5,
    operation: "Hemming",
    requiredSkill: "Coverstitch",
    assignedWorkerId: null,
  },
];

const availableWorkersData = [
  { id: "W001", name: "Nguyen Van A" },
  { id: "W002", name: "Tran Thi B" },
  { id: "W003", name: "Le Van C" },
  { id: "W004", name: "Pham Thi D" },
  { id: "W005", name: "Hoang Van E" },
];

const ManageWorkforcePage = () => {
  const [linePositions, setLinePositions] =
    useState<LinePosition[]>(linePositionsData);

  const handleAssignmentChange = (
    positionId: number,
    workerId: string | null
  ) => {
    setLinePositions((prevPositions) =>
      prevPositions.map((pos) =>
        pos.id === positionId ? { ...pos, assignedWorkerId: workerId } : pos
      )
    );
  };

  const columns: ColumnDef<LinePosition>[] = [
    { accessorKey: "id", header: "Position #" },
    { accessorKey: "operation", header: "Operation" },
    {
      accessorKey: "requiredSkill",
      header: "Required Skill",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="text-purple-800 border-purple-300 bg-purple-100"
        >
          {row.getValue("requiredSkill")}
        </Badge>
      ),
    },
    {
      id: "assignedWorker",
      header: "Assigned Worker",
      cell: ({ row }) => {
        const position = row.original;
        const UNASSIGNED_VALUE = "unassigned"; // Dùng hằng số để code dễ đọc hơn

        return (
          <Select
            // Sửa 2: Ánh xạ giá trị null của state sang giá trị "unassigned" của UI
            value={position.assignedWorkerId || UNASSIGNED_VALUE}
            onValueChange={(value) =>
              // Sửa 3: Xử lý logic ngược lại khi người dùng chọn
              handleAssignmentChange(
                position.id,
                value === UNASSIGNED_VALUE ? null : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="-- Unassigned --" />
            </SelectTrigger>
            <SelectContent>
              {/* Sửa 1: Thay đổi giá trị từ "" thành một chuỗi không rỗng */}
              <SelectItem value={UNASSIGNED_VALUE}>-- Unassigned --</SelectItem>
              {availableWorkersData.map((worker) => (
                <SelectItem key={worker.id} value={worker.id}>
                  {worker.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
  ];

  const assignedCount = linePositions.filter((p) => p.assignedWorkerId).length;
  const requiredCount = linePositions.length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Workforce Management</h1>
          <p className="text-sm text-muted-foreground">
            Assign workers to sewing line positions for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="line5">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a line" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line5">Line 05</SelectItem>
              <SelectItem value="line6">Line 06</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            defaultValue={new Date().toISOString().substring(0, 10)}
            className="w-[180px]"
          />
        </div>
      </header>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <Users className="w-6 h-6 text-muted-foreground" />
            <div>
              <p className="font-bold">{requiredCount}</p>
              <p className="text-sm text-muted-foreground">
                Positions Required
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <UserCheck className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-bold">{assignedCount}</p>
              <p className="text-sm text-muted-foreground">Workers Assigned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <UserX className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-bold">{requiredCount - assignedCount}</p>
              <p className="text-sm text-muted-foreground">
                Positions Unfilled
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Table */}
      <Card>
        <CardContent className="pt-6">
          <CustomTable
            columns={columns}
            data={linePositions}
            showCheckbox={false}
            showColumnVisibility={false}
          />
          <div className="flex justify-end mt-6">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Assignments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageWorkforcePage;
