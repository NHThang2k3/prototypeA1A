// src/pages/bundle-management/components/JobListTable.tsx
import { Eye, FilePenLine, QrCode, Printer, Wrench } from "lucide-react";
import type { Job, ColumnConfig } from "../types";

type JobListTableProps = {
  jobs: Job[];
  allColumns: ColumnConfig[];
  visibleColumns: Record<string, boolean>;
  onUpdateClick: (job: Job) => void;
};

const JobListTable = ({
  jobs,
  allColumns,
  visibleColumns,
  onUpdateClick,
}: JobListTableProps) => {
  const visibleColumnHeaders = allColumns.filter(
    (col) => visibleColumns[col.key]
  );

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow border">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs text-gray-700 uppercase sticky top-0 z-10">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 whitespace-nowrap sticky left-0 bg-gray-100 z-20"
            >
              Actions
            </th>
            {visibleColumnHeaders.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr
              key={`${job.jobNo}-${job.subNo}-${index}`}
              className="border-b hover:bg-gray-50"
            >
              <td className="px-4 py-2 whitespace-nowrap sticky left-0 bg-white hover:bg-gray-50 z-10">
                <div className="flex items-center space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onUpdateClick(job)}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Update Job"
                  >
                    <Wrench size={18} />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800"
                    title="Edit Job"
                  >
                    <FilePenLine size={18} />
                  </button>
                  <button
                    className="text-purple-600 hover:text-purple-800"
                    title="Generate QR Code"
                  >
                    <QrCode size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    title="Print QR Code"
                  >
                    <Printer size={18} />
                  </button>
                </div>
              </td>
              {visibleColumnHeaders.map((col) => (
                <td key={col.key} className="px-4 py-2 whitespace-nowrap">
                  {job[col.key as keyof Job]?.toLocaleString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobListTable;
