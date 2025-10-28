import React from "react";
// Import các icon cần thiết, giống như file gốc
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
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

// --- START: Sao chép cấu trúc và dữ liệu từ HomePage.tsx ---
// Do component gốc quản lý state bên trong và không export các thành phần con,
// chúng ta cần định nghĩa lại chúng ở đây để trưng bày cả 2 giao diện.

type Module = {
  name: string;
  icon: LucideIcon;
  description: string;
  isGroup?: boolean;
};

// Dữ liệu cho 8 module chính
const mainModules: Module[] = [
  {
    name: "Warehouse System",
    icon: Warehouse,
    description: "Manage fabric, accessory, and packaging warehouses.",
    isGroup: true,
  },
  {
    name: "Cutting",
    icon: Scissors,
    description: "Manage plans, cutting processes, and performance.",
  },
  {
    name: "Buffer & Supermarket",
    icon: KanbanSquare,
    description: "Monitor Kanban, Buffer, Supermarket, and WIP.",
  },
  {
    name: "Decoration",
    icon: Palette,
    description: "Manage bonding, heat press, and embroidery processes.",
  },
  {
    name: "Sewing Line",
    icon: Cog,
    description: "Full-cycle management from planning to quality control.",
  },
  {
    name: "Finished Goods WH",
    icon: Package,
    description: "Manage packing, inventory, and quality approval.",
  },
  {
    name: "Factory Setting",
    icon: Factory,
    description: "Centralized factory operations and administration.",
  },
  {
    name: "Overall Dashboard",
    icon: LayoutDashboard,
    description: "A comprehensive dashboard for all departments.",
  },
];

// Dữ liệu cho 3 module con của Warehouse
const warehouseSubModules: Module[] = [
  {
    name: "Fabric Warehouse",
    icon: Shirt,
    description: "Manage receiving, issuing, and inventory for fabric.",
  },
  {
    name: "Accessory Warehouse",
    icon: Boxes,
    description: "Manage accessories, thread, buttons, and zippers.",
  },
  {
    name: "Packaging Warehouse",
    icon: Package,
    description: "Manage cartons, bags, labels, and packaging materials.",
  },
];

// Component Card tĩnh (loại bỏ Link và onClick để tránh điều hướng)
const StaticModuleCard = ({ module }: { module: Module }) => (
  <div className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-2">
    <div className="bg-blue-500 text-white rounded-full p-5 mb-6 group-hover:bg-blue-600 transition-colors">
      <module.icon className="w-10 h-10" />
    </div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{module.name}</h2>
    <p className="text-gray-500 flex-grow">{module.description}</p>
  </div>
);

// --- END: Sao chép cấu trúc và dữ liệu ---

const HomePageWrapper: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-16">
      {/* 1. Render giao diện chính (Main View) */}
      <div>
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Showcase: Main Menu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please select a module to get started
          </p>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mainModules.map((module) => (
            <StaticModuleCard key={module.name} module={module} />
          ))}
        </main>
      </div>

      <div className="border-t-2 border-dashed border-gray-300"></div>

      {/* 2. Render giao diện con của Warehouse (Sub-menu View) */}
      <div>
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Showcase: Warehouse System Sub-Menu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please select a module to get started
          </p>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {warehouseSubModules.map((module) => (
            <StaticModuleCard key={module.name} module={module} />
          ))}
        </main>
      </div>
    </div>
  );
};

export default HomePageWrapper;
