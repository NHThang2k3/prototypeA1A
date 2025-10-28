// src/pages/all-screen/AllScreen.tsx

import React from "react";
// import HomePage from "../home/HomePage";
import WipDashboardPage from "../WipDashboardPage/WipDashboardPage";
import SupermarketReportPage from "../SupermarketReportPage/SupermarketReportPage";
import SupermarketScanPage from "../SupermarketScanPage/SupermarketScanPage";
import BufferReportPage from "../BufferReportPage/BufferReportPage";
import BufferScanPage from "../BufferScanPage/BufferScanPage";
import KanbanReportPage from "../KanbanReportPage/KanbanReportPage";
// import RecordReworkResultPage from "../damaged-goods-repair/RecordReworkResultPage";
// import ApproveRepairRequestPage from "../damaged-goods-repair/ApproveRepairRequestPage";
import CreateRepairRequestPage from "../damaged-goods-repair/CreateRepairRequestPage";
import RepairRequestListPage from "../damaged-goods-repair/RepairRequestListPage";
import BondingOutputPage from "../BondingOutputPage/BondingOutputPage";
import WorkPlanPage from "../WorkPlanPage/WorkPlanPage";
import CuttingWeeklyDailyPlanPage from "../CuttingWeeklyDailyPlanPage/CuttingWeeklyDailyPlanPage";
import ToolManagementPage from "../ToolManagementPage/ToolManagementPage";
import OverallDashboardPage from "../overall-dashboard/OverallDashboardPage";
// import AccessoryInventoryListPage from "../accessory-inventory-list/AccessoryInventoryListPage";
import AccessoryInventoryListPageWrapper from "./components/AccessoryInventoryListPageWrapper";
// import AccessoryIssueTransactionReportsPage from "../accessory-issue-transaction-reports/AccessoryIssueTransactionReportsPage";
import AccessoryIssueTransactionReportsPageWrapper from "./components/AccessoryIssueTransactionReportsPageWrapper";
// import ActionPlanPage from "../ActionPlanPage/ActionPlanPage";
import ActionPlanPageWrapper from "./components/ActionPlanPageWrapper";
// import AuditLogPage from "../audit-log/AuditLogPage";
import AuditLogPageWrapper from "./components/AuditLogPageWrapper";
// import BufferScanInPage from "../BufferScanInPage/BufferScanInPage";
import BufferScanInPageWrapper from "./components/BufferScanInPageWrapper";
// import BufferScanOutPage from "../BufferScanOutPage/BufferScanOutPage";
import BufferScanOutPageWrapper from "./components/BufferScanOutPageWrapper";
// import BundleManagementPage from "../bundle-management/BundleManagementPage";
import BundleManagementPageWrapper from "./components/BundleManagementPageWrapper";
// import ConsolidatedReportPage from "../ConsolidatedReportPage/ConsolidatedReportPage";
import ConsolidatedReportPageWrapper from "./components/ConsolidatedReportPageWrapper";
// import CuttingDashboardPerformance from "../cutting-dashboard-performance/CuttingDashboardPerformance";
import CuttingDashboardPerformanceWrapper from "./components/CuttingDashboardPerformanceWrapper";
// import DecorationDashboardPage from "../DecorationDashboardPage/DecorationDashboardPage";
import DecorationDashboardPageWrapper from "./components/DecorationDashboardPageWrapper";
// import EFFDashboardPage from "../EFFDashboardPage/EFFDashboardPage";
import EFFDashboardPageWrapper from "./components/EFFDashboardPageWrapper";
// import EMSPage from "../EMSPage/EMSPage";
import EMSPageWrapper from "./components/EMSPageWrapper";
// import FgWhMonitoringReportPage from "../FgWhMonitoringReportPage/FgWhMonitoringReportPage";
import FgWhMonitoringReportPageWrapper from "./components/FgWhMonitoringReportPageWrapper";
// import GarmentInspectionPage from "../GarmentInspectionPage/GarmentInspectionPage";
import GarmentInspectionPageWrapper from "./components/GarmentInspectionPageWrapper";
import ImportPackingListFormPage from "../import-packing-list/ImportPackingListFormPage";
import ImportPackingListFormPageWrapper from "./components/ImportPackingListFormPageWrapper";
// import InboundDashboardPage from "../inbound-dashboard/InboundDashboardPage";
import InboundDashboardPageWrapper from "./components/InboundDashboardPageWrapper";
// import IncentiveCalculationPage from "../IncentiveCalculationPage/IncentiveCalculationPage";
import IncentiveCalculationPageWrapper from "./components/IncentiveCalculationPageWrapper";
// import InventoryListPage from "../inventory-list/InventoryListPage";
import InventoryListPageWrapper from "./components/InventoryListPageWrapper";
// import IssueAccessoryFormPage from "../issue-accessory-form/IssueAccessoryFormPage";
import IssueAccessoryFormPageWrapper from "./components/IssueAccessoryFormPageWrapper";
// import IssueFabricFromJobPage from "../issue-fabric-form/IssueFabricFromJobPage";
import IssueFabricFromJobPageWrapper from "./components/IssueFabricFromJobPageWrapper";
// import IssuePackagingFormPage from "../issue-packaging-form/IssuePackagingFormPage";
import IssuePackagingFormPageWrapper from "./components/IssuePackagingFormPageWrapper";
// import IssueTransactionReportsPage from "../issue-transaction-reports/IssueTransactionReportsPage";
import IssueTransactionReportsPageWrapper from "./components/IssueTransactionReportsPageWrapper";
// import KanbanBoardPage from "../kanban-board/KanbanBoardPage";
import KanbanBoardPageWrapper from "./components/KanbanBoardPageWrapper";
// import KanbanMonitoringPage from "../KanbanMonitoringPage/KanbanMonitoringPage";
import KanbanMonitoringPageWrapper from "./components/KanbanMonitoringPageWrapper";
import LocationManagementPage from "../location-management/LocationManagementPage";
import MachineLocationPage from "../MachineLocationPage/MachineLocationPage";
import ManageWorkforcePage from "../ManageWorkforcePage/ManageWorkforcePage";
import MasterPlanPage from "../master-plan/MasterPlanPage";
import MasterPlanPage2 from "../MasterPlanPage/MasterPlanPage";
// import PackagingInventoryListPage from "../packaging-inventory-list/PackagingInventoryListPage";
import PackagingIssueTransactionReportsPage from "../packaging-issue-transaction-reports/PackagingIssueTransactionReportsPage";
// import PackingListManagementPage from "../packing-list-management/PackingListManagementPage";
import PackingPlanReportPage from "../PackingPlanReportPage/PackingPlanReportPage";
import ProductionPlanPage from "../ProductionPlanPage/ProductionPlanPage";
// import QRScanInterfacePage from "../qr-scan/QRScanInterfacePage";
import QualityDashboardPage from "../QualityDashboardPage/QualityDashboardPage";
import SampleInspectionPage from "../SampleInspectionPage/SampleInspectionPage";
// import SewingTrimsKanbanPage from "../sewing-trims-kanban/SewingTrimsKanbanPage";
import SkillMatrixPage from "../SkillMatrixPage/SkillMatrixPage";
import StatisticsAndReportsPage from "../StatisticsAndReportsPage/StatisticsAndReportsPage";
import ToolStatusDashboardPage from "../ToolStatusDashboardPage/ToolStatusDashboardPage";
import TPMDashboardPage from "../TPMDashboardPage/TPMDashboardPage";
import UploadPackingPlanPage from "../UploadPackingPlanPage/UploadPackingPlanPage";
import UploadPlanloadPage from "../UploadPlanloadPage/UploadPlanloadPage";
import WeeklyDailyPlanPage from "../WeeklyDailyPlanPage/WeeklyDailyPlanPage";
import PackagingInventoryListPageWrapper from "./components/PackagingInventoryListPageWrapper";
import PackingListManagementPageWrapper from "./components/PackingListManagementPageWrapper";
import QRScanInterfacePageWrapper from "./components/QRScanInterfacePageWrapper";
import SewingTrimsKanbanPageWrapper from "./components/SewingTrimsKanbanPageWrapper";
import HomePageWrapper from "./components/HomePageWrapper";
import ApproveRepairRequestPageWrapper from "./components/ApproveRepairRequestPageWrapper";
import RecordReworkResultPageWrapper from "./components/RecordReworkResultPageWrapper";

