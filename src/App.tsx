// Path: src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Layouts
import FabricWarehouseLayout from "./layouts/FabricWarehouseLayout";
import AccessoryWarehouseLayout from "./layouts/AccessoryWarehouseLayout";
import PackagingWarehouseLayout from "./layouts/PackagingWarehouseLayout";

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
import AdminPage from "./pages/admin/AdminPage";
import AdminLayout from "./layouts/AdminLayout";

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
          {/* Ví dụ về cách thêm các page con cho module cutting */}
          <Route
            path="dashboard/cutting-dashboard-performance"
            element={<CuttingDashboardPerformance />}
          />
          <Route path="planning/master-plan" element={<MasterPlanPage />} />
          <Route
            path="planning/cutting-daily-weekly"
            element={<div>Cutting Plans Page</div>}
          />
          <Route
            path="bundle-data/bundle-management"
            element={<BundleManagementPage />}
          />
        </Route>

        {/* === Module Admin === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminPage />} />
        </Route>

        {/* Redirect về trang chủ nếu không khớp route nào */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
