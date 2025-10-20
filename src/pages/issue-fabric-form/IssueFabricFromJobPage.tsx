// Path: src/pages/issue-fabric-form/IssueFabricFromJobPage.tsx

import { useState } from "react";
import type { CuttingPlanJob, SelectedInventoryRoll } from "./types";
import PageHeader from "./components/PageHeader";
import ActionToolbar from "./components/ActionToolbar";
import CuttingPlanSelection from "./components/CuttingPlanSelection";
import JobDetails from "./components/JobDetails";
import InventoryTable from "./components/InventoryTable";

const IssueFabricFromJobPage = () => {
  const [selectedJob, setSelectedJob] = useState<CuttingPlanJob | null>(null);
  const [selectedRolls, setSelectedRolls] = useState<SelectedInventoryRoll[]>(
    []
  );

  const handleJobSelect = (job: CuttingPlanJob) => {
    setSelectedJob(job);
    setSelectedRolls([]); // Reset danh sách vải đã chọn khi đổi JOB
  };

  const handleClearJob = () => {
    setSelectedJob(null);
    setSelectedRolls([]);
  };

  const handleSelectionChange = (rolls: SelectedInventoryRoll[]) => {
    setSelectedRolls(rolls);
  };

  // Tính tổng số yard đang được chọn để xuất
  const totalIssuedYards = selectedRolls.reduce(
    (sum, roll) => sum + roll.issuedYards,
    0
  );

  const handleSubmit = () => {
    if (!selectedJob) {
      alert("Please select a JOB first.");
      return;
    }
    if (selectedRolls.length === 0) {
      alert("Please select at least one fabric roll to issue.");
      return;
    }
    if (totalIssuedYards === 0) {
      alert(
        "Please enter the quantity (yards) to issue for the selected rolls."
      );
      return;
    }

    const submissionData = {
      job: selectedJob.JOB,
      style: selectedJob.Style,
      itemCode: selectedJob.ItemCode,
      issuedRolls: selectedRolls.map((roll) => ({
        QRCode: roll.QRCode,
        RollNo: roll.RollNo,
        Location: roll.Location,
        issuedYards: roll.issuedYards,
      })),
      totalIssuedYards: totalIssuedYards.toFixed(2),
    };

    console.log("Submitting Data:", submissionData);
    alert("Fabric issued successfully! Check the console for details.");

    // Reset state
    setSelectedJob(null);
    setSelectedRolls([]);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="Issue Fabric From Cutting Plan" />
      <div className="max-w-screen-2xl mx-auto">
        {!selectedJob ? (
          <CuttingPlanSelection onJobSelect={handleJobSelect} />
        ) : (
          <div>
            {/* Truyền totalIssuedYards vào JobDetails */}
            <JobDetails
              job={selectedJob}
              onClearJob={handleClearJob}
              currentlyIssuingYards={totalIssuedYards}
            />
            <InventoryTable
              itemCode={selectedJob.ItemCode}
              color={selectedJob.Color}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        )}
      </div>
      <ActionToolbar onSubmit={handleSubmit} />
    </div>
  );
};

export default IssueFabricFromJobPage;