const AllScreens: React.FC = () => {
  type PageComponent = React.ComponentType<Record<string, unknown>>;
  const pages: { name: string; component: PageComponent }[] = [
    // --- HOME ---
    { name: "HomePageWrapper", component: HomePageWrapper },

    // --- FABRIC WAREHOUSE ---
    {
      name: "InboundDashboardPage (Fabric)",
      component: InboundDashboardPageWrapper,
    },
    { name: "InventoryListPage (Fabric)", component: InventoryListPageWrapper },
    { name: "KanbanBoardPage (Fabric)", component: KanbanBoardPageWrapper },
    {
      name: "PackingListManagementPage",
      component: PackingListManagementPageWrapper,
    },
    {
      name: "ImportPackingListFormPage",
      component: ImportPackingListFormPageWrapper,
    },
    {
      name: "QRScanInterfacePage (Fabric)",
      component: QRScanInterfacePageWrapper,
    },
    {
      name: "IssueTransactionReportsPage (Fabric)",
      component: IssueTransactionReportsPageWrapper,
    },
    {
      name: "IssueFabricFromJobPage",
      component: IssueFabricFromJobPageWrapper,
    },

    // --- ACCESSORY WAREHOUSE ---
    {
      name: "AccessoryInventoryListPage",
      component: AccessoryInventoryListPageWrapper,
    },
    {
      name: "AccessoryIssueTransactionReportsPage",
      component: AccessoryIssueTransactionReportsPageWrapper,
    },
    {
      name: "IssueAccessoryFormPage",
      component: IssueAccessoryFormPageWrapper,
    },

    // --- PACKAGING WAREHOUSE ---
    {
      name: "PackagingInventoryListPage",
      component: PackagingInventoryListPageWrapper,
    },
    {
      name: "PackagingIssueTransactionReportsPage",
      component: PackagingIssueTransactionReportsPage,
    },
    {
      name: "IssuePackagingFormPage",
      component: IssuePackagingFormPageWrapper,
    },

    // --- CUTTING ---
    { name: "MasterPlanPage (Cutting)", component: MasterPlanPage },
    {
      name: "CuttingWeeklyDailyPlanPage",
      component: CuttingWeeklyDailyPlanPage,
    },
    { name: "BundleManagementPage", component: BundleManagementPageWrapper },
    {
      name: "CuttingDashboardPerformance",
      component: CuttingDashboardPerformanceWrapper,
    },
    { name: "ToolManagementPage", component: ToolManagementPage },
    { name: "ActionPlanPage (Shared)", component: ActionPlanPageWrapper },

    // --- BUFFER & SUPERMARKET ---
    { name: "KanbanReportPage", component: KanbanReportPage },
    { name: "BufferScanPage", component: BufferScanPage },
    { name: "BufferReportPage", component: BufferReportPage },
    { name: "SupermarketScanPage", component: SupermarketScanPage },
    { name: "SupermarketReportPage", component: SupermarketReportPage },
    { name: "WipDashboardPage", component: WipDashboardPage },

    // --- DECORATION ---
    { name: "MasterPlanPage (Decoration)", component: MasterPlanPage2 },
    { name: "WeeklyDailyPlanPage", component: WeeklyDailyPlanPage },
    { name: "WorkPlanPage", component: WorkPlanPage },
    { name: "BufferScanInPage", component: BufferScanInPageWrapper },
    { name: "BufferScanOutPage", component: BufferScanOutPageWrapper },
    {
      name: "StatisticsAndReportsPage (Record Output)",
      component: StatisticsAndReportsPage,
    },
    { name: "BondingOutputPage", component: BondingOutputPage },
    {
      name: "DecorationDashboardPage",
      component: DecorationDashboardPageWrapper,
    },
    { name: "RepairRequestListPage", component: RepairRequestListPage },
    { name: "CreateRepairRequestPage", component: CreateRepairRequestPage },
    {
      name: "ApproveRepairRequestPage",
      component: ApproveRepairRequestPageWrapper,
    },
    {
      name: "RecordReworkResultPage",
      component: RecordReworkResultPageWrapper,
    },
    { name: "MachineLocationPage", component: MachineLocationPage },

    // --- SEWING LINE ---
    { name: "ProductionPlanPage", component: ProductionPlanPage },
    { name: "KanbanMonitoringPage", component: KanbanMonitoringPageWrapper },
    { name: "EFFDashboardPage", component: EFFDashboardPageWrapper },
    {
      name: "SewingTrimsKanbanPage (PO Monitoring)",
      component: SewingTrimsKanbanPageWrapper,
    },
    {
      name: "ConsolidatedReportPage (Performance Monitoring)",
      component: ConsolidatedReportPageWrapper,
    },
    { name: "QualityDashboardPage", component: QualityDashboardPage },
    { name: "ToolStatusDashboardPage", component: ToolStatusDashboardPage },
    { name: "EMSPage", component: EMSPageWrapper },
    { name: "TPMDashboardPage", component: TPMDashboardPage },
    {
      name: "IncentiveCalculationPage",
      component: IncentiveCalculationPageWrapper,
    },
    { name: "ManageWorkforcePage", component: ManageWorkforcePage },
    { name: "SkillMatrixPage", component: SkillMatrixPage },

    // --- FINISHED GOODS WAREHOUSE ---
    { name: "UploadPackingPlanPage", component: UploadPackingPlanPage },
    { name: "PackingPlanReportPage", component: PackingPlanReportPage },
    { name: "UploadPlanloadPage", component: UploadPlanloadPage },
    {
      name: "FgWhMonitoringReportPage",
      component: FgWhMonitoringReportPageWrapper,
    },
    { name: "SampleInspectionPage", component: SampleInspectionPage },
    { name: "GarmentInspectionPage", component: GarmentInspectionPageWrapper },

    // --- FACTORY SETTING ---
    { name: "LocationManagementPage", component: LocationManagementPage },
    { name: "AuditLogPage", component: AuditLogPageWrapper },

    // --- OVERALL DASHBOARD ---
    { name: "OverallDashboardPage", component: OverallDashboardPage },
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

                <div className="border-t pt-4">
                  {page.name === "ImportPackingListFormPage" ? (
                    <ImportPackingListFormPage
                      items={[]}
                      onItemsChange={() => {}}
                    />
                  ) : (
                    <Component />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllScreens;
