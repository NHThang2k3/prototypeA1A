import { UploadCloud, FileText, Download, History, Ship } from "lucide-react";

// Mock data for upload history
const uploadHistory = [
  {
    id: 1,
    fileName: "Planload_Container_C123.xlsx",
    uploadedBy: "Export Dept",
    date: "2023-10-27 09:30 AM",
    status: "Success",
  },
  {
    id: 2,
    fileName: "Final_Load_Adidas_W44.csv",
    uploadedBy: "Export Dept",
    date: "2023-10-26 02:00 PM",
    status: "Success",
  },
];

const UploadPlanloadPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Upload Final Plan Load
      </h1>

      {/* Upload Card */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Ship className="w-6 h-6" />
          Upload New Plan Load
        </h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Excel (.xlsx) or CSV (.csv) files only. This will generate the final
            shipment order.
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
          Plan Load Upload History
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
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                      Success
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="font-medium text-blue-600 hover:underline">
                      View Details
                    </button>
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

export default UploadPlanloadPage;
