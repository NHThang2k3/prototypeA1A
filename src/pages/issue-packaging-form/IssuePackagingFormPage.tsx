import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ActionToolbar from "./components/ActionToolbar";
import FormHeader from "./components/FormHeader";
import PageHeader from "./components/PageHeader";
import PackagingRequestTable from "./components/PackagingRequestTable";
import type { RequestItem } from "./types";

const IssuePackagingFormPage = () => {
  const [items, setItems] = useState<RequestItem[]>([]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: uuidv4(),
        materialId: null,
        sku: "",
        name: "",
        uom: "",
        stock: 0,
        quantity: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof RequestItem,
    value: any
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div>
      <PageHeader />
      <div className="p-6">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <FormHeader />
          <PackagingRequestTable
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onItemChange={handleItemChange}
          />
        </div>
      </div>
      <ActionToolbar />
    </div>
  );
};

export default IssuePackagingFormPage;
