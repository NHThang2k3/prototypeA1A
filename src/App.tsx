// Path: src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Layouts
import FabricWarehouseLayout from "./layouts/FabricWarehouseLayout";
import AccessoryWarehouseLayout from "./layouts/AccessoryWarehouseLayout";
import PackagingWarehouseLayout from "./layouts/PackagingWarehouseLayout";
import BufferAndSupermarketLayout from "./layouts/BufferAndSupermarketLayout";
import SewingLineLayout from "./layouts/SewingLineLayout";
import FinishedGoodsWarehouseLayout from "./layouts/FinishedGoodsWarehouseLayout";
import DecorationLayout from "./layouts/DecorationLayout";

// Import Pages
import HomePage from "./pages/home/HomePage";
import InboundDashboardPage from "./pages/inbound-dashboard/InboundDashboardPage";
import InventoryListPage from "./pages/inventory-list/InventoryListPage";
import KanbanBoardPage from "./pages/kanban-board/KanbanBoardPage";
import LocationManagementPage from "./pages/location-management/LocationManagementPage";
import QRScanInterfacePage from "./pages/qr-scan/QRScanInterfacePage";
import IssueFabricFormPage from "./pages/issue-fabric-form/IssueFabricFromJobPage";
import IssueAccessoryFormPage from "./pages/issue-accessory-form/IssueAccessoryFormPage";
import IssuePackagingFormPage from "./pages/issue-packaging-form/IssuePackagingFormPage";
import IssueTransactionReportsPage from "./pages/issue-transaction-reports/IssueTransactionReportsPage";
import PackingListManagementPage from "./pages/packing-list-management/PackingListManagementPage";
import AccessoryInventoryListPage from "./pages/accessory-inventory-list/AccessoryInventoryListPage";
import SewingTrimsKanbanPage from "./pages/sewing-trims-kanban/SewingTrimsKanbanPage";
import PackagingInventoryListPage from "./pages/packaging-inventory-list/PackagingInventoryListPage";
import AccessoryIssueTransactionReportsPage from "./pages/accessory-issue-transaction-reports/AccessoryIssueTransactionReportsPage";
import PackagingIssueTransactionReportsPage from "./pages/packaging-issue-transaction-reports/PackagingIssueTransactionReportsPage";
import CuttingLayout from "./layouts/CuttingLayout";
import MasterPlanPage from "./pages/master-plan/MasterPlanPage";
import BundleManagementPage from "./pages/bundle-management/BundleManagementPage";
import CuttingDashboardPerformance from "./pages/cutting-dashboard-performance/CuttingDashboardPerformance";
import AuditLogPage from "./pages/audit-log/AuditLogPage";
import FactoryLayout from "./layouts/FactoryLayout";
import WeeklyDailyPlanPage from "./pages/WeeklyDailyPlanPage/WeeklyDailyPlanPage";
import WorkPlanPage from "./pages/WorkPlanPage/WorkPlanPage";
import BufferScanInPage from "./pages/BufferScanInPage/BufferScanInPage";
import BufferScanOutPage from "./pages/BufferScanOutPage/BufferScanOutPage";
import DecorationDashboardPage from "./pages/DecorationDashboardPage/DecorationDashboardPage";
import ActionPlanPage from "./pages/ActionPlanPage/ActionPlanPage";
import MachineLocationPage from "./pages/MachineLocationPage/MachineLocationPage";
import KanbanReportPage from "./pages/KanbanReportPage/KanbanReportPage";
import BufferScanPage from "./pages/BufferScanPage/BufferScanPage";
import BufferReportPage from "./pages/BufferReportPage/BufferReportPage";
import SupermarketScanPage from "./pages/SupermarketScanPage/SupermarketScanPage";
import SupermarketReportPage from "./pages/SupermarketReportPage/SupermarketReportPage";
import WipDashboardPage from "./pages/WipDashboardPage/WipDashboardPage";
import ProductionPlanPage from "./pages/ProductionPlanPage/ProductionPlanPage";
import KanbanMonitoringPage from "./pages/KanbanMonitoringPage/KanbanMonitoringPage";
import EFFDashboardPage from "./pages/EFFDashboardPage/EFFDashboardPage";
import ManageWorkforcePage from "./pages/ManageWorkforcePage/ManageWorkforcePage";
import QualityDashboardPage from "./pages/QualityDashboardPage/QualityDashboardPage";
import UploadPackingPlanPage from "./pages/UploadPackingPlanPage/UploadPackingPlanPage";
import PackingPlanReportPage from "./pages/PackingPlanReportPage/PackingPlanReportPage";
import UploadPlanloadPage from "./pages/UploadPlanloadPage/UploadPlanloadPage";
import FgWhMonitoringReportPage from "./pages/FgWhMonitoringReportPage/FgWhMonitoringReportPage";
import SampleInspectionPage from "./pages/SampleInspectionPage/SampleInspectionPage";
import GarmentInspectionPage from "./pages/GarmentInspectionPage/GarmentInspectionPage";
import IncentiveCalculationPage from "./pages/IncentiveCalculationPage/IncentiveCalculationPage";
import SkillMatrixPage from "./pages/SkillMatrixPage/SkillMatrixPage";
import TPMDashboardPage from "./pages/TPMDashboardPage/TPMDashboardPage";
import ConsolidatedReportPage from "./pages/ConsolidatedReportPage/ConsolidatedReportPage";
import ToolManagementPage from "./pages/ToolManagementPage/ToolManagementPage";
import BondingOutputPage from "./pages/BondingOutputPage/BondingOutputPage";
import ToolStatusDashboardPage from "./pages/ToolStatusDashboardPage/ToolStatusDashboardPage";
import EMSPage from "./pages/EMSPage/EMSPage";
import CuttingWeeklyDailyPlanPage from "./pages/CuttingWeeklyDailyPlanPage/CuttingWeeklyDailyPlanPage";
import OverallDashboardPage from "./pages/overall-dashboard/OverallDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route chính để chọn module */}
        <Route path="/" element={<HomePage />} />

        {/* === Module Kho Vải === */}
        <Route path="/fabric-warehouse" element={<FabricWarehouseLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InboundDashboardPage />} />
          <Route path="inventory" element={<InventoryListPage />} />
          <Route path="kanban" element={<KanbanBoardPage />} />
          <Route path="locations" element={<LocationManagementPage />} />
          <Route path="qr-scan" element={<QRScanInterfacePage />} />
          <Route path="issue/fabric" element={<IssueFabricFormPage />} />
          <Route
            path="reports/issues"
            element={<IssueTransactionReportsPage />}
          />
          <Route path="packing-list" element={<PackingListManagementPage />} />
          <Route path="audit-log" element={<AuditLogPage />} />
        </Route>

        {/* === Module Kho Phụ Liệu (Ví dụ) === */}
        <Route
          path="/accessory-warehouse"
          element={<AccessoryWarehouseLayout />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InboundDashboardPage />} />
          <Route path="inventory" element={<AccessoryInventoryListPage />} />
          <Route path="kanban" element={<SewingTrimsKanbanPage />} />
          <Route path="locations" element={<LocationManagementPage />} />
          <Route path="qr-scan" element={<QRScanInterfacePage />} />
          <Route path="issue/accessory" element={<IssueAccessoryFormPage />} />
          <Route
            path="reports/issues"
            element={<AccessoryIssueTransactionReportsPage />}
          />
        </Route>

        {/* === Module Kho Đóng Gói (Ví dụ) === */}
        <Route
          path="/packaging-warehouse"
          element={<PackagingWarehouseLayout />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InboundDashboardPage />} />
          <Route path="inventory" element={<PackagingInventoryListPage />} />
          <Route path="kanban" element={<KanbanBoardPage />} />
          <Route path="locations" element={<LocationManagementPage />} />
          <Route path="qr-scan" element={<QRScanInterfacePage />} />
          <Route path="issue/packaging" element={<IssuePackagingFormPage />} />
          <Route
            path="reports/issues"
            element={<PackagingIssueTransactionReportsPage />}
          />
        </Route>

        {/* === Module Cutting === */}
        <Route path="/cutting" element={<CuttingLayout />}>
          <Route
            index
            element={<Navigate to="planning/master-plan" replace />}
          />
          <Route
            path="dashboard/cutting-dashboard-performance"
            element={<CuttingDashboardPerformance />}
          />
          <Route path="planning/master-plan" element={<MasterPlanPage />} />
          <Route
            path="planning/cutting-daily-weekly"
            element={<CuttingWeeklyDailyPlanPage />}
          />
          <Route
            path="bundle-data/bundle-management"
            element={<BundleManagementPage />}
          />
          <Route path="quality/action-plan" element={<ActionPlanPage />} />
          <Route
            path="availability/tool-management"
            element={<ToolManagementPage />}
          />
        </Route>

        {/* === Module Decoration (CẬP NHẬT) === */}
        <Route path="/decoration" element={<DecorationLayout />}>
          <Route
            index
            element={<Navigate to="productivity/master-plan" replace />}
          />
          {/* Productivity Routes */}
          <Route path="productivity/master-plan" element={<MasterPlanPage />} />
          <Route
            path="productivity/weekly-daily-plan"
            element={<WeeklyDailyPlanPage />}
          />
          <Route path="productivity/work-plan" element={<WorkPlanPage />} />
          <Route
            path="productivity/bonding-opl"
            element={<div>Bonding OPL & Plan Page (Reuse)</div>} // Giữ lại placeholder
          />
          <Route
            path="productivity/buffer-scan-in"
            element={<BufferScanInPage />}
          />
          <Route
            path="productivity/buffer-scan-out"
            element={<BufferScanOutPage />}
          />
          <Route
            path="productivity/record-output"
            element={<div>Record Output Page (Reuse)</div>} // Có thể tái sử dụng
          />
          <Route
            path="productivity/stats-heat"
            element={<div>Statistics and Reports Page (Reuse)</div>} // Dùng component chung
          />
          <Route
            path="productivity/stats-emb"
            element={<div>Statistics and Reports Page (Reuse)</div>} // Dùng component chung
          />
          <Route
            path="productivity/stats-pad-print"
            element={<div>Statistics and Reports Page (Reuse)</div>} // Dùng component chung
          />
          <Route
            path="productivity/bonding-output"
            element={<BondingOutputPage />}
          />
          <Route
            path="productivity/decoration-dashboard"
            element={<DecorationDashboardPage />}
          />
          <Route
            path="productivity/bonding-dashboard"
            element={<DecorationDashboardPage />} // Có thể tái sử dụng
          />

          {/* Quality Routes */}
          <Route
            path="quality/qc-inline"
            element={<div>QC Inline Page (Reuse)</div>}
          />
          <Route
            path="quality/qc-endline"
            element={<div>QC Endline Page (Reuse)</div>}
          />
          <Route path="quality/action-plan" element={<ActionPlanPage />} />

          {/* Availability Routes */}
          <Route
            path="availability/machine-downtime"
            element={<div>Machine Downtime Page (Reuse)</div>}
          />
          <Route
            path="availability/machine-location"
            element={<MachineLocationPage />}
          />
        </Route>

        {/* === Module Buffer & Supermarket (ĐÃ CẬP NHẬT) === */}
        <Route
          path="/buffer-supermarket"
          element={<BufferAndSupermarketLayout />}
        >
          <Route
            index
            element={<Navigate to="productivity/kanban-report" replace />}
          />
          <Route
            path="productivity/kanban-report"
            element={<KanbanReportPage />}
          />
          <Route path="productivity/buffer-scan" element={<BufferScanPage />} />
          <Route
            path="productivity/buffer-report"
            element={<BufferReportPage />}
          />
          <Route
            path="productivity/supermarket-scan"
            element={<SupermarketScanPage />}
          />
          <Route
            path="productivity/supermarket-report"
            element={<SupermarketReportPage />}
          />
          <Route
            path="productivity/wip-dashboard"
            element={<WipDashboardPage />}
          />
        </Route>

        {/* === Module Sewing Line (MỚI) === */}
        <Route path="/sewing-line" element={<SewingLineLayout />}>
          <Route
            index
            element={<Navigate to="productivity/production-plan" replace />}
          />
          {/* Productivity Routes */}
          <Route
            path="productivity/production-plan"
            element={<ProductionPlanPage />}
          />
          <Route
            path="productivity/kanban-monitoring"
            element={<KanbanMonitoringPage />}
          />
          <Route
            path="productivity/eff-dashboard"
            element={<EFFDashboardPage />}
          />
          <Route
            path="productivity/po-monitoring"
            element={<div>PO Monitoring Page (Reuse)</div>}
          />
          <Route
            path="productivity/output-scanning"
            element={<div>Output Scanning Page (Reuse)</div>}
          />
          <Route
            path="productivity/performance-monitoring"
            element={<ConsolidatedReportPage />}
          />
          <Route
            path="productivity/line-dashboard"
            element={<ConsolidatedReportPage />}
          />
          <Route
            path="productivity/f2s-delivery"
            element={<div>F2S Delivery Page (Reuse)</div>}
          />
          <Route
            path="productivity/wip-dashboard"
            element={<WipDashboardPage />}
          />

          {/* Quality Routes */}
          <Route
            path="quality/qc-inline"
            element={<div>QC Inline Page (Reuse)</div>}
          />
          <Route
            path="quality/qc-endline"
            element={<div>QC Endline Page (Reuse)</div>}
          />
          <Route
            path="quality/traffic-light"
            element={<div>Traffic Light Page (Reuse)</div>}
          />
          <Route path="quality/dashboard" element={<QualityDashboardPage />} />
          <Route
            path="quality/scrap-report"
            element={<div>Scrap Report Page (Reuse)</div>}
          />
          <Route path="quality/action-plan" element={<ActionPlanPage />} />

          {/* Availability Routes */}
          <Route
            path="availability/machine-performance"
            element={<div>Machine Performance Page (Reuse)</div>}
          />
          <Route
            path="availability/tpm-checklist"
            element={<div>TPM Checklist Page (Reuse)</div>}
          />
          <Route
            path="availability/tool-status"
            element={<ToolStatusDashboardPage />}
          />
          <Route path="availability/ems" element={<EMSPage />} />
          <Route
            path="availability/tpm-dashboard"
            element={<TPMDashboardPage />}
          />
          <Route
            path="availability/change-over"
            element={<div>Change Over Page (Reuse)</div>}
          />

          {/* Ability Routes */}
          <Route
            path="ability/incentive"
            element={<IncentiveCalculationPage />}
          />
          <Route
            path="ability/stw-checklist"
            element={<div>STW Checklist Page (Reuse)</div>}
          />
          <Route path="ability/man-power" element={<ManageWorkforcePage />} />
          <Route
            path="ability/skill-measurement"
            element={<SkillMatrixPage />}
          />
        </Route>

        {/* === Module Kho Thành Phẩm (MỚI) === */}
        <Route
          path="/finishedgoods-warehouse"
          element={<FinishedGoodsWarehouseLayout />}
        >
          <Route
            index
            element={<Navigate to="productivity/upload-packing-plan" replace />}
          />
          {/* Productivity Routes */}
          <Route
            path="productivity/upload-packing-plan"
            element={<UploadPackingPlanPage />}
          />
          <Route
            path="productivity/packing-plan-report"
            element={<PackingPlanReportPage />}
          />
          <Route
            path="productivity/metal-scan"
            element={<div>Metal Scan Page (Reuse)</div>}
          />
          <Route
            path="productivity/auto-weight"
            element={<div>Auto Weight Page (Reuse)</div>}
          />
          <Route
            path="productivity/upload-plan-load"
            element={<UploadPlanloadPage />}
          />
          <Route
            path="productivity/monitoring-report"
            element={<FgWhMonitoringReportPage />}
          />
          <Route
            path="productivity/scan-in"
            element={<div>Scan In Page (Reuse)</div>}
          />
          <Route
            path="productivity/scan-out"
            element={<div>Scan Out Page (Reuse)</div>}
          />

          {/* Quality Routes */}
          <Route
            path="quality/sample-inspection"
            element={<SampleInspectionPage />}
          />
          <Route
            path="quality/garment-inspection"
            element={<GarmentInspectionPage />}
          />
          <Route path="quality/action-plan" element={<ActionPlanPage />} />
        </Route>

        {/* === Module Factory Setting === */}
        <Route path="/factory" element={<FactoryLayout />}>
          <Route
            index
            element={<Navigate to="location-management" replace />}
          />
          <Route
            path="location-management"
            element={<LocationManagementPage />}
          />
          <Route path="audit-log" element={<AuditLogPage />} />
        </Route>

        {/* === MODULE DASHBOARD TỔNG (MỚI) === */}
        <Route path="/dashboard" element={<OverallDashboardPage />} />

        {/* Redirect về trang chủ nếu không khớp route nào */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
