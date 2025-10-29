import React from "react";
import WipDashboardPage from "../SewwingLine/WipDashboardPage";
import SupermarketReportPage from "../Buffer/SupermarketReportPage";
import SupermarketScanPage from "../Buffer/SupermarketScanPage";
import BufferReportPage from "../Buffer/BufferReportPage";
import BufferScanPage from "../Buffer/BufferScanPage";
import KanbanReportPage from "../Buffer/KanbanReportPage";
import CreateRepairRequestPage from "../Decoration/CreateRepairRequestPage";
import RepairRequestListPage from "../Decoration/RepairRequestListPage";
import BondingOutputPage from "../Decoration/BondingOutputPage";
import WorkPlanPage from "../Decoration/WorkPlanPage";
import CuttingWeeklyDailyPlanPage from "../Cutting/CuttingWeeklyDailyPlanPage";
import ToolManagementPage from "../Cutting/ToolManagementPage";
import OverallDashboardPage from "../overall-dashboard/OverallDashboardPage";
import AccessoryIssueTransactionReportsPageWrapper from "./components/AccessoryIssueTransactionReportsPageWrapper";
import ActionPlanPageWrapper from "./components/ActionPlanPageWrapper";
import AuditLogPageWrapper from "./components/AuditLogPageWrapper";
import BufferScanInPageWrapper from "./components/BufferScanInPageWrapper";
import BufferScanOutPageWrapper from "./components/BufferScanOutPageWrapper";
import ConsolidatedReportPageWrapper from "./components/ConsolidatedReportPageWrapper";
import CuttingDashboardPerformanceWrapper from "./components/CuttingDashboardPerformanceWrapper";
import DecorationDashboardPageWrapper from "./components/DecorationDashboardPageWrapper";
import EFFDashboardPageWrapper from "./components/EFFDashboardPageWrapper";
import EMSPageWrapper from "./components/EMSPageWrapper";
import FgWhMonitoringReportPageWrapper from "./components/FgWhMonitoringReportPageWrapper";
import GarmentInspectionPageWrapper from "./components/GarmentInspectionPageWrapper";
import InboundDashboardPageWrapper from "./components/InboundDashboardPageWrapper";
import IncentiveCalculationPageWrapper from "./components/IncentiveCalculationPageWrapper";
import IssueAccessoryFormPageWrapper from "./components/IssueAccessoryFormPageWrapper";
import IssueFabricFromJobPageWrapper from "./components/IssueFabricFromJobPageWrapper";
import IssuePackagingFormPageWrapper from "./components/IssuePackagingFormPageWrapper";
import IssueTransactionReportsPageWrapper from "./components/IssueTransactionReportsPageWrapper";
import KanbanMonitoringPageWrapper from "./components/KanbanMonitoringPageWrapper";
import LocationManagementPage from "../FactorySetting/LocationManagementPage";
import MachineLocationPage from "../Decoration/MachineLocationPage";
import ManageWorkforcePage from "../SewwingLine/ManageWorkforcePage";
import MasterPlanPage from "../Cutting/MasterPlanPage";
import PackagingIssueTransactionReportsPage from "../Warehouse/PackagingIssueTransactionReportsPage";
import PackingPlanReportPage from "../FGsWH/PackingPlanReportPage";
import ProductionPlanPage from "../SewwingLine/ProductionPlanPage";
import QualityDashboardPage from "../SewwingLine/QualityDashboardPage";
import SampleInspectionPage from "../FGsWH/SampleInspectionPage";
import SkillMatrixPage from "../SewwingLine/SkillMatrixPage";
import ToolStatusDashboardPage from "../SewwingLine/ToolStatusDashboardPage";
import TPMDashboardPage from "../SewwingLine/TPMDashboardPage";
import UploadPackingPlanPage from "../FGsWH/UploadPackingPlanPage";
import UploadPlanloadPage from "../FGsWH/UploadPlanloadPage";
import WeeklyDailyPlanPage from "../Decoration/WeeklyDailyPlanPage";
// import QRScanInterfacePageWrapper from "./components/QRScanInterfacePageWrapper";
import HomePageWrapper from "./components/HomePageWrapper";
import ApproveRepairRequestPageWrapper from "./components/ApproveRepairRequestPageWrapper";
import RecordReworkResultPageWrapper from "./components/RecordReworkResultPageWrapper";

const AllScreens: React.FC = () => {
  type PageComponent = React.ComponentType<Record<string, unknown>>;
  const pages: { name: string; component: PageComponent }[] = [
    { name: "HomePageWrapper", component: HomePageWrapper },
    {
      name: "InboundDashboardPage (Fabric)",
      component: InboundDashboardPageWrapper,
    },
    // {
    //   name: "QRScanInterfacePage (Fabric)",
    //   component: QRScanInterfacePageWrapper,
    // },
    {
      name: "IssueTransactionReportsPage (Fabric)",
      component: IssueTransactionReportsPageWrapper,
    },
    {
      name: "IssueFabricFromJobPage",
      component: IssueFabricFromJobPageWrapper,
    },
    {
      name: "AccessoryIssueTransactionReportsPage",
      component: AccessoryIssueTransactionReportsPageWrapper,
    },
    {
      name: "IssueAccessoryFormPage",
      component: IssueAccessoryFormPageWrapper,
    },
    {
      name: "PackagingIssueTransactionReportsPage",
      component: PackagingIssueTransactionReportsPage,
    },
    {
      name: "IssuePackagingFormPage",
      component: IssuePackagingFormPageWrapper,
    },
    { name: "MasterPlanPage (Cutting)", component: MasterPlanPage },
    {
      name: "CuttingWeeklyDailyPlanPage",
      component: CuttingWeeklyDailyPlanPage,
    },
    {
      name: "CuttingDashboardPerformance",
      component: CuttingDashboardPerformanceWrapper,
    },
    { name: "ToolManagementPage", component: ToolManagementPage },
    { name: "ActionPlanPage (Shared)", component: ActionPlanPageWrapper },
    { name: "KanbanReportPage", component: KanbanReportPage },
    { name: "BufferScanPage", component: BufferScanPage },
    { name: "BufferReportPage", component: BufferReportPage },
    { name: "SupermarketScanPage", component: SupermarketScanPage },
    { name: "SupermarketReportPage", component: SupermarketReportPage },
    { name: "WipDashboardPage", component: WipDashboardPage },
    { name: "WeeklyDailyPlanPage", component: WeeklyDailyPlanPage },
    { name: "WorkPlanPage", component: WorkPlanPage },
    { name: "BufferScanInPage", component: BufferScanInPageWrapper },
    { name: "BufferScanOutPage", component: BufferScanOutPageWrapper },
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
    { name: "ProductionPlanPage", component: ProductionPlanPage },
    { name: "KanbanMonitoringPage", component: KanbanMonitoringPageWrapper },
    { name: "EFFDashboardPage", component: EFFDashboardPageWrapper },
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
    { name: "UploadPackingPlanPage", component: UploadPackingPlanPage },
    { name: "PackingPlanReportPage", component: PackingPlanReportPage },
    { name: "UploadPlanloadPage", component: UploadPlanloadPage },
    {
      name: "FgWhMonitoringReportPage",
      component: FgWhMonitoringReportPageWrapper,
    },
    { name: "SampleInspectionPage", component: SampleInspectionPage },
    { name: "GarmentInspectionPage", component: GarmentInspectionPageWrapper },
    { name: "LocationManagementPage", component: LocationManagementPage },
    { name: "AuditLogPage", component: AuditLogPageWrapper },
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
