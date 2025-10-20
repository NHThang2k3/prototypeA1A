import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import ImportPackingListFormPage from "../../import-packing-list/ImportPackingListFormPage";
import ActionToolbar from "../../import-packing-list/components/ActionToolbar";
import type { PackingListItem } from "../../import-packing-list/types";

interface ImportPackingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportPackingListModal: React.FC<ImportPackingListModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [items, setItems] = useState<PackingListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (items.length === 0) {
      alert(
        "Please upload and process a file before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newShipmentId = `PNK-${Date.now()}`;
      alert(`Successfully created inbound shipment ${newShipmentId}!`);
      onClose(); // Close modal on success
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col h-full max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Import Packing List
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          <ImportPackingListFormPage items={items} onItemsChange={setItems} />
        </div>
        <div className="flex-shrink-0">
          <ActionToolbar onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
};

export default ImportPackingListModal;
