import React, { useState, useCallback } from "react";
import * as XLSX from "xlsx";

// 1. Type definition for a single entry in the cutting plan
interface PlanEntry {
  cutDate: string;
  job: string;
  style: string;
  infromWarehouseFB: string;
  infromQCFabric: string;
  infromPattern: string;
  infromTrimcard: string;
  infromMarker: string;
  po: string;
  makeMarker: string;
  quantity: number | string;
  plan: number | string;
  color: string;
  startSewing: string;
  decoration: string;
  shipDate: string;
  remark: string;
  line: string;
  totalYdsFabric: number | string;
}

// 2. Sample data to simulate Excel file upload
// This mimics the structure returned by XLSX.utils.sheet_to_json(..., { header: 1 })
const sampleData: unknown[][] = [
  [
    "",
    "Column1",
    "Column2",
    "Ngày cắt",
    "JOB",
    "MÃ HÀNG\n(Style) ",
    "infrom Warehouse FB",
    "infrom QC Fabric",
    "infrom pattern ",
    "infrom \nTrimcard",
    "infrom Marker",
    "PO",
    "Column4",
    "Make\nmarker",
    "SỐ LƯỢNG\n(Qty)\n(pcs)",
    "KẾ HOẠCH CĂT\n(Plan)",
    "MÀU\n(Color)",
    "START sewing",
    "Decoration",
    "Ship\nDate",
    "REMARK",
    "LINE",
    "TỔNG YDS \nVẢI",
  ],
  [
    "",
    "",
    "",
    "3-Sep",
    "AA2506/00013",
    "S2506GHTT412WN",
    "",
    "",
    "",
    "",
    "",
    "all",
    "",
    "",
    "1,672",
    "1,672",
    "all",
    "5-Sep",
    "HE3,PD1",
    "12-Sep",
    "",
    "F2A18",
    "1,386",
  ],
  [
    "",
    "",
    "",
    "4-Sep",
    "AA2509/00617",
    "S2606CHJT104W",
    "",
    "",
    "",
    "",
    "",
    "all",
    "",
    "",
    "1,218",
    "1,218",
    "all",
    "26-Aug",
    "HE3",
    "13-Sep",
    "",
    "F2A06",
    "579",
  ],
  [
    "",
    "",
    "",
    "",
    "AA2509/01390",
    "S2606GHTT428Y",
    "",
    "",
    "",
    "",
    "",
    "all",
    "",
    "",
    "3,909",
    "3,909",
    "all",
    "30-Aug",
    "HE1&EMB1&PD1",
    "13-Sep",
    "0",
    "F2A07",
    "4,794",
  ],
  [
    "",
    "",
    "",
    "",
    "AA2509/01353",
    "S2602M907P",
    "",
    "",
    "",
    "",
    "",
    "all",
    "",
    "",
    "66",
    "66",
    "all",
    "3-Sep",
    "HE1",
    "13-Sep",
    "",
    "F2-PPA2",
    "109",
  ],
  [
    "",
    "",
    "",
    "5-Sep",
    "AA2509/02353",
    "S2408MR2302A",
    "",
    "",
    "",
    "",
    "",
    "all",
    "",
    "",
    "2,135",
    "2,135",
    "all",
    "5-Sep",
    "HE4,PD1",
    "13-Sep",
    "",
    "F2A02",
    "2,218",
  ],
  [
    "",
    "",
    "",
    "",
    "AA2509/01414",
    "S2606LHUB400WN",
    "",
    "",
    "",
    "",
    "",
    "all",
    "",
    "",
    "1,776",
    "1,776",
    "all",
    "6-Sep",
    "HE2&EMB1&PD1&pr1",
    "13-Sep",
    "",
    "F2A20",
    "1,429",
  ],
  [
    "",
    "",
    "",
    "#REF!",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "30-Dec",
    "HE2&PD1",
    "14-Oct",
    "Transfer to Q5S001",
    "",
    " -   ",
  ],
];

