import { useState } from "react";
import { Zap, Pause, CheckCircle } from "lucide-react";

const jobs = [
  {
    id: 1,
    po: "PO12345",
    style: "STYLE-A01",
    color: "Black",
    decoration: "Heat Press Logo",
    qty: 1200,
    status: "New",
    image: "https://via.placeholder.com/300x300.png?text=Style+A01",
    tech: "Temp: 150°C, Time: 15s, Pressure: Medium",
  },
  {
    id: 2,
    po: "PO12347",
    style: "STYLE-C03",
    color: "Navy",
    decoration: "Pad-Print Sleeve",
    qty: 2500,
    status: "Pending",
    image: "https://via.placeholder.com/300x300.png?text=Style+C03",
    tech: "Ink: PX-4, Cliche Depth: 25μm",
  },
  {
    id: 3,
    po: "PO12349",
    style: "STYLE-E05",
    color: "White",
    decoration: "Embroidery Chest",
    qty: 2000,
    status: "Pending",
    image: "https://via.placeholder.com/300x300.png?text=Style+E05",
    tech: "Thread: Madeira 1001, Stitches: 8,500",
  },
];

const WorkPlanPage = () => {
  const [selectedJob, setSelectedJob] = useState(jobs[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
      {/* Left Panel: Job List */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow p-4 flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Daily Work Plan</h2>
          <select className="w-full mt-2 p-2 border border-gray-300 rounded-md">
            <option>Heat Press M/C #1</option>
            <option>Embroidery M/C #5</option>
            <option>Bonding Station #2</option>
          </select>
        </div>
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`p-4 rounded-lg cursor-pointer border-2 ${
                selectedJob.id === job.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800">
                  {job.po}{" "}
                  <span className="font-normal text-gray-500">
                    ({job.style})
                  </span>
                </p>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    job.status === "New"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{job.decoration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Job Details */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 flex flex-col">
        {selectedJob ? (
          <>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedJob.po} - {selectedJob.style}
              </h2>
              <p className="text-md text-gray-500 mb-6">
                {selectedJob.decoration}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedJob.image}
                    alt={selectedJob.style}
                    className="rounded-lg w-full object-cover aspect-square"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Job Details</h3>
                    <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc list-inside">
                      <li>Color: {selectedJob.color}</li>
                      <li>
                        Quantity: {selectedJob.qty.toLocaleString()} units
                      </li>
                      <li>
                        Status:{" "}
                        <span className="font-medium">
                          {selectedJob.status}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Technical Specs
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {selectedJob.tech}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Accessory Status
                    </h3>
                    <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-2">
                      <CheckCircle size={16} /> All materials ready
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
              <button className="flex items-center justify-center gap-2 w-full p-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">
                <Zap size={20} /> Start
              </button>
              <button className="flex items-center justify-center gap-2 w-full p-4 text-lg font-bold text-gray-800 bg-yellow-400 rounded-lg hover:bg-yellow-500">
                <Pause size={20} /> Pause
              </button>
              <button className="flex items-center justify-center gap-2 w-full p-4 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <CheckCircle size={20} /> Complete
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a job to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkPlanPage;
