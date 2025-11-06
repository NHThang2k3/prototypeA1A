// src/pages/GarmentInspectionPage.tsx

import {
  Shirt,
  Barcode,
  CheckCircle,
  XCircle,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const defects = [
  "Stitching Error",
  "Fabric Defect",
  "Measurement Off",
  "Dirt/Stain",
  "Open Seam",
  "Accessory Issue",
];

const GarmentInspectionPage = () => {
  const [scanInfo, setScanInfo] = useState({ po: "", carton: "", garment: "" });
  const [garmentDetails, setGarmentDetails] = useState<{
    style: string;
    color: string;
    size: string;
  } | null>(null);
  const [showFailModal, setShowFailModal] = useState(false);

  const handleFetchDetails = () => {
    if (scanInfo.po && scanInfo.carton && scanInfo.garment) {
      setGarmentDetails({ style: "A-STYLE-01", color: "Black", size: "M" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Garment Inspection</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Barcode className="w-6 h-6" />
            Scan Garment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="text"
              placeholder="PO Number"
              value={scanInfo.po}
              onChange={(e) => setScanInfo({ ...scanInfo, po: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Carton ID"
              value={scanInfo.carton}
              onChange={(e) =>
                setScanInfo({ ...scanInfo, carton: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Garment #"
              value={scanInfo.garment}
              onChange={(e) =>
                setScanInfo({ ...scanInfo, garment: e.target.value })
              }
            />
            <Button onClick={handleFetchDetails}>Fetch Details</Button>
          </div>

          {garmentDetails && (
            <div className="mt-4 bg-muted p-4 rounded-md border">
              <h3 className="font-semibold">Garment Details:</h3>
              <p>
                <strong>Style:</strong> {garmentDetails.style} |{" "}
                <strong>Color:</strong> {garmentDetails.color} |{" "}
                <strong>Size:</strong> {garmentDetails.size}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {garmentDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shirt className="w-6 h-6" />
              Inspection Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {defects.map((defect) => (
                <div
                  key={defect}
                  className="grid grid-cols-5 gap-2 items-center"
                >
                  <Label className="col-span-2 text-sm">{defect}</Label>
                  <Input
                    type="number"
                    placeholder="Qty"
                    min="0"
                    className="col-span-1"
                  />
                  <Button
                    variant="outline"
                    className="col-span-2 flex items-center justify-center gap-2 text-sm"
                  >
                    <Camera className="w-4 h-4" /> Add Photo
                  </Button>
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            <div className="flex justify-center gap-4">
              <Dialog open={showFailModal} onOpenChange={setShowFailModal}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="flex items-center gap-2 font-bold text-lg"
                  >
                    <XCircle /> Fail
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <AlertTriangle className="w-10 h-10 text-yellow-500" />
                      <span className="text-2xl">
                        Inspection Failed: 1st Time
                      </span>
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                      This garment has failed the initial inspection. Please
                      provide comments and submit to notify the QAM for a
                      decision.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <Label htmlFor="comments" className="mb-1">
                      Comments
                    </Label>
                    <Textarea
                      id="comments"
                      rows={4}
                      placeholder="Describe the issue..."
                    />
                  </div>
                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowFailModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setShowFailModal(false)}>
                      Submit to QAM
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                size="lg"
                className="flex items-center gap-2 bg-green-600 text-white font-bold hover:bg-green-700 text-lg"
              >
                <CheckCircle /> Pass
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GarmentInspectionPage;
