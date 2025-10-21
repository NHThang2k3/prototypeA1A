// src/pages/bundle-management/components/UpdateJobModal.tsx
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Job } from "../types";

type UpdateJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onSave: (updatedJob: Job) => void;
};

const UpdateJobModal = ({
  isOpen,
  onClose,
  job,
  onSave,
}: UpdateJobModalProps) => {
  const [formData, setFormData] = useState<Partial<Job>>({});

  useEffect(() => {
    if (job) {
      setFormData({
        requireDate: job.requireDate,
        shipmentDate: job.shipmentDate,
        sumQty: job.sumQty,
        styleDesc: job.styleDesc,
      });
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sumQty" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...job, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Update Job: {job.jobNo}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <main className="p-6 space-y-4">
            <div>
              <label
                htmlFor="requireDate"
                className="block text-sm font-medium text-gray-700"
              >
                Require Date
              </label>
              <input
                type="text"
                name="requireDate"
                id="requireDate"
                value={formData.requireDate || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="shipmentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Shipment Date
              </label>
              <input
                type="text"
                name="shipmentDate"
                id="shipmentDate"
                value={formData.shipmentDate || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="sumQty"
                className="block text-sm font-medium text-gray-700"
              >
                SUM QTY
              </label>
              <input
                type="number"
                name="sumQty"
                id="sumQty"
                value={formData.sumQty || 0}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="styleDesc"
                className="block text-sm font-medium text-gray-700"
              >
                Style Description
              </label>
              <textarea
                name="styleDesc"
                id="styleDesc"
                value={formData.styleDesc || ""}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </main>
          <footer className="flex justify-end items-center p-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-100 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default UpdateJobModal;
