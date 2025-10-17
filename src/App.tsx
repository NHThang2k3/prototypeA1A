// Path: src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
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
        {/* Tất cả các route bên trong đây sẽ sử dụng MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<InboundDashboardPage />} />
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

          <Route path="issue/accessory" element={<IssueAccessoryFormPage />} />
          <Route path="issue/packaging" element={<IssuePackagingFormPage />} />

          <Route
            path="reports/issues"
            element={<IssueTransactionReportsPage />}
          />

          <Route path="packing-list" element={<PackingListManagementPage />} />
        </Route>

        {/* Bạn có thể thêm các route không cần layout ở đây, ví dụ trang Login */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
