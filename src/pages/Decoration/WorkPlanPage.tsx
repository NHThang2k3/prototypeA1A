// src/pages/WorkPlanPage/WorkPlanPage.tsx

import { useState } from "react";
import { Zap, Pause, CheckCircle } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle>Daily Work Plan</CardTitle>
          <Select defaultValue="machine-1">
            <SelectTrigger>
              <SelectValue placeholder="Select a machine..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="machine-1">Heat Press M/C #1</SelectItem>
              <SelectItem value="machine-2">Embroidery M/C #5</SelectItem>
              <SelectItem value="machine-3">Bonding Station #2</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto space-y-3 pr-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                selectedJob.id === job.id
                  ? "border-primary bg-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-card-foreground">
                  {job.po}{" "}
                  <span className="font-normal text-muted-foreground">
                    ({job.style})
                  </span>
                </p>
                <Badge variant={job.status === "New" ? "default" : "secondary"}>
                  {job.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {job.decoration}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Right Panel: Job Details */}
      <Card className="lg:col-span-2 flex flex-col">
        {selectedJob ? (
          <>
            <CardContent className="p-6 flex-grow">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedJob.po} - {selectedJob.style}
              </h2>
              <p className="text-md text-muted-foreground mb-6">
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
            </CardContent>

            <CardFooter className="grid grid-cols-3 gap-4">
              <Button
                size="lg"
                className="text-lg font-bold bg-green-600 hover:bg-green-700"
              >
                <Zap className="mr-2" size={20} /> Start
              </Button>
              <Button
                size="lg"
                className="text-lg font-bold text-gray-800 bg-yellow-400 hover:bg-yellow-500"
              >
                <Pause className="mr-2" size={20} /> Pause
              </Button>
              <Button
                size="lg"
                className="text-lg font-bold bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="mr-2" size={20} /> Complete
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full text-muted-foreground">
            Select a job to view details
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default WorkPlanPage;