// 3. Main Component
const CuttingWeeklyDailyPlanPage: React.FC = () => {
  const [planData, setPlanData] = useState<PlanEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // 4. Abstracted data processing logic
  const processExcelData = useCallback((data: unknown[][]): void => {
    try {
      // The actual header row is the second row (index 1) in the provided format
      const headerRow = (data[0] || []) as string[];
      const dataRows = data.slice(1);

      const headerMapping: { [key: string]: keyof PlanEntry } = {
        "Ngày cắt": "cutDate",
        JOB: "job",
        "MÃ HÀNG\n(Style) ": "style",
        "infrom Warehouse FB": "infromWarehouseFB",
        "infrom QC Fabric": "infromQCFabric",
        "infrom pattern ": "infromPattern",
        "infrom \nTrimcard": "infromTrimcard",
        "infrom Marker": "infromMarker",
        PO: "po",
        "Make\nmarker": "makeMarker",
        "SỐ LƯỢNG\n(Qty)\n(pcs)": "quantity",
        "KẾ HOẠCH CĂT\n(Plan)": "plan",
        "MÀU\n(Color)": "color",
        "START sewing": "startSewing",
        Decoration: "decoration",
        "Ship\nDate": "shipDate",
        REMARK: "remark",
        LINE: "line",
        "TỔNG YDS \nVẢI": "totalYdsFabric",
      };

      // Find indices of columns from the actual header row in the data
      const columnIndices: { [key in keyof PlanEntry]?: number } = {};
      Object.entries(headerMapping).forEach(([header, key]) => {
        const index = headerRow.findIndex(
          (h) => h && h.trim() === header.trim()
        );
        if (index !== -1) {
          columnIndices[key] = index;
        }
      });

      let lastValidCutDate = "";
      const processedData: PlanEntry[] = [];

      dataRows.forEach((row) => {
        if (!Array.isArray(row)) return;

        const jobValue = row[columnIndices.job ?? -1];
        // Process only rows that have a valid job value
        if (
          jobValue &&
          jobValue.toString().trim() &&
          jobValue.toString().trim() !== "#REF!"
        ) {
          const entry = {} as PlanEntry;

          // Handle merged cell logic for cut date
          const currentCutDateRaw = row[columnIndices.cutDate ?? -1];
          let currentCutDate = "";
          if (currentCutDateRaw) {
            if (currentCutDateRaw instanceof Date) {
              currentCutDate = currentCutDateRaw.toLocaleDateString("en-GB");
            } else {
              currentCutDate = String(currentCutDateRaw);
            }
            lastValidCutDate = currentCutDate;
          }
          entry.cutDate = lastValidCutDate;

          // Map the rest of the data
          for (const key in columnIndices) {
            const typedKey = key as keyof PlanEntry;
            const index = columnIndices[typedKey];
            if (index !== undefined) {
              const value = row[index];
              if (
                typedKey === "quantity" ||
                typedKey === "plan" ||
                typedKey === "totalYdsFabric"
              ) {
                const numValue =
                  typeof value === "string"
                    ? parseFloat(value.replace(/,/g, ""))
                    : Number(value);
                entry[typedKey] = isNaN(numValue)
                  ? value !== null && value !== undefined
                    ? String(value)
                    : ""
                  : numValue;
              } else if (
                (typedKey === "startSewing" || typedKey === "shipDate") &&
                value instanceof Date
              ) {
                entry[typedKey] = value.toLocaleDateString("en-GB");
              } else {
                entry[typedKey] =
                  value !== null && value !== undefined ? String(value) : "";
              }
            }
          }
          processedData.push(entry);
        }
      });

      if (processedData.length === 0) {
        setError(
          "No valid data found in the file. Please check the file's structure."
        );
      } else {
        setPlanData(processedData);
      }
    } catch (err) {
      console.error("Error processing data:", err);
      setError(
        "An error occurred while processing the data. Please ensure the format is correct."
      );
      setPlanData([]);
    }
  }, []);

  // 5. Handler for real file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFileName(file.name);
      setError(null);
      setPlanData([]);

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Using `unknown[][]` for better type safety than `any[][]`
        const jsonData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });
        processExcelData(jsonData);
      };
      reader.onerror = () => {
        setError("Could not read the selected file.");
      };
      reader.readAsArrayBuffer(file);
      event.target.value = ""; // Allow re-uploading the same file
    },
    [processExcelData]
  );

  // 6. Handler to simulate upload using sample data
  const handleSimulateUpload = useCallback(() => {
    setError(null);
    setFileName("sample-data.xlsx");
    processExcelData(sampleData);
  }, [processExcelData]);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Weekly & Daily Cutting Plan
        </h1>

        {/* File Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Upload Data
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            <button
              onClick={handleSimulateUpload}
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
            >
              Load Sample Data
            </button>
            {fileName && (
              <span className="text-gray-600 font-medium">{fileName}</span>
            )}
          </div>
          {error && (
            <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">
              {error}
            </p>
          )}
        </div>

        {/* Data Display Section */}
        {planData.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Cut Date
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      JOB
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Style
                    </th>
                    {/* === THAY ĐỔI 1: THÊM TIÊU ĐỀ CỘT PO === */}
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      PO
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Quantity (Pcs)
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Plan
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Color
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Start Sewing
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Decoration
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Ship Date
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Line
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Total YDS Fabric
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {planData.map((row, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {row.cutDate}
                      </td>
                      <td className="px-4 py-2">{row.job}</td>
                      <td className="px-4 py-2">{row.style}</td>
                      {/* === THAY ĐỔI 2: THÊM DỮ LIỆU CỘT PO === */}
                      <td className="px-4 py-2">{row.po}</td>
                      <td className="px-4 py-2 text-right">
                        {typeof row.quantity === "number"
                          ? row.quantity.toLocaleString()
                          : row.quantity}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {typeof row.plan === "number"
                          ? row.plan.toLocaleString()
                          : row.plan}
                      </td>
                      <td className="px-4 py-2">{row.color}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {row.startSewing}
                      </td>
                      <td className="px-4 py-2">{row.decoration}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {row.shipDate}
                      </td>
                      <td className="px-4 py-2">{row.line}</td>
                      <td className="px-4 py-2 text-right">
                        {typeof row.totalYdsFabric === "number"
                          ? row.totalYdsFabric.toLocaleString()
                          : row.totalYdsFabric}
                      </td>
                      <td className="px-4 py-2">{row.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !error && (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              <p>
                Please choose an Excel file or load sample data to display the
                plan.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CuttingWeeklyDailyPlanPage;
