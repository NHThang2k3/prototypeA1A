import React from "react";

// Warehouse
import ScanQRAccessory from "../Warehouse/ScanQRAccessory";
import AccessoryInventoryListPage from "../Warehouse/AccessoryInventoryListPage";
import AccessoryIssueTransactionReportsPage from "../Warehouse/AccessoryIssueTransactionReportsPage";
import ActionPlanPage from "../Warehouse/ActionPlanPage";
import FabricRelaxScreen from "../Warehouse/FabricRelaxScreen";
import ImportPackingListFormPage from "../Warehouse/ImportPackingListFormPage";
import InboundDashboardPage from "../Warehouse/InboundDashboardPage";
import InventoryListPage from "../Warehouse/InventoryListPage";
import IssueAccessoryFormPage from "../Warehouse/IssueAccessoryFormPage";
import IssueFabricFromJobPage from "../Warehouse/IssueFabricFromJobPage";
import IssuePackagingFormPage from "../Warehouse/IssuePackagingFormPage";
import IssueTransactionReportsPage from "../Warehouse/IssueTransactionReportsPage";
import KanbanBoardPage from "../Warehouse/KanbanBoardPage";
import PackagingInventoryListPage from "../Warehouse/PackagingInventoryListPage";
import PackagingIssueTransactionReportsPage from "../Warehouse/PackagingIssueTransactionReportsPage";
import PackingListManagementPage from "../Warehouse/PackingListManagementPage";
import PackingListManagementPageAccessory from "../Warehouse/PackingListManagementPageAccessory";
import PackingListManagementPagePackaging from "../Warehouse/PackingListManagementPagePackaging";
import ScanQRFabric from "../Warehouse/ScanQRFabric";
import ScanQRIssueRequest from "../Warehouse/ScanQRIssueRequest";
import ScanQRIssueRequestAccessory from "../Warehouse/ScanQRIssueRequestAccessory";
import ScanQRIssueRequestPackaging from "../Warehouse/ScanQRIssueRequestPackaging";
import ScanQRPackaging from "../Warehouse/ScanQRPackaging";
import ScanQRWarehouseLocation from "../Warehouse/ScanQRWarehouseLocation";
import ScanQRWarehouseLocationAccessory from "../Warehouse/ScanQRWarehouseLocationAccessory";
import ScanQRWarehouseLocationPackaging from "../Warehouse/ScanQRWarehouseLocationPackaging";
import SewingTrimsKanbanPage from "../Warehouse/SewingTrimsKanbanPage";

// // Cutting
// import MasterPlanPage from "../Cutting/MasterPlanPage";
// import CuttingWeeklyDailyPlanPage from "../Cutting/CuttingWeeklyDailyPlanPage";
// import CuttingDashboardPerformance from "../Cutting/CuttingDashboardPerformance";
// import BundleManagementPage from "../Cutting/BundleManagementPage";
// import ToolManagementPage from "../Cutting/ToolManagementPage";

// // Decoration
// import WorkPlanPage from "../Decoration/WorkPlanPage";
// import WeeklyDailyPlanPage from "../Decoration/WeeklyDailyPlanPage";
// import RecordReworkResultPage from "../Decoration/RecordReworkResultPage";
// import RepairRequestListPage from "../Decoration/RepairRequestListPage";
// import BondingOutputPage from "../Decoration/BondingOutputPage";
// import CreateRepairRequestPage from "../Decoration/CreateRepairRequestPage";
// import DecorationDashboardPage from "../Decoration/DecorationDashboardPage";
// import MachineLocationPage from "../Decoration/MachineLocationPage";
// import BufferScanInPage from "../Decoration/BufferScanInPage";
// import ApproveRepairRequestPage from "../Decoration/ApproveRepairRequestPage";
// import BufferScanOutPage from "../Decoration/BufferScanOutPage";

// // Buffer
// import SupermarketReportPage from "../Buffer/SupermarketReportPage";
// import ScanOutBufferPage from "../Buffer/ScanOutBufferPage";
// import ScanInBufferPage from "../Buffer/ScanInBufferPage";
// import SupermarketScanPage from "../Buffer/SupermarketScanPage";
// import BufferReportPage from "../Buffer/BufferReportPage";
// import KanbanReportPage from "../Buffer/KanbanReportPage";

