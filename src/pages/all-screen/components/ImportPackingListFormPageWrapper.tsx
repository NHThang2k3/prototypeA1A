import React from "react";
import ImportPackingListFormPage from "../../import-packing-list/ImportPackingListFormPage";
import type { PackingListItem } from "../../import-packing-list/types";

const dummyPackingListItems: PackingListItem[] = [
  {
    id: "temp-1",
    poNumber: "PO12345",
    itemCode: "FAB-001",
    factory: "Factory A",
    supplier: "Supplier X",
    invoiceNo: "INV-001",
    colorCode: "BLK",
    color: "Black",
    rollNo: "R001",
    lotNo: "L001",
    yards: 100,
    netWeight: 10,
    grossWeight: 11,
    width: '60"',
    location: "WH1-A1",
    qrCode: "QR001",
    dateInHouse: "2023-10-26",
    description: "Cotton Fabric",
  },
  {
    id: "temp-2",
    poNumber: "PO12345",
    itemCode: "FAB-002",
    factory: "Factory B",
    supplier: "Supplier Y",
    invoiceNo: "INV-002",
    colorCode: "BLU",
    color: "Blue",
    rollNo: "R002",
    lotNo: "L002",
    yards: 150,
    netWeight: 15,
    grossWeight: 16,
    width: '58"',
    location: "WH1-B2",
    qrCode: "QR002",
    dateInHouse: "2023-10-27",
    description: "Denim Fabric",
  },
];

const ImportPackingListFormPageWrapper: React.FC = () => {
  return (
    // --- THAY ĐỔI Ở ĐÂY ---
    // Bọc component trong một div để override CSS của các modal con cháu.
    // Chúng ta nhắm vào bất kỳ div nào có class 'fixed' (đặc trưng của modal overlay).
    <div
      className="
        /* --- Override CSS cho div gốc của Modal (lớp phủ) --- */
        /* Nhắm vào bất kỳ div con cháu nào có class 'fixed' */
        [&_.fixed]:!static 
        [&_.fixed]:!inset-auto
        [&_.fixed]:!z-auto
        [&_.fixed]:!bg-transparent
        [&_.fixed]:!p-0
        [&_.fixed]:!block

        /* --- Chỉnh lại style cho div chứa nội dung (card) bên trong --- */
        /* Nhắm vào div con trực tiếp của lớp phủ đã bị override ở trên */
        [&_.fixed>div]:!mx-auto
        [&_.fixed>div]:!mt-6
        [&_.fixed>div]:!mb-6 /* Thêm margin bottom để trông thoáng hơn */
      "
    >
      <ImportPackingListFormPage
        items={dummyPackingListItems}
        onItemsChange={() => {}}
      />
    </div>
  );
};

export default ImportPackingListFormPageWrapper;
