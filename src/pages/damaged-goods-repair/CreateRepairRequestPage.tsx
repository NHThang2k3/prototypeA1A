// src/pages/damaged-goods-repair/CreateRepairRequestPage.tsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UploadCloud, X, Save, Ban } from "lucide-react";

const CreateRepairRequestPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previewsArray]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((file, index) => {
      formData.append(`image${index}`, file);
    });
    console.log("Form submitted with", images.length, "images.");
    alert(
      `Repair Request Submitted with ${images.length} image(s) for Approval!`
    );
    navigate("/decoration/productivity/display-data-list");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200"
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Create New Repair Request
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            General Information
          </h2>
          <div>
            <label
              htmlFor="poCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              PO / Job Code
            </label>
            <input
              type="text"
              id="poCode"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="productInfo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product, Color
            </label>
            <input
              type="text"
              id="productInfo"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
              readOnly
              value="Auto-filled based on PO"
            />
          </div>
          <div>
            <label
              htmlFor="defectProcess"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Defect Found At (Process)
            </label>
            <select
              id="defectProcess"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a process</option>
              <option value="Bonding">Bonding</option>
              <option value="Embroidery">Embroidery</option>
              <option value="Heat Press">Heat Press</option>
              <option value="QC Endline">QC Endline</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="discoveryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Discovery Date
            </label>
            <input
              type="date"
              id="discoveryDate"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              defaultValue={new Date().toISOString().substring(0, 10)}
              required
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Defect Details
          </h2>
          <div>
            <label
              htmlFor="reworkQty"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity to Rework
            </label>
            <input
              type="number"
              id="reworkQty"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
              min="1"
            />
          </div>
          <div>
            <label
              htmlFor="defectType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Defect Type
            </label>
            <select
              id="defectType"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a defect type</option>
              <option value="DEF-01">DEF-01: In lem</option>
              <option value="DEF-02">DEF-02: Thêu sai chỉ</option>
              <option value="DEF-03">DEF-03: Ép bong tróc</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Detailed Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Example: Logo is skewed 1cm to the right..."
            ></textarea>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Attach Images
        </h2>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <UploadCloud
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8 flex justify-end gap-4 border-t pt-6">
        <Link
          to="/decoration/productivity/display-data-list"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <Ban className="w-4 h-4" />
          Cancel
        </Link>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
        >
          <Save className="w-4 h-4" />
          Save as Draft
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Save & Submit for Approval
        </button>
      </div>
    </form>
  );
};

export default CreateRepairRequestPage;