// // SewwingLine
// import ManageWorkforcePage from "../SewwingLine/ManageWorkforcePage";
// import EMSPage from "../SewwingLine/EMSPage";
// import WipDashboardPage from "../SewwingLine/WipDashboardPage";
// import SkillMatrixPage from "../SewwingLine/SkillMatrixPage";
// import ToolStatusDashboardPage from "../SewwingLine/ToolStatusDashboardPage";
// import TPMDashboardPage from "../SewwingLine/TPMDashboardPage";
// import ProductionPlanPage from "../SewwingLine/ProductionPlanPage";
// import KanbanMonitoringPage from "../SewwingLine/KanbanMonitoringPage";
// import QualityDashboardPage from "../SewwingLine/QualityDashboardPage";
// import EFFDashboardPage from "../SewwingLine/EFFDashboardPage";
// import ConsolidatedReportPage from "../SewwingLine/ConsolidatedReportPage";
// import IncentiveCalculationPage from "../SewwingLine/IncentiveCalculationPage";

// // FGsWH
// import UploadPackingPlanPage from "../FGsWH/UploadPackingPlanPage";
// import UploadPlanloadPage from "../FGsWH/UploadPlanloadPage";
// import SampleInspectionPage from "../FGsWH/SampleInspectionPage";
// import PackingPlanReportPage from "../FGsWH/PackingPlanReportPage";
// import FgWhMonitoringReportPage from "../FGsWH/FgWhMonitoringReportPage";
// import GarmentInspectionPage from "../FGsWH/GarmentInspectionPage";

// FactorySetting
import LocationManagementPage from "../FactorySetting/LocationManagementPage";
import AuditLogPage from "../FactorySetting/AuditLogPage";
import RoleManagementPage from "../FactorySetting/RoleManagementPage";

// overall-dashboard
// import OverallDashboardPage from "../overall-dashboard/OverallDashboardPage";
import HomePage from "../home/HomePage";

