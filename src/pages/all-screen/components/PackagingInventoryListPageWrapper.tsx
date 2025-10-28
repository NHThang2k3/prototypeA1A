import React from "react";
import PackagingInventoryListPage from "../../packaging-inventory-list/PackagingInventoryListPage";

// --- START: Sao chép các component Modal từ file gốc ---
// Vì các Modal này được định nghĩa bên trong PackagingInventoryListPage,
// chúng ta cần định nghĩa lại chúng ở đây để sử dụng riêng biệt cho mục đích showcase.
import type { FC } from "react";
import type { PackagingItem } from "../../packaging-inventory-list/types";
import { DUMMY_PACKAGING_DATA } from "../../packaging-inventory-list/data";

const Modal: FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  // Component Modal gốc không thay đổi.
  // Các lớp CSS override bên ngoài sẽ xử lý việc hiển thị nó.
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
      </div>
      <div>{children}</div>
    </div>
  </div>
);

const IssueModal: FC<{
  item: PackagingItem;
  onSubmit: (quantity: number) => void;
  onCancel: () => void;
}> = ({ item, onSubmit, onCancel }) => {
  // Chúng ta không cần state ở đây vì đây chỉ là hiển thị giao diện
  return (
    <Modal title={`Issue Packaging: ${item.itemNumber}`} onClose={onCancel}>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">{item.materialName}</span> - {item.color}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Current quantity: <span className="font-bold">{item.quantity}</span>{" "}
        {item.unit}
      </p>
      <div>
        <label
          htmlFor="quantity-issue-dummy"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantity to issue
        </label>
        <input
          type="number"
          id="quantity-issue-dummy"
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={`e.g., 100`}
          min="1"
          max={item.quantity}
          defaultValue={10} // Hiển thị một giá trị mẫu
        />
      </div>
      <button
        onClick={() => onSubmit(10)}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Confirm Issue
      </button>
    </Modal>
  );
};
// --- END: Sao chép các component Modal ---

const PackagingInventoryListPageWrapper: React.FC = () => {
  // Lấy một item mẫu từ dữ liệu giả để hiển thị trong các modal
  const dummyItem = DUMMY_PACKAGING_DATA[1]; // Lấy túi poly làm ví dụ
  const dummyTransferItem = DUMMY_PACKAGING_DATA[0]; // Lấy thùng carton làm ví dụ

  return (
    <div className="flex flex-col space-y-8">
      {/* 1. Render trang quản lý kho như bình thường */}
      <PackagingInventoryListPage />

      {/* 2. Render các Modal như các thành phần tĩnh để review giao diện */}
      <div className="border-t-2 border-dashed border-gray-300 pt-8">
        <h3 className="text-xl font-bold text-center text-gray-600 mb-4">
          --- Modal Showcase ---
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Modal Xuất kho (Issue) */}
          <div
            className="
              [&>div]:!static [&>div]:!inset-auto [&>div]:!z-auto 
              [&>div]:!bg-transparent [&>div]:!p-0 [&>div]:block
              /* Căn chỉnh lại card nội dung */
              [&>div>div]:mx-auto
            "
          >
            <IssueModal
              item={dummyItem}
              onSubmit={() => {}}
              onCancel={() => {}}
            />
          </div>

          {/* Modal Chuyển vị trí (Transfer) */}
          <div
            className="
              /* Các lớp CSS override tương tự */
              [&>div]:!static [&>div]:!inset-auto [&>div]:!z-auto 
              [&>div]:!bg-transparent [&>div]:!p-0 [&>div]:block
              /* Căn chỉnh lại card nội dung */
              [&>div>div]:mx-auto
            "
          >
            <Modal
              title={`Transfer Location for ${dummyTransferItem.itemNumber}`}
              onClose={() => {}}
            >
              <form onSubmit={(e) => e.preventDefault()}>
                <p className="mb-4">
                  Current location:{" "}
                  <span className="font-semibold">
                    {dummyTransferItem.location}
                  </span>
                </p>
                <label
                  htmlFor="new-location-dummy"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New location
                </label>
                <input
                  type="text"
                  id="new-location-dummy"
                  name="new-location-dummy"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md"
                  placeholder="e.g., Kệ Z-99-99"
                  required
                />
                <button
                  type="submit"
                  className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Confirm Transfer
                </button>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagingInventoryListPageWrapper;
