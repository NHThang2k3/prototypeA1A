import {
  UploadCloud,
  FileText,
  Download,
  History,
  AlertCircle,
} from "lucide-react";

// Mock data for upload history
const uploadHistory = [
  {
    id: 1,
    fileName: "PKL_PO12345_Adidas.xlsx",
    uploadedBy: "Planner A",
    date: "2023-10-26 10:15 AM",
    status: "Success",
  },
  {
    id: 2,
    fileName: "PackingPlan_Puma_Fall23.csv",
    uploadedBy: "Planner B",
    date: "2023-10-25 04:30 PM",
    status: "Success",
  },
  {
    id: 3,
    fileName: "PKL_PO67890_Nike.xlsx",
    uploadedBy: "Planner A",
    date: "2023-10-25 09:00 AM",
    status: "Failed",
    error: "PO number 67890 not found in the system.",
  },
  {
    id: 4,
    fileName: "PackList_NB_Winter.xlsx",
    uploadedBy: "Planner C",
    date: "2023-10-24 11:45 AM",
    status: "Success",
  },
];

const UploadPackingPlanPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Upload Packing Plan</h1>

      {/* Upload Card */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Upload New Plan
        </h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Excel (.xlsx) or CSV (.csv) files only. Max 10MB.
          </p>
          <input type="file" className="hidden" />
        </div>
        <div className="mt-4 flex justify-end">
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors border border-gray-300">
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>
      </div>

      {/* Upload History Card */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <History className="w-6 h-6" />
          Upload History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  File Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Uploaded By
                </th>
                <th scope="col" className="px-6 py-3">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {uploadHistory.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    {item.fileName}
                  </td>
                  <td className="px-6 py-4">{item.uploadedBy}</td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4">
                    {item.status === "Success" ? (
                      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        Success
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.status === "Failed" ? (
                      <button
                        className="font-medium text-red-600 hover:underline flex items-center gap-1"
                        title={item.error}
                      >
                        <AlertCircle className="w-4 h-4" />
                        View Error
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadPackingPlanPage;