const AllScreens: React.FC = () => {
  type PageComponent = React.ComponentType<Record<string, unknown>>;
  const pages: { name: string; component: PageComponent }[] = [
    // HomePage
    { name: "HomePage", component: HomePage },

    // Warehouse
    { name: "InboundDashboardPage", component: InboundDashboardPage },
    { name: "PackingListManagementPage", component: PackingListManagementPage },
    { name: "ImportPackingListFormPage", component: ImportPackingListFormPage },
    { name: "InventoryListPage", component: InventoryListPage },
    { name: "FabricRelaxScreen", component: FabricRelaxScreen },
    { name: "IssueFabricFromJobPage", component: IssueFabricFromJobPage },
    {
      name: "PackingListManagementPageAccessory",
      component: PackingListManagementPageAccessory,
    },
    {
      name: "AccessoryInventoryListPage",
      component: AccessoryInventoryListPage,
    },
    { name: "IssueAccessoryFormPage", component: IssueAccessoryFormPage },
    {
      name: "AccessoryIssueTransactionReportsPage",
      component: AccessoryIssueTransactionReportsPage,
    },

    { name: "IssuePackagingFormPage", component: IssuePackagingFormPage },
    {
      name: "IssueTransactionReportsPage",
      component: IssueTransactionReportsPage,
    },
    {
      name: "PackingListManagementPagePackaging",
      component: PackingListManagementPagePackaging,
    },
    {
      name: "PackagingInventoryListPage",
      component: PackagingInventoryListPage,
    },
    {
      name: "PackagingIssueTransactionReportsPage",
      component: PackagingIssueTransactionReportsPage,
    },

    { name: "ScanQRFabric", component: ScanQRFabric },
    { name: "ScanQRIssueRequest", component: ScanQRIssueRequest },
    {
      name: "ScanQRIssueRequestAccessory",
      component: ScanQRIssueRequestAccessory,
    },
    {
      name: "ScanQRIssueRequestPackaging",
      component: ScanQRIssueRequestPackaging,
    },
    { name: "ScanQRPackaging", component: ScanQRPackaging },
    { name: "ScanQRWarehouseLocation", component: ScanQRWarehouseLocation },
    {
      name: "ScanQRWarehouseLocationAccessory",
      component: ScanQRWarehouseLocationAccessory,
    },
    {
      name: "ScanQRWarehouseLocationPackaging",
      component: ScanQRWarehouseLocationPackaging,
    },
    { name: "ScanQRAccessory", component: ScanQRAccessory },
    { name: "KanbanBoardPage", component: KanbanBoardPage },
    { name: "SewingTrimsKanbanPage", component: SewingTrimsKanbanPage },
    { name: "ActionPlanPage", component: ActionPlanPage },

    // Cutting
    // { name: "MasterPlanPage", component: MasterPlanPage },
    // {
    //   name: "CuttingWeeklyDailyPlanPage",
    //   component: CuttingWeeklyDailyPlanPage,
    // },
    // {
    //   name: "CuttingDashboardPerformance",
    //   component: CuttingDashboardPerformance,
    // },
    // { name: "BundleManagementPage", component: BundleManagementPage },
    // { name: "ToolManagementPage", component: ToolManagementPage },

    // Decoration
    // { name: "WorkPlanPage", component: WorkPlanPage },
    // { name: "WeeklyDailyPlanPage", component: WeeklyDailyPlanPage },
    // {
    //   name: "RecordReworkResultPage",
    //   component: RecordReworkResultPage,
    // },
    // { name: "RepairRequestListPage", component: RepairRequestListPage },
    // { name: "BondingOutputPage", component: BondingOutputPage },
    // { name: "CreateRepairRequestPage", component: CreateRepairRequestPage },
    // { name: "DecorationDashboardPage", component: DecorationDashboardPage },
    // { name: "MachineLocationPage", component: MachineLocationPage },
    // { name: "BufferScanInPage", component: BufferScanInPage },
    // {
    //   name: "ApproveRepairRequestPage",
    //   component: ApproveRepairRequestPage,
    // },
    // { name: "BufferScanOutPage", component: BufferScanOutPage },

    // // Buffer
    // { name: "SupermarketReportPage", component: SupermarketReportPage },
    // { name: "ScanOutBufferPage", component: ScanOutBufferPage },
    // { name: "ScanInBufferPage", component: ScanInBufferPage },
    // { name: "SupermarketScanPage", component: SupermarketScanPage },
    // { name: "BufferReportPage", component: BufferReportPage },
    // { name: "KanbanReportPage", component: KanbanReportPage },

    // // SewwingLine
    // { name: "ManageWorkforcePage", component: ManageWorkforcePage },
    // { name: "EMSPage", component: EMSPage },
    // { name: "WipDashboardPage", component: WipDashboardPage },
    // { name: "SkillMatrixPage", component: SkillMatrixPage },
    // { name: "ToolStatusDashboardPage", component: ToolStatusDashboardPage },
    // { name: "TPMDashboardPage", component: TPMDashboardPage },
    // { name: "ProductionPlanPage", component: ProductionPlanPage },
    // { name: "KanbanMonitoringPage", component: KanbanMonitoringPage },
    // { name: "QualityDashboardPage", component: QualityDashboardPage },
    // { name: "EFFDashboardPage", component: EFFDashboardPage },
    // { name: "ConsolidatedReportPage", component: ConsolidatedReportPage },
    // { name: "IncentiveCalculationPage", component: IncentiveCalculationPage },

    // // FGsWH
    // { name: "UploadPackingPlanPage", component: UploadPackingPlanPage },
    // { name: "UploadPlanloadPage", component: UploadPlanloadPage },
    // { name: "SampleInspectionPage", component: SampleInspectionPage },
    // { name: "PackingPlanReportPage", component: PackingPlanReportPage },
    // { name: "FgWhMonitoringReportPage", component: FgWhMonitoringReportPage },
    // { name: "GarmentInspectionPage", component: GarmentInspectionPage },

    // FactorySetting
    { name: "LocationManagementPage", component: LocationManagementPage },
    { name: "AuditLogPage", component: AuditLogPage },
    { name: "RoleManagementPage", component: RoleManagementPage },

    // overall-dashboard
    // { name: "OverallDashboardPage", component: OverallDashboardPage },
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
