import React, { useState } from 'react';
import { 
  Save, 
  Trash2, 
  Plus, 
  Undo2, 
  Search, 
  FileText,
  Calendar,
  Package,
  Users,
  Settings,
  Info,
} from 'lucide-react';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importing CustomTable (Strict requirement)
import { CustomTable } from "@/components/ui/custom-table";

// Type definitions
interface DailyCuttingProps {
  initialFormId?: string;
  initialUserId?: string;
}

const DailyCutting: React.FC<DailyCuttingProps> = ({ 
  initialFormId = "LTCTDT01", 
  initialUserId = "TRINH" 
}) => {
  // State for form fields
  const [formData, setFormData] = useState({
    cutNo: "AUTO",
    cutDate: "2025-10-13",
    refNo: "",
    refDate: "2025-10-13",
    plantCode: "",
    department: "",
    jobNo: "AA2511/00423 001",
    orderType: "1",
    customer: "PUMA",
    brand: "PUMA",
    styleNo: "629567R",
    styleName: "CLOUDSPUN FLEECE 1/4 ZIP",
    workDesc: "",
    markYds: "0.00",
    markerInches: "0.00",
    station: "",
    status: "Cutted",
    table: "",
    markerNo: "",
    cutType: "",
    shipmentDate: "2025-10-31",
    layoutQty: "0.00",
    orderQty: "335.00",
    cuttingQty: "0.00",
    layers: "0",
    pieces: "0",
    width: "0.00",
    realWidth: "0.00",
    totalPerson: "0",
    radioSelection: "main"
  });

  // Handler for input changes
  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Dummy Data for CustomTable
  const tableData = [
    { no: 1, size: "S", ratio: 2 },
    { no: 2, size: "M", ratio: 4 },
    { no: 3, size: "L", ratio: 3 },
    { no: 4, size: "XL", ratio: 1 },
  ];

  const tableColumns = [
    { header: "No.", accessorKey: "no" },
    { header: "Size", accessorKey: "size" },
    { header: "Ratio", accessorKey: "ratio" },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Cutted":
        return "default";
      case "Pending":
        return "secondary";
      case "Completed":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Daily Cutting</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage daily cutting operations and tracking
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Form ID:</Label>
            <Badge variant="outline" className="bg-yellow-100 border-yellow-400 text-yellow-900 font-semibold">
              {initialFormId}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">User ID:</Label>
            <Badge variant="outline" className="bg-blue-100 border-blue-400 text-blue-900 font-semibold">
              {initialUserId}
            </Badge>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Undo2 className="h-4 w-4" />
              Reset
            </Button>
            <Button size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button variant="outline" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cutting Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cutting Information
              </CardTitle>
              <CardDescription>Basic cutting order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cutNo">Cut No.</Label>
                  <Input 
                    id="cutNo" 
                    value={formData.cutNo} 
                    readOnly 
                    className="bg-slate-100 font-semibold text-blue-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cutDate">Cut Date</Label>
                  <Input 
                    id="cutDate" 
                    type="date" 
                    value={formData.cutDate} 
                    onChange={handleInputChange("cutDate")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refNo">Reference No.</Label>
                  <Input 
                    id="refNo" 
                    value={formData.refNo} 
                    onChange={handleInputChange("refNo")}
                    placeholder="Enter reference number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refDate">Reference Date</Label>
                  <Input 
                    id="refDate" 
                    type="date" 
                    value={formData.refDate} 
                    onChange={handleInputChange("refDate")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station">Station</Label>
                  <Input 
                    id="station" 
                    value={formData.station} 
                    onChange={handleInputChange("station")}
                    placeholder="Enter station"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center h-10">
                    <Badge variant={getStatusBadgeVariant(formData.status)} className="px-3 py-1">
                      {formData.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Factory & Department */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Factory & Department
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plantCode">Plant Code</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="plantCode" 
                      value={formData.plantCode} 
                      onChange={handleInputChange("plantCode")}
                      placeholder="Plant code"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="department" 
                      value={formData.department} 
                      onChange={handleInputChange("department")}
                      placeholder="Department"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="table">Table</Label>
                  <Input 
                    id="table" 
                    value={formData.table} 
                    onChange={handleInputChange("table")}
                    placeholder="Table"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job & Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Job & Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobNo">Job No.</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="jobNo" 
                      value={formData.jobNo} 
                      onChange={handleInputChange("jobNo")}
                      className="bg-blue-50 font-semibold text-blue-900"
                    />
                    <Button variant="ghost" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Input 
                    id="orderType" 
                    value={formData.orderType} 
                    onChange={handleInputChange("orderType")}
                    className="text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input 
                    id="customer" 
                    value={formData.customer} 
                    onChange={handleInputChange("customer")}
                    className="font-semibold text-blue-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input 
                    id="brand" 
                    value={formData.brand} 
                    onChange={handleInputChange("brand")}
                    className="font-semibold text-blue-800"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="styleNo">Style Information</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="styleNo" 
                      value={formData.styleNo} 
                      onChange={handleInputChange("styleNo")}
                      className="w-48 font-medium text-blue-600"
                      placeholder="Style No"
                    />
                    <Input 
                      value={formData.styleName} 
                      readOnly 
                      className="flex-1 bg-blue-50 text-blue-800 font-semibold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="markerNo">Marker No.</Label>
                  <Input 
                    id="markerNo" 
                    value={formData.markerNo} 
                    onChange={handleInputChange("markerNo")}
                    placeholder="Marker number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cutType">Cut Type</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="cutType" 
                      value={formData.cutType} 
                      onChange={handleInputChange("cutType")}
                      placeholder="Cut type"
                    />
                    <Button variant="ghost" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Measurements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Measurements & Quantities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="markYds">Mark (Yds)</Label>
                  <Input 
                    id="markYds" 
                    type="number"
                    value={formData.markYds} 
                    onChange={handleInputChange("markYds")}
                    className="text-right font-semibold text-blue-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="markerInches">Marker (Inches)</Label>
                  <Input 
                    id="markerInches" 
                    type="number"
                    value={formData.markerInches} 
                    onChange={handleInputChange("markerInches")}
                    className="text-right font-semibold text-blue-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="layoutQty">Layout Qty</Label>
                  <Input 
                    id="layoutQty" 
                    type="number"
                    value={formData.layoutQty} 
                    readOnly
                    className="text-right font-semibold text-blue-600 bg-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderQty">Order Qty</Label>
                  <Input 
                    id="orderQty" 
                    type="number"
                    value={formData.orderQty} 
                    readOnly
                    className="text-right font-semibold bg-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuttingQty">Cutting Qty</Label>
                  <Input 
                    id="cuttingQty" 
                    type="number"
                    value={formData.cuttingQty} 
                    readOnly
                    className="text-right font-semibold text-blue-600 bg-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input 
                    id="width" 
                    type="number"
                    value={formData.width} 
                    onChange={handleInputChange("width")}
                    className="text-right font-semibold text-blue-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="realWidth">Real Width</Label>
                  <Input 
                    id="realWidth" 
                    type="number"
                    value={formData.realWidth} 
                    onChange={handleInputChange("realWidth")}
                    className="text-right font-semibold text-blue-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalPerson">Total Person</Label>
                  <Input 
                    id="totalPerson" 
                    type="number"
                    value={formData.totalPerson} 
                    onChange={handleInputChange("totalPerson")}
                    className="text-right font-semibold text-blue-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Update Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Updated By</Label>
                <Input 
                  value={initialUserId} 
                  readOnly 
                  className="bg-slate-100 text-blue-600 font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Update Date</Label>
                <Input 
                  value="13/10/2025" 
                  readOnly 
                  className="bg-slate-100 text-blue-600 font-semibold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Remarks
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Info className="h-4 w-4 mr-2" />
                Note
              </Button>
            </CardContent>
          </Card>

          {/* Shipment Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Shipment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label className="text-sm">Shipment Date</Label>
              <Input 
                type="date"
                value={formData.shipmentDate} 
                readOnly 
                className="bg-slate-100 font-semibold text-blue-800"
              />
            </CardContent>
          </Card>

          {/* Cutting Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cutting Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select defaultValue="main">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="part">Part</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Card>
        <Tabs defaultValue="size" className="w-full">
          <CardHeader className="pb-3">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="size">Size/Ratio</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="part">Part</TabsTrigger>
              <TabsTrigger value="employee">Employee</TabsTrigger>
              <TabsTrigger value="print">Print / Emb.</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="size" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Size & Ratio Details</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Copy Cut No.
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <CustomTable columns={tableColumns} data={tableData} />
              </div>
            </TabsContent>

            <TabsContent value="layout" className="py-8">
              <div className="text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Layout content will be displayed here</p>
              </div>
            </TabsContent>

            <TabsContent value="part" className="py-8">
              <div className="text-center text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Part content will be displayed here</p>
              </div>
            </TabsContent>

            <TabsContent value="employee" className="py-8">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Employee content will be displayed here</p>
              </div>
            </TabsContent>

            <TabsContent value="print" className="py-8">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Print/Embroidery content will be displayed here</p>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DailyCutting;