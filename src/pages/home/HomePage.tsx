// Path: src/pages/home/HomePage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  Package,
  Shirt,
  Factory,
  Scissors,
  KanbanSquare,
  Cog,
  Warehouse,
  Palette,
  ArrowLeft,
  LayoutDashboard,
  AppWindow,
  type LucideIcon,
} from "lucide-react";

type Module = {
  name: string;
  path?: string;
  icon: LucideIcon;
  description: string;
  isGroup?: boolean;
};

// --- Dữ liệu cho 8 module chính ---
const mainModules: Module[] = [
  {
    name: "Warehouse System",
    icon: Warehouse,
    description: "Manage fabric, accessory, and packaging warehouses.",
    isGroup: true, // Đánh dấu đây là một nhóm module
  },
  {
    name: "Cutting",
    path: "/cutting",
    icon: Scissors,
    description: "Manage plans, cutting processes, and performance.",
  },
  {
    name: "Buffer & Supermarket",
    path: "/buffer-supermarket",
    icon: KanbanSquare,
    description: "Monitor Kanban, Buffer, Supermarket, and WIP.",
  },
  {
    name: "Decoration",
    path: "/decoration",
    icon: Palette,
    description: "Manage bonding, heat press, and embroidery processes.",
  },
  {
    name: "Sewing Line",
    path: "/sewing-line",
    icon: Cog,
    description: "Full-cycle management from planning to quality control.",
  },
  {
    name: "Finished Goods WH",
    path: "/finishedgoods-warehouse",
    icon: Package,
    description: "Manage packing, inventory, and quality approval.",
  },
  {
    name: "Factory Setting",
    path: "/factory",
    icon: Factory,
    description: "Centralized factory operations and administration.",
  },
  // 2. Thêm module chính thứ 8
  {
    name: "Overall Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    description: "A comprehensive dashboard for all departments.",
  },
  {
    name: "All Screens",
    path: "/all-screens",
    icon: AppWindow,
    description:
      "A complete library of all application screens for development and review.",
  },
];

// --- Dữ liệu cho 3 module con của Warehouse ---
const warehouseSubModules: Module[] = [
  {
    name: "Fabric Warehouse",
    path: "/fabric-warehouse",
    icon: Shirt,
    description: "Manage receiving, issuing, and inventory for fabric.",
  },
  {
    name: "Accessory Warehouse",
    path: "/accessory-warehouse",
    icon: Boxes,
    description: "Manage accessories, thread, buttons, and zippers.",
  },
  {
    name: "Packaging Warehouse",
    path: "/packaging-warehouse",
    icon: Package,
    description: "Manage cartons, bags, labels, and packaging materials.",
  },
];

// Component Card dùng chung cho các module
const ModuleCard = ({
  module,
  onClick,
}: {
  module: Module;
  onClick?: () => void;
}) => {
  const cardContent = (
    <>
      <div className="bg-blue-500 text-white rounded-full p-5 mb-6 group-hover:bg-blue-600 transition-colors">
        <module.icon className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        {module.name}
      </h2>
      <p className="text-gray-500 flex-grow">{module.description}</p>
    </>
  );

  const cardClasses =
    "group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-2";

  if (module.isGroup) {
    return (
      <button onClick={onClick} className={cardClasses}>
        {cardContent}
      </button>
    );
  }

  return (
    <Link to={module.path || "/"} className={cardClasses}>
      {cardContent}
    </Link>
  );
};

const HomePage = () => {
  const [view, setView] = useState<"main" | "warehouse">("main");

  const modulesToDisplay = view === "main" ? mainModules : warehouseSubModules;
  const headerTitle = view === "main" ? "Factory System" : "Warehouse System";
  const gridCols =
    view === "main"
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {view === "warehouse" && (
          <div className="mb-8">
            <button
              onClick={() => setView("main")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Main Menu
            </button>
          </div>
        )}

        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">
            {headerTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please select a module to get started
          </p>
        </header>

        <main className={`grid ${gridCols} gap-8`}>
          {modulesToDisplay.map((module) => (
            <ModuleCard
              key={module.name}
              module={module}
              onClick={module.isGroup ? () => setView("warehouse") : undefined}
            />
          ))}
        </main>

        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Wata Tech. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
