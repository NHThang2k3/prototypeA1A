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
import ImportPackingListFormPage from "./pages/import-packing-list/ImportPackingListFormPage";
import ShipmentDetailPage from "./pages/shipment-detail/ShipmentDetailPage";
import LocationManagementPage from "./pages/location-management/LocationManagementPage";
import QRScanInterfacePage from "./pages/qr-scan/QRScanInterfacePage";
import IssueFabricFormPage from "./pages/issue-fabric-form/IssueFabricFormPage";
import IssueAccessoryFormPage from "./pages/issue-accessory-form/IssueAccessoryFormPage";
import IssuePackagingFormPage from "./pages/issue-packaging-form/IssuePackagingFormPage";
import IssueTransactionReportsPage from "./pages/issue-transaction-reports/IssueTransactionReportsPage";
import PackingListManagementPage from "./pages/packing-list-management/PackingListManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route chính để chọn module */}
        <Route path="/" element={<HomePage />} />

        {/* === Module Kho Vải === */}
        <Route path="/fabric-warehouse" element={<FabricWarehouseLayout />}>
          {/* Chuyển hướng từ /fabric-warehouse sang dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InboundDashboardPage />} />
          <Route path="inventory" element={<InventoryListPage />} />
          <Route path="kanban" element={<KanbanBoardPage />} />
          <Route
            path="import-packing-list"
            element={<ImportPackingListFormPage />}
          />
          <Route
            path="shipments/:shipmentId"
            element={<ShipmentDetailPage />}
          />
          <Route path="locations" element={<LocationManagementPage />} />
          <Route path="qr-scan" element={<QRScanInterfacePage />} />
          <Route path="issue/fabric" element={<IssueFabricFormPage />} />
          <Route
            path="reports/issues"
            element={<IssueTransactionReportsPage />}
          />
          <Route path="packing-list" element={<PackingListManagementPage />} />
        </Route>

        {/* === Module Kho Phụ Liệu (Ví dụ) === */}
        <Route
          path="/accessory-warehouse"
          element={<AccessoryWarehouseLayout />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InboundDashboardPage />} /> // Tái
          sử dụng dashboard
          <Route path="inventory" element={<InventoryListPage />} /> // Tái sử
          dụng trang tồn kho
          <Route path="issue" element={<IssueAccessoryFormPage />} />
          <Route
            path="reports/issues"
            element={<IssueTransactionReportsPage />}
          />
          <Route path="qr-scan" element={<QRScanInterfacePage />} />
        </Route>

        {/* === Module Kho Đóng Gói (Ví dụ) === */}
        <Route
          path="/packaging-warehouse"
          element={<PackagingWarehouseLayout />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InboundDashboardPage />} />
          <Route path="inventory" element={<InventoryListPage />} />
          <Route path="issue" element={<IssuePackagingFormPage />} />
          <Route
            path="reports/issues"
            element={<IssueTransactionReportsPage />}
          />
          <Route path="qr-scan" element={<QRScanInterfacePage />} />
        </Route>

        {/* Redirect về trang chủ nếu không khớp route nào */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
