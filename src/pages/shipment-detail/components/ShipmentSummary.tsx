// Path: src/pages/shipment-detail/components/ShipmentSummary.tsx

import React from "react";
import type { Shipment } from "../types";

interface ShipmentSummaryProps {
  shipment: Shipment;
}

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-base text-gray-900 font-semibold">{value}</dd>
  </div>
);

const ShipmentSummary: React.FC<ShipmentSummaryProps> = ({ shipment }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        <InfoItem label="Số Packing List" value={shipment.packingListNo} />
        <InfoItem label="Số PO" value={shipment.poNumber} />
        <InfoItem label="Nhà cung cấp" value={shipment.supplier} />
        <InfoItem label="Ngày dự kiến đi (ETD)" value={shipment.etd} />
        <InfoItem label="Ngày dự kiến đến (ETA)" value={shipment.eta} />
      </dl>
    </div>
  );
};

export default ShipmentSummary;
