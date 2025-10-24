import React, { useState, useEffect, useMemo } from "react";
import type {
  CuttingPlanJob,
  InventoryRoll,
  SelectedInventoryRoll,
} from "./types";
import {
  getCuttingPlanJobs,
  getInventoryByItem,
  getInventoryByItemCode,
} from "./data";
import {
  PlusCircleIcon,
  TrashIcon,
  PlayIcon,
  ArrowRightCircleIcon, // Thêm icon mới
} from "@heroicons/react/24/solid";

// --- MAIN COMPONENT ---
const IssueFabricFromJobPage: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [allJobs, setAllJobs] = useState<CuttingPlanJob[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [selectedRolls, setSelectedRolls] = useState<SelectedInventoryRoll[]>(
    []
  );
  const [availableInventoryRolls, setAvailableInventoryRolls] = useState<
    InventoryRoll[]
  >([]);
  const [shortageInfo, setShortageInfo] = useState<{
    itemCode: string;
    color: string;
    shortageYards: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false); // State cho nút Finish

  // --- DERIVED STATE & CALCULATIONS (useMemo for optimization) ---

  const selectedJobs = useMemo(() => {
    return allJobs.filter((job) => selectedJobIds.has(job.ID));
  }, [allJobs, selectedJobIds]);

  const fabricRequirements = useMemo(() => {
    const requirements = new Map<
      string,
      { itemCode: string; color: string; requiredYards: number }
    >();
    selectedJobs.forEach((job) => {
      const key = `${job.ItemCode}-${job.Color}`;
      const existing = requirements.get(key) || {
        itemCode: job.ItemCode,
        color: job.Color,
        requiredYards: 0,
      };
      existing.requiredYards += job.RequestQuantity;
      requirements.set(key, existing);
    });
    return Array.from(requirements.values());
  }, [selectedJobs]);

  const totalIssuedYards = useMemo(() => {
    return selectedRolls.reduce(
      (sum, roll) => sum + (roll.issuedYards || 0),
      0
    );
  }, [selectedRolls]);

  const totalRequiredYards = useMemo(() => {
    return fabricRequirements.reduce((sum, req) => sum + req.requiredYards, 0);
  }, [fabricRequirements]);

  // --- LOGIC & SIDE EFFECTS (useEffect) ---

  useEffect(() => {
    if (fabricRequirements.length === 0) {
      setSelectedRolls([]);
      setAvailableInventoryRolls([]);
      setShortageInfo(null);
      return;
    }

    const processFabricRequest = async () => {
      setIsLoading(true);
      setShortageInfo(null);

      const mainRequirement = fabricRequirements[0];
      if (!mainRequirement) {
        setIsLoading(false);
        return;
      }

      const { itemCode, color, requiredYards } = mainRequirement;
      const allMatchingRolls = await getInventoryByItem(itemCode, color);
      const sortedRolls = [...allMatchingRolls].sort(
        (a, b) => a.BalanceYards - b.BalanceYards
      );

      const autoSelected: SelectedInventoryRoll[] = [];
      let yardsToFulfill = requiredYards;
      for (const roll of sortedRolls) {
        if (yardsToFulfill <= 0) break;
        const yardsToIssue = Math.min(roll.BalanceYards, yardsToFulfill);
        autoSelected.push({ ...roll, issuedYards: yardsToIssue });
        yardsToFulfill -= yardsToIssue;
      }
      setSelectedRolls(autoSelected);

      const selectedQRCodes = new Set(autoSelected.map((r) => r.QRCode));
      let availableRolls = allMatchingRolls.filter(
        (r) => !selectedQRCodes.has(r.QRCode)
      );

      if (yardsToFulfill > 0) {
        setShortageInfo({ itemCode, color, shortageYards: yardsToFulfill });
        const allItemRolls = await getInventoryByItemCode(itemCode);
        const currentQRCodes = new Set(allMatchingRolls.map((r) => r.QRCode));
        const substituteRolls = allItemRolls.filter(
          (r) => !currentQRCodes.has(r.QRCode)
        );
        availableRolls = [...availableRolls, ...substituteRolls];
      }

      setAvailableInventoryRolls(availableRolls);
      setIsLoading(false);
    };

    processFabricRequest();
  }, [fabricRequirements]);

  // --- HANDLER FUNCTIONS ---

  const handleUploadKanban = () => {
    setIsUploading(true);
    setSelectedJobIds(new Set());
    getCuttingPlanJobs().then((data) => {
      setAllJobs(data.filter((job) => job.Status !== "Completed"));
      setIsUploading(false);
    });
  };

  const handleJobSelectionChange = (jobId: string, isSelected: boolean) => {
    setSelectedJobIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) newSet.add(jobId);
      else newSet.delete(jobId);
      return newSet;
    });
  };

  const handleIssuedYardsChange = (qrCode: string, newYards: number) => {
    setSelectedRolls((prevRolls) =>
      prevRolls.map((roll) => {
        if (roll.QRCode === qrCode) {
          const validatedYards = Math.max(
            0,
            Math.min(newYards, roll.BalanceYards)
          );
          return { ...roll, issuedYards: validatedYards };
        }
        return roll;
      })
    );
  };

  const handleAddRollFromInventory = (rollToAdd: InventoryRoll) => {
    setSelectedRolls((prev) => [
      ...prev,
      { ...rollToAdd, issuedYards: rollToAdd.BalanceYards },
    ]);
    setAvailableInventoryRolls((prev) =>
      prev.filter((r) => r.QRCode !== rollToAdd.QRCode)
    );
  };

  const handleRemoveSelectedRoll = (rollToRemove: SelectedInventoryRoll) => {
    setSelectedRolls((prev) =>
      prev.filter((r) => r.QRCode !== rollToRemove.QRCode)
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { issuedYards, ...originalRoll } = rollToRemove;
    setAvailableInventoryRolls((prev) =>
      [...prev, originalRoll].sort((a, b) => a.RollNo.localeCompare(b.RollNo))
    );
  };

  // Hàm xử lý khi nhấn nút Finish
  const handleFinishIssuance = () => {
    const shortage = totalRequiredYards - totalIssuedYards;
    if (shortage > 0) {
      if (
        !window.confirm(
          `Cảnh báo: Đang cấp phát thiếu ${shortage.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })} yds.\nBạn có chắc chắn muốn tiếp tục?`
        )
      ) {
        return; // User nhấn Cancel
      }
    }

    setIsFinishing(true);
    console.log("--- BẮT ĐẦU QUÁ TRÌNH CẤP PHÁT ---");
    console.log("Các JOB được chọn:", selectedJobs);
    console.log("Các cuộn vải được cấp phát:", selectedRolls);
    console.log("Tổng yêu cầu:", totalRequiredYards);
    console.log("Tổng cấp phát:", totalIssuedYards);

    // Mô phỏng API call mất 2 giây
    setTimeout(() => {
      alert("Cấp phát vải thành công!");

      // Reset state để chuẩn bị cho lần làm việc tiếp theo
      setAllJobs([]);
      setSelectedJobIds(new Set());
      setSelectedRolls([]);
      setAvailableInventoryRolls([]);
      setShortageInfo(null);
      setIsFinishing(false);
    }, 2000);
  };

  // --- RENDER ---

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Issue Fabric From JOB
        </h1>
        <p className="text-gray-600">
          Upload a Kanban file, select JOBs, and the system will automatically
          propose fabric from inventory.
        </p>
      </header>

      {/* Upload and JOBs Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            1. Select JOBs to Issue Fabric
          </h2>
          <button
            onClick={handleUploadKanban}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          >
            <PlayIcon className="h-5 w-5" />
            {isUploading ? "Uploading..." : "Upload Kanban from Excel"}
          </button>
        </div>

        {allJobs.length > 0 ? (
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 w-12">Select</th>
                  <th className="px-4 py-3">JOB</th>
                  <th className="px-4 py-3">Item Code</th>
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Required Qty</th>
                  <th className="px-4 py-3">Style</th>
                </tr>
              </thead>
              <tbody>
                {allJobs.map((job) => (
                  <tr
                    key={job.ID}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedJobIds.has(job.ID)}
                        onChange={(e) =>
                          handleJobSelectionChange(job.ID, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {job.JOB}
                    </td>
                    <td className="px-4 py-2">{job.ItemCode}</td>
                    <td className="px-4 py-2">{job.Color}</td>
                    <td className="px-4 py-2 font-semibold">
                      {job.RequestQuantity.toLocaleString()} yds
                    </td>
                    <td className="px-4 py-2">{job.Style}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Please upload a Kanban file to start.
          </p>
        )}
      </div>

      {/* Summary & Fabric Tables Section */}
      {selectedJobIds.size > 0 && (
        <>
          {/* Summary Panel */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-8 sticky top-0 z-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              2. Review and Issue Fabric
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800 font-medium">
                  Total Required
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalRequiredYards.toLocaleString()} yds
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-green-800 font-medium">
                  Total Selected
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {totalIssuedYards.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  yds
                </p>
              </div>
              <div
                className={`p-3 rounded-md ${
                  totalIssuedYards < totalRequiredYards
                    ? "bg-red-50"
                    : "bg-green-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    totalIssuedYards < totalRequiredYards
                      ? "text-red-800"
                      : "text-green-800"
                  }`}
                >
                  {totalIssuedYards < totalRequiredYards
                    ? "Shortage"
                    : "Surplus"}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    totalIssuedYards < totalRequiredYards
                      ? "text-red-900"
                      : "text-green-900"
                  }`}
                >
                  {(totalRequiredYards - totalIssuedYards).toLocaleString(
                    undefined,
                    { maximumFractionDigits: 2 }
                  )}{" "}
                  yds
                </p>
              </div>
            </div>
            {isLoading && (
              <p className="text-center text-blue-600 mt-4">
                Searching inventory...
              </p>
            )}

            {/* --- THÊM NÚT FINISH TẠI ĐÂY --- */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleFinishIssuance}
                disabled={selectedRolls.length === 0 || isFinishing}
                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRightCircleIcon className="h-5 w-5" />
                {isFinishing ? "Processing..." : "Finish Issuance"}
              </button>
            </div>
          </div>

          {/* 2-Column Layout: Selected Rolls vs. Available Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: SELECTED ROLLS */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Selected Rolls for Issuance
              </h3>
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-3">Roll No</th>
                      <th className="px-3 py-3">Color</th>
                      <th className="px-3 py-3">Lot No</th>
                      <th className="px-3 py-3">Balance (yds)</th>
                      <th className="px-3 py-3">Issue (yds)</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRolls.map((roll) => (
                      <tr
                        key={roll.QRCode}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 font-medium">{roll.RollNo}</td>
                        <td className="px-3 py-2">{roll.Color}</td>
                        <td className="px-3 py-2">{roll.LotNo}</td>
                        <td className="px-3 py-2">
                          {roll.BalanceYards.toLocaleString()}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={roll.issuedYards}
                            onChange={(e) =>
                              handleIssuedYardsChange(
                                roll.QRCode,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24 p-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            max={roll.BalanceYards}
                            step="0.1"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleRemoveSelectedRoll(roll)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {selectedRolls.length === 0 && !isLoading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          No rolls have been selected.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT COLUMN: AVAILABLE INVENTORY */}
            <div
              className={`bg-white p-6 rounded-lg shadow-md transition-all ${
                shortageInfo ? "border-2 border-dashed border-orange-400" : ""
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  shortageInfo ? "text-orange-800" : "text-gray-800"
                }`}
              >
                {shortageInfo
                  ? `Shortage! Select Substitute Rolls (Item: ${shortageInfo.itemCode})`
                  : `Available Inventory (Item: ${
                      fabricRequirements[0]?.itemCode || "N/A"
                    })`}
              </h3>
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead
                    className={`text-xs text-gray-700 uppercase sticky top-0 ${
                      shortageInfo ? "bg-orange-50" : "bg-gray-100"
                    }`}
                  >
                    <tr>
                      <th className="px-3 py-3">In-House Date</th>
                      <th className="px-3 py-3">Roll No</th>
                      <th className="px-3 py-3">Color</th>
                      <th className="px-3 py-3">Lot No</th>
                      <th className="px-3 py-3">Available (yds)</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableInventoryRolls.map((roll) => (
                      <tr
                        key={roll.QRCode}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-3 py-2">{roll.DateInHouse}</td>
                        <td className="px-3 py-2 font-medium">{roll.RollNo}</td>
                        <td
                          className={`px-3 py-2 ${
                            roll.Color !== fabricRequirements[0]?.color
                              ? "text-orange-600 font-semibold"
                              : ""
                          }`}
                        >
                          {roll.Color}
                        </td>
                        <td className="px-3 py-2">{roll.LotNo}</td>
                        <td className="px-3 py-2 font-semibold">
                          {roll.BalanceYards.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleAddRollFromInventory(roll)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <PlusCircleIcon className="h-6 w-6" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {availableInventoryRolls.length === 0 && !isLoading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          No other rolls available in inventory.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IssueFabricFromJobPage;
