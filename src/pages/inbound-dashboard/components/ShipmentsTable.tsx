// D:\WATATECH\WH\src\pages\inbound-dashboard\components\ShipmentsTable.tsx

import React from "react";
import { Link } from "react-router-dom";
import type { Receipt } from "../types";
import { StatusBadge } from "./StatusBadge";
import { TableSkeleton } from "./skeletons/TableSkeleton";
import { ArrowRight } from "lucide-react";

interface ShipmentsTableProps {
  receipts: Receipt[];
  isLoading: boolean;
}

export const ShipmentsTable: React.FC<ShipmentsTableProps> = ({
  receipts,
  isLoading,
}) => {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (receipts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700">
          Không có lô hàng nào cần xử lý
        </h3>
        <p className="text-gray-500 mt-2">
          Tất cả các lô hàng đã được nhập kho hoặc chưa có lô hàng mới.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getActionText = (status: Receipt["status"]) => {
    switch (status) {
      case "pending_receipt":
        return "Bắt đầu nhận hàng";
      case "processing":
      case "partially_received":
        return "Tiếp tục xử lý";
      case "fully_received":
        return "Xem chi tiết";
      default:
        return "Xem";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Số PO
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Packing List
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nhà cung cấp
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày nhận
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tiến độ
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receipts.map((receipt) => (
              <tr key={receipt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {receipt.poNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold cursor-pointer hover:underline">
                  <Link to={`/shipment-detail/${receipt.id}`}>
                    {receipt.packingList}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {receipt.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(receipt.arrivalDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={receipt.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {receipt.progress ? (
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (receipt.progress.receivedItems /
                                receipt.progress.totalItems) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span>{`${receipt.progress.receivedItems}/${receipt.progress.totalItems}`}</span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/shipment-detail/${receipt.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    {getActionText(receipt.status)}
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến{" "}
            <span className="font-medium">5</span> trên{" "}
            <span className="font-medium">5</span> kết quả
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <a
            href="#"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Trước
          </a>
          <a
            href="#"
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Sau
          </a>
        </div>
      </nav>
    </div>
  );
};
