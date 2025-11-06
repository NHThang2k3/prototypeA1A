// src/pages/damaged-goods-repair/CreateRepairRequestPage.tsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UploadCloud, X, Save, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    console.log("Form submitted with", images.length, "images.");
    alert(
      `Repair Request Submitted with ${images.length} image(s) for Approval!`
    );
    navigate("/decoration/productivity/display-data-list");
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Repair Request</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">
                General Information
              </h2>
              <div className="space-y-2">
                <Label htmlFor="poCode">PO / Job Code</Label>
                <Input type="text" id="poCode" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productInfo">Product, Color</Label>
                <Input
                  type="text"
                  id="productInfo"
                  readOnly
                  value="Auto-filled based on PO"
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defectProcess">Defect Found At (Process)</Label>
                <Select required>
                  <SelectTrigger id="defectProcess">
                    <SelectValue placeholder="Select a process" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bonding">Bonding</SelectItem>
                    <SelectItem value="Embroidery">Embroidery</SelectItem>
                    <SelectItem value="Heat Press">Heat Press</SelectItem>
                    <SelectItem value="QC Endline">QC Endline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discoveryDate">Discovery Date</Label>
                <Input
                  type="date"
                  id="discoveryDate"
                  defaultValue={new Date().toISOString().substring(0, 10)}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Defect Details
              </h2>
              <div className="space-y-2">
                <Label htmlFor="reworkQty">Quantity to Rework</Label>
                <Input type="number" id="reworkQty" required min="1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defectType">Defect Type</Label>
                <Select required>
                  <SelectTrigger id="defectType">
                    <SelectValue placeholder="Select a defect type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEF-01">DEF-01: In lem</SelectItem>
                    <SelectItem value="DEF-02">DEF-02: Thêu sai chỉ</SelectItem>
                    <SelectItem value="DEF-03">DEF-03: Ép bong tróc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Example: Logo is skewed 1cm to the right..."
                />
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
                  <Label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                  >
                    <span>Upload files</span>
                    <Input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </Label>
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
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link to="/decoration/productivity/display-data-list">
              <Ban className="w-4 h-4 mr-2" />
              Cancel
            </Link>
          </Button>
          <Button variant="secondary" type="button">
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button type="submit">Save & Submit for Approval</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateRepairRequestPage;
