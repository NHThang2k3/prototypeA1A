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
import InboundDashboardPage from "./pages/Warehouse/InboundDashboardPage";
import InventoryListPage from "./pages/Warehouse/InventoryListPage";
import KanbanBoardPage from "./pages/Warehouse/KanbanBoardPage";
import LocationManagementPage from "./pages/FactorySetting/LocationManagementPage";
import IssueFabricFormPage from "./pages/Warehouse/IssueFabricFromJobPage";
import IssueAccessoryFormPage from "./pages/Warehouse/IssueAccessoryFormPage";
import IssuePackagingFormPage from "./pages/Warehouse/IssuePackagingFormPage";
import IssueTransactionReportsPage from "./pages/Warehouse/IssueTransactionReportsPage";
import PackingListManagementPage from "./pages/Warehouse/PackingListManagementPage";
import AccessoryInventoryListPage from "./pages/Warehouse/AccessoryInventoryListPage";
import SewingTrimsKanbanPage from "./pages/Warehouse/SewingTrimsKanbanPage";
import PackagingInventoryListPage from "./pages/Warehouse/PackagingInventoryListPage";
import AccessoryIssueTransactionReportsPage from "./pages/Warehouse/AccessoryIssueTransactionReportsPage";
import PackagingIssueTransactionReportsPage from "./pages/Warehouse/PackagingIssueTransactionReportsPage";
import CuttingLayout from "./layouts/CuttingLayout";
import MasterPlanPage from "./pages/Cutting/MasterPlanPage";
import BundleManagementPage from "./pages/Cutting/BundleManagementPage";
import CuttingDashboardPerformance from "./pages/Cutting/CuttingDashboardPerformance";
import AuditLogPage from "./pages/FactorySetting/AuditLogPage";
import FactoryLayout from "./layouts/FactoryLayout";
import WeeklyDailyPlanPage from "./pages/Decoration/WeeklyDailyPlanPage";
import WorkPlanPage from "./pages/Decoration/WorkPlanPage";
import BufferScanInPage from "./pages/Decoration/BufferScanInPage";
import BufferScanOutPage from "./pages/Decoration/BufferScanOutPage";
import DecorationDashboardPage from "./pages/Decoration/DecorationDashboardPage";
import BondingDashboardPage from "./pages/Decoration/BondingDashboardPage";
import EmbroideryDashboardPage from "./pages/Decoration/EmbroideryDashboardPage";
import PadPrintingDashboardPage from "./pages/Decoration/PadPrintingDashboardPage";
import HeatPressDashboardPage from "./pages/Decoration/HeatPressDashboardPage";
import ActionPlanPage from "./pages/Warehouse/ActionPlanPage";
import MachineLocationPage from "./pages/Decoration/MachineLocationPage";
import DowntimeDashboardPage from "./pages/Decoration/DowntimeDashboardPage";
import KanbanReportPage from "./pages/Buffer/KanbanReportPage";
import BufferReportPage from "./pages/Buffer/BufferReportPage";
import SupermarketScanPage from "./pages/Buffer/SupermarketScanPage";
import SupermarketReportPage from "./pages/Buffer/SupermarketReportPage";
import WipDashboardPage from "./pages/SewwingLine/WipDashboardPage";
import ProductionPlanPage from "./pages/SewwingLine/ProductionPlanPage";
import KanbanMonitoringPage from "./pages/SewwingLine/KanbanMonitoringPage";
import EFFDashboardPage from "./pages/SewwingLine/EFFDashboardPage";
import ManageWorkforcePage from "./pages/SewwingLine/ManageWorkforcePage";
import QualityDashboardPage from "./pages/SewwingLine/QualityDashboardPage";
import UploadPackingPlanPage from "./pages/FGsWH/UploadPackingPlanPage";
import PackingPlanReportPage from "./pages/FGsWH/PackingPlanReportPage";
import UploadPlanloadPage from "./pages/FGsWH/UploadPlanloadPage";
import FgWhMonitoringReportPage from "./pages/FGsWH/FgWhMonitoringReportPage";
import SampleInspectionPage from "./pages/FGsWH/SampleInspectionPage";
import GarmentInspectionPage from "./pages/FGsWH/GarmentInspectionPage";
import IncentiveCalculationPage from "./pages/SewwingLine/IncentiveCalculationPage";
import SkillMatrixPage from "./pages/SewwingLine/SkillMatrixPage";
import TPMDashboardPage from "./pages/SewwingLine/TPMDashboardPage";
import ConsolidatedReportPage from "./pages/SewwingLine/ConsolidatedReportPage";
import ToolManagementPage from "./pages/Cutting/ToolManagementPage";
import BondingOutputPage from "./pages/Decoration/BondingOutputPage";
import ToolStatusDashboardPage from "./pages/SewwingLine/ToolStatusDashboardPage";
import EMSPage from "./pages/SewwingLine/EMSPage";
import CuttingWeeklyDailyPlanPage from "./pages/Cutting/CuttingWeeklyDailyPlanPage";
import OverallDashboardPage from "./pages/overall-dashboard/OverallDashboardPage";
import RepairRequestListPage from "./pages/Decoration/RepairRequestListPage";

