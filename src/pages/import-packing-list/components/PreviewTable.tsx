import React from "react";
import type { PackingListItem } from "../types";

interface PreviewTableProps {
  items: PackingListItem[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ items }) => {
  const headers = [
    "Số PO",
    "Mã Item",
    "Màu sắc",
    "Số cuộn",
    "Số Lô / Mẻ",
    "Số Yards",
    "KL Tịnh (Kgs)",
    "KL Cả bì (Kgs)",
    "Khổ vải",
    "Vị trí kho",
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        2. Xem trước dữ liệu ({items.length} dòng)
      </h2>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.poNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.itemCode}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.color}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.rollNo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.lotNo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                  {item.yards.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                  {item.netWeight.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                  {item.grossWeight.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.width}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {item.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviewTable;
