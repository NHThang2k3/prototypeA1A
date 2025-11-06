import { type ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/ui/custom-table";

const workers = [
  {
    id: "W001",
    name: "Nguyen Van A",
    skills: {
      "Single Needle": 5,
      Overlock: 4,
      Coverstitch: 2,
      "Button Attach": 3,
    },
  },
  {
    id: "W002",
    name: "Tran Thi B",
    skills: {
      "Single Needle": 3,
      Overlock: 5,
      Coverstitch: 4,
      "Button Attach": 2,
    },
  },
  {
    id: "W003",
    name: "Le Van C",
    skills: {
      "Single Needle": 4,
      Overlock: 3,
      Coverstitch: 1,
      "Button Attach": 5,
    },
  },
];
const skills = ["Single Needle", "Overlock", "Coverstitch", "Button Attach"];
type Worker = (typeof workers)[0];

const SkillCell = ({ level }: { level: number }) => {
  const colors = [
    "bg-gray-200",
    "bg-red-200",
    "bg-orange-200",
    "bg-yellow-200",
    "bg-lime-200",
    "bg-green-200",
  ];
  return (
    <div
      className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded ${colors[level]}`}
    >
      {level}
    </div>
  );
};

const columns: ColumnDef<Worker>[] = [
  {
    accessorKey: "name",
    header: "Worker",
  },
  ...skills.map(
    (skill): ColumnDef<Worker> => ({
      id: skill,
      header: skill,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <SkillCell
            level={
              row.original.skills[skill as keyof typeof row.original.skills] ||
              0
            }
          />
        </div>
      ),
      enableSorting: false,
    })
  ),
];

const SkillMatrixPage = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Skill Matrix</h1>
        <p className="text-sm text-muted-foreground">
          Manage and visualize worker skill levels for line balancing.
        </p>
      </header>

      <Card>
        <CardContent className="p-4">
          <CustomTable
            columns={columns}
            data={workers}
            showCheckbox={false}
            showColumnVisibility={false}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Legend:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="flex items-center gap-2">
                <SkillCell level={level} />
                <span>Level {level}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillMatrixPage;
