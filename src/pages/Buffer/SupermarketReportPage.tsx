// src/pages/SupermarketReportPage/SupermarketReportPage.tsx

import React, { useState, useMemo } from "react";
import {
  Search,
  PackageCheck,
  GitCommitHorizontal,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ProcessLocation =
  | "Supermarket"
  | "Bonding"
  | "Heat Press"
  | "Pad Print"
  | "Thêu"
  | "Buffer";

type POStatus = "Complete" | "Partially Complete" | "In Progress";
type Bundle = {
  bundleId: string;
  quantity: number;
  currentLocation: ProcessLocation;
};
type PO = { poId: string; styleId: string; color: string; bundles: Bundle[] };

const mockPOs: PO[] = [
  {
    poId: "PO-002",
    styleId: "HOODIE-RED",
    color: "Red",
    bundles: [
      { bundleId: "PO-002-B01", quantity: 50, currentLocation: "Supermarket" },
      { bundleId: "PO-002-B02", quantity: 50, currentLocation: "Supermarket" },
    ],
  },
  {
    poId: "PO-008",
    styleId: "T-SHIRT-WHT",
    color: "White",
    bundles: [
      { bundleId: "PO-008-B01", quantity: 70, currentLocation: "Supermarket" },
      { bundleId: "PO-008-B02", quantity: 30, currentLocation: "Bonding" },
      { bundleId: "PO-008-B03", quantity: 25, currentLocation: "Heat Press" },
    ],
  },
  {
    poId: "PO-011",
    styleId: "POLO-GRN",
    color: "Green",
    bundles: [
      { bundleId: "PO-011-B01", quantity: 18, currentLocation: "Heat Press" },
      { bundleId: "PO-011-B02", quantity: 22, currentLocation: "Buffer" },
    ],
  },
  {
    poId: "PO-015",
    styleId: "JACKET-BLK",
    color: "Black",
    bundles: [
      { bundleId: "PO-015-B01", quantity: 40, currentLocation: "Supermarket" },
    ],
  },
];

const processPOData = (po: PO) => {
  const totalQuantity = po.bundles.reduce((sum, b) => sum + b.quantity, 0);
  const completedQuantity = po.bundles
    .filter((b) => b.currentLocation === "Supermarket")
    .reduce((sum, b) => sum + b.quantity, 0);
  let status: POStatus;
  if (completedQuantity === 0) status = "In Progress";
  else if (completedQuantity < totalQuantity) status = "Partially Complete";
  else status = "Complete";
  return { ...po, totalQuantity, completedQuantity, status };
};

const SupermarketReportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | POStatus>("All");
  const [expandedPOIds, setExpandedPOIds] = useState<Set<string>>(new Set());

  const processedPOs = useMemo(() => {
    return mockPOs
      .map(processPOData)
      .filter(
        (po) =>
          (po.poId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            po.styleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            po.color.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (activeTab === "All" || po.status === activeTab)
      );
  }, [searchTerm, activeTab]);

  const handleToggleExpand = (poId: string) => {
    setExpandedPOIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(poId)) newSet.delete(poId);
      else newSet.add(poId);
      return newSet;
    });
  };

  const tabs: ("All" | POStatus)[] = [
    "All",
    "Complete",
    "Partially Complete",
    "In Progress",
  ];

  const getStatusBadgeVariant = (
    status: POStatus
  ): "default" | "secondary" | "destructive" => {
    if (status === "Complete") return "default";
    if (status === "Partially Complete") return "secondary";
    return "destructive";
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">
        Supermarket Inventory & Status Report
      </h1>

      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by PO, Style, Color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs
            value={activeTab}
            onValueChange={(value: string) =>
              setActiveTab(value as "All" | POStatus)
            }
          >
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>PO ID</TableHead>
              <TableHead>Style ID</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Progress (Qty)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedPOs.map((po) => {
              const isExpanded = expandedPOIds.has(po.poId);
              return (
                <React.Fragment key={po.poId}>
                  <TableRow>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleExpand(po.poId)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{po.poId}</TableCell>
                    <TableCell>{po.styleId}</TableCell>
                    <TableCell>{po.color}</TableCell>
                    <TableCell className="font-semibold">
                      {po.completedQuantity} / {po.totalQuantity}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(po.status)}>
                        {po.status === "Complete" ? (
                          <PackageCheck className="w-4 h-4 mr-1" />
                        ) : po.status === "Partially Complete" ? (
                          <GitCommitHorizontal className="w-4 h-4 mr-1" />
                        ) : (
                          <Clock className="w-4 h-4 mr-1" />
                        )}
                        {po.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="bg-muted hover:bg-muted">
                      <TableCell colSpan={6} className="p-0">
                        <div className="px-8 py-4">
                          <h4 className="text-md font-semibold mb-2">
                            Bundle Details
                          </h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Bundle ID</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Current Location</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {po.bundles.map((bundle) => (
                                <TableRow key={bundle.bundleId}>
                                  <TableCell>{bundle.bundleId}</TableCell>
                                  <TableCell>{bundle.quantity}</TableCell>
                                  <TableCell>
                                    <span
                                      className={
                                        bundle.currentLocation === "Supermarket"
                                          ? "font-medium text-green-600"
                                          : ""
                                      }
                                    >
                                      {bundle.currentLocation}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SupermarketReportPage;