import AllScreens from "./pages/all-screen/AllScreen";
import ImportPackingListFormPage from "./pages/Warehouse/ImportPackingListFormPage";
import FabricRelaxScreen from "./pages/Warehouse/FabricRelaxScreen";
import ScanQRWarehouseLocation from "./pages/Warehouse/ScanQRWarehouseLocation";
import ScanQRFabric from "./pages/Warehouse/ScanQRFabric";
import ScanQRIssueRequest from "./pages/Warehouse/ScanQRIssueRequest";
import ScanQRAccessory from "./pages/Warehouse/ScanQRAccessory";
import ScanQRWarehouseLocationAccessory from "./pages/Warehouse/ScanQRWarehouseLocationAccessory";
import ScanQRIssueRequestAccessory from "./pages/Warehouse/ScanQRIssueRequestAccessory";
import PackingListManagementPageAccessory from "./pages/Warehouse/PackingListManagementPageAccessory";
import ScanQRWarehouseLocationPackaging from "./pages/Warehouse/ScanQRWarehouseLocationPackaging";
import ScanQRPackaging from "./pages/Warehouse/ScanQRPackaging";
import ScanQRIssueRequestPackaging from "./pages/Warehouse/ScanQRIssueRequestPackaging";
import PackingListManagementPagePackaging from "./pages/Warehouse/PackingListManagementPagePackaging";
import ScanInBufferPage from "./pages/Buffer/ScanInBufferPage";
import ScanOutBufferPage from "./pages/Buffer/ScanOutBufferPage";
import RelaxTimeStandardPage from "./pages/Warehouse/RelaxTimeStandardPage";
import PermissionManagementPage from "./pages/FactorySetting/RoleManagementPage";
import IPTrackingDashboardPage from "./pages/overall-dashboard/IPTrackingDashboardPage";
import GlobalTrafficTracker from "./components/GlobalTrafficTracker";

