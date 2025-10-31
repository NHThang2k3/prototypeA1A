import React from "react";
// import ActionPlanPage from "../Warehouse/ActionPlanPage";
import SewingTrimsKanbanPage from "../Warehouse/SewingTrimsKanbanPage";
import ImportPackingListFormPage from "../Warehouse/ImportPackingListFormPage";
import IssueFabricFromJobPage from "../Warehouse/IssueFabricFromJobPage";
import IssueAccessoryFormPage from "../Warehouse/IssueAccessoryFormPage";
import IssuePackagingFormPage from "../Warehouse/IssuePackagingFormPage";
import ScanQRIssueRequest from "../Warehouse/ScanQRIssueRequest";
import ScanQRFabric from "../Warehouse/ScanQRFabric";
import ScanQRWarehouseLocation from "../Warehouse/ScanQRWarehouseLocation";
import KanbanBoardPage from "../Warehouse/KanbanBoardPage";
import PackingListManagementPage from "../Warehouse/PackingListManagementPage";
import InventoryListPage from "../Warehouse/InventoryListPage";
import IssueTransactionReportsPage from "../Warehouse/IssueTransactionReportsPage";
import FabricRelaxScreen from "../Warehouse/FabricRelaxScreen";
import AccessoryInventoryListPage from "../Warehouse/AccessoryInventoryListPage";
import AccessoryIssueTransactionReportsPage from "../Warehouse/AccessoryIssueTransactionReportsPage";
import PackagingInventoryListPage from "../Warehouse/PackagingInventoryListPage";
import PackagingIssueTransactionReportsPage from "../Warehouse/PackagingIssueTransactionReportsPage";
import ScanQRAccessory from "../Warehouse/ScanQRAccessory";
import ScanQRIssueRequestAccessory from "../Warehouse/ScanQRIssueRequestAccessory";
import ScanQRWarehouseLocationAccessory from "../Warehouse/ScanQRWarehouseLocationAccessory";
import ImportPackingListFormPageAccessory from "../Warehouse/ImportPackingListFormPageAccessory";
import PackingListManagementPageAccessory from "../Warehouse/PackingListManagementPageAccessory";
import PackingListManagementPagePackaging from "../Warehouse/PackingListManagementPagePackaging";
import ImportPackingListFormPagePackaging from "../Warehouse/ImportPackingListFormPagePackaging";
import ScanQRWarehouseLocationPackaging from "../Warehouse/ScanQRWarehouseLocationPackaging";
import ScanQRIssueRequestPackaging from "../Warehouse/ScanQRIssueRequestPackaging";
import ScanQRPackaging from "../Warehouse/ScanQRPackaging";

const AllScreens: React.FC = () => {
  type PageComponent = React.ComponentType<Record<string, unknown>>;
  const pages: { name: string; component: PageComponent }[] = [
    // { name: "ActionPlanPage", component: ActionPlanPage },
    { name: "SewingTrimsKanbanPage", component: SewingTrimsKanbanPage },
    { name: "ImportPackingListFormPage", component: ImportPackingListFormPage },
    { name: "IssueFabricFromJobPage", component: IssueFabricFromJobPage },
    { name: "IssueAccessoryFormPage", component: IssueAccessoryFormPage },
    { name: "IssuePackagingFormPage", component: IssuePackagingFormPage },
    { name: "ScanQRIssueRequest", component: ScanQRIssueRequest },
    { name: "ScanQRFabric", component: ScanQRFabric },
    { name: "ScanQRWarehouseLocation", component: ScanQRWarehouseLocation },
    { name: "KanbanBoardPage", component: KanbanBoardPage },
    { name: "PackingListManagementPage", component: PackingListManagementPage },
    { name: "InventoryListPage", component: InventoryListPage },
    {
      name: "IssueTransactionReportsPage",
      component: IssueTransactionReportsPage,
    },
    { name: "FabricRelaxScreen", component: FabricRelaxScreen },
    {
      name: "AccessoryInventoryListPage",
      component: AccessoryInventoryListPage,
    },
    {
      name: "AccessoryIssueTransactionReportsPage",
      component: AccessoryIssueTransactionReportsPage,
    },
    {
      name: "PackagingInventoryListPage",
      component: PackagingInventoryListPage,
    },
    {
      name: "PackagingIssueTransactionReportsPage",
      component: PackagingIssueTransactionReportsPage,
    },
    { name: "ScanQRAccessory", component: ScanQRAccessory },
    {
      name: "ScanQRIssueRequestAccessory",
      component: ScanQRIssueRequestAccessory,
    },
    {
      name: "ScanQRWarehouseLocationAccessory",
      component: ScanQRWarehouseLocationAccessory,
    },
    {
      name: "ImportPackingListFormPageAccessory",
      component: ImportPackingListFormPageAccessory,
    },
    {
      name: "PackingListManagementPageAccessory",
      component: PackingListManagementPageAccessory,
    },
    {
      name: "PackingListManagementPagePackaging",
      component: PackingListManagementPagePackaging,
    },
    {
      name: "ImportPackingListFormPagePackaging",
      component: ImportPackingListFormPagePackaging,
    },
    {
      name: "ScanQRWarehouseLocationPackaging",
      component: ScanQRWarehouseLocationPackaging,
    },
    {
      name: "ScanQRIssueRequestPackaging",
      component: ScanQRIssueRequestPackaging,
    },
    { name: "ScanQRPackaging", component: ScanQRPackaging },
  ];

  return (
    <div className="h-screen w-full overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8 ">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          All Application Screens
        </h1>
        <div className="grid grid-cols-1 gap-6">
          {pages.map((page, index) => {
            const Component = page.component;
            return (
              <div
                key={index}
                className="border p-4 bg-white shadow-md flex flex-col"
              >
                <h2 className="text-lg font-semibold mb-2 truncate text-blue-600">
                  {page.name}
                </h2>

                <div className="border-t pt-4">{<Component />}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllScreens;
