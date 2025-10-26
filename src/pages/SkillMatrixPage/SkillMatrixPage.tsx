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

const SkillMatrixPage = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Skill Matrix</h1>
        <p className="text-sm text-gray-500">
          Manage and visualize worker skill levels for line balancing.
        </p>
      </header>

      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Worker</th>
                {skills.map((skill) => (
                  <th key={skill} className="px-6 py-3">
                    {skill}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-left">
                    {worker.name}
                  </td>
                  {skills.map((skill) => (
                    <td key={skill} className="px-6 py-4">
                      <div className="flex justify-center">
                        <SkillCell
                          level={
                            worker.skills[
                              skill as keyof typeof worker.skills
                            ] || 0
                          }
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Legend:</h3>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} className="flex items-center gap-2">
              <SkillCell level={level} />
              <span>Level {level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillMatrixPage;