function App() {
  return (
    <BrowserRouter>
    <GlobalTrafficTracker />
      <Routes>
        {/* Route chính để chọn module */}
        {/* <Route path="/home" element={<HomePage />} /> */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/" element={<AllScreens />} /> */}

        {/* === Module Kho Vải === */}
        <Route path="/fabric-warehouse" element={<FabricWarehouseLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InboundDashboardPage />} />
          <Route path="inventory" element={<InventoryListPage />} />
          <Route path="kanban" element={<KanbanBoardPage />} />
          <Route path="locations" element={<LocationManagementPage />} />
          <Route
            path="qr-scan-location"
            element={<ScanQRWarehouseLocation />}
          />
          <Route path="qr-scan-fabric" element={<ScanQRFabric />} />
          <Route path="qr-scan-request" element={<ScanQRIssueRequest />} />
          <Route path="issue/fabric" element={<IssueFabricFormPage />} />
          <Route path="relax/fabric" element={<FabricRelaxScreen />} />
          <Route
            path="reports/issues"
            element={<IssueTransactionReportsPage />}
          />
          <Route path="packing-list" element={<PackingListManagementPage />} />
          <Route
            path="packing-list-form"
            element={<ImportPackingListFormPage />}
          />
          <Route path="audit-log" element={<AuditLogPage />} />
          <Route
            path="relax-time-standard"
            element={<RelaxTimeStandardPage />}
          />
          <Route path="action-plan" element={<ActionPlanPage />} />
          
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
          {/* <Route path="qr-scan" element={<QRScanInterfacePage />} /> */}
          <Route path="issue/accessory" element={<IssueAccessoryFormPage />} />
          <Route
            path="reports/issues"
            element={<AccessoryIssueTransactionReportsPage />}
          />
          <Route
            path="qr-scan-location"
            element={<ScanQRWarehouseLocationAccessory />}
          />
          <Route path="qr-scan-accessory" element={<ScanQRAccessory />} />
          <Route
            path="qr-scan-request"
            element={<ScanQRIssueRequestAccessory />}
          />
          <Route
            path="packing-list"
            element={<PackingListManagementPageAccessory />}
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
          <Route path="kanban" element={<SewingTrimsKanbanPage />} />
          <Route path="locations" element={<LocationManagementPage />} />
          {/* <Route path="qr-scan" element={<QRScanInterfacePage />} /> */}
          <Route path="issue/packaging" element={<IssuePackagingFormPage />} />
          <Route
            path="reports/issues"
            element={<PackagingIssueTransactionReportsPage />}
          />
          <Route
            path="qr-scan-location"
            element={<ScanQRWarehouseLocationPackaging />}
          />
          <Route path="qr-scan-packaging" element={<ScanQRPackaging />} />
          <Route
            path="qr-scan-request"
            element={<ScanQRIssueRequestPackaging />}
          />
          <Route
            path="packing-list"
            element={<PackingListManagementPagePackaging />}
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

        {/* === Module Decoration  === */}
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
            element={<BondingDashboardPage />}
          />
          <Route
            path="productivity/embroidery-dashboard"
            element={<EmbroideryDashboardPage />}
          />
          <Route
            path="productivity/pad-printing-dashboard"
            element={<PadPrintingDashboardPage />}
          />
          <Route
            path="productivity/heat-press-dashboard"
            element={<HeatPressDashboardPage />}
          />
          <Route
            path="productivity/repair-request-list"
            element={<RepairRequestListPage />}
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
            path="availability/downtime-dashboard"
            element={<DowntimeDashboardPage />}
          />
          <Route
            path="availability/machine-location"
            element={<MachineLocationPage />}
          />
        </Route>

        {/* === Module Buffer & Supermarket  === */}
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
          <Route
            path="productivity/buffer-scan-in"
            element={<ScanInBufferPage />}
          />
          <Route
            path="productivity/buffer-scan-in"
            element={<ScanInBufferPage />}
          />
          <Route
            path="productivity/buffer-scan-out"
            element={<ScanOutBufferPage />}
          />
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

        {/* === Module Sewing Line === */}
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

        {/* === Module Kho Thành Phẩm  === */}
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
          <Route
            path="permission-management"
            element={<PermissionManagementPage />}
          />
        </Route>

        {/* === MODULE DASHBOARD TỔNG (MỚI) === */}
        <Route path="/dashboard" element={<OverallDashboardPage />} />
        <Route path="/ip-tracking" element={<IPTrackingDashboardPage />} />

        <Route path="/all-screens" element={<AllScreens />} />

        {/* Redirect về trang chủ nếu không khớp route nào */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
