// Path: src/pages/home/HomePage.tsx
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
} from "lucide-react";

// Modules cho Warehouse System
const warehouseModules = [
  {
    name: "Fabric Warehouse",
    path: "/fabric-warehouse",
    icon: Shirt,
    description:
      "Manage receiving, issuing, and inventory for fabric materials.",
  },
  {
    name: "Accessory Warehouse",
    path: "/accessory-warehouse",
    icon: Boxes,
    description:
      "Manage accessories, thread, buttons, zippers, and other supplies.",
  },
  {
    name: "Packaging Warehouse",
    path: "/packaging-warehouse",
    icon: Package,
    description: "Manage packaging materials like cartons, bags, and labels.",
  },
];

// Modules cho Cutting
const cutting = [
  {
    name: "Cutting",
    path: "/cutting",
    icon: Scissors,
    description:
      "Manage master plans, cutting processes, and performance tracking.",
  },
];

const decoration = [
  {
    name: "Decoration", // <-- Module mới
    path: "/decoration",
    icon: Palette,
    description:
      "Manage decoration processes like bonding, heat press, and embroidery.",
  },
];

const bufferAndSupermarket = [
  {
    name: "Buffer & Supermarket", // <-- Module mới
    path: "/buffer-supermarket",
    icon: KanbanSquare,
    description: "Monitor Kanban, Buffer, Supermarket, and WIP dashboards.",
  },
];

const sewingLine = [
  {
    name: "Sewing Line", // <-- Module mới
    path: "/sewing-line",
    icon: Cog,
    description:
      "Full-cycle sewing line management from planning to quality control.",
  },
];

const finishedgoodsWarehouse = [
  {
    name: "Finished Goods WH", // <-- Module mới
    path: "/finishedgoods-warehouse",
    icon: Warehouse,
    description:
      "Manage packing plans, inventory, and quality approval for finished products.",
  },
];

// Module cho Factory Setting
const factoryModules = [
  {
    name: "Factory",
    path: "/factory",
    icon: Factory,
    description: "Centralized factory operations and administration.",
  },
];

const HomePage = () => {
  return (
    <div className="h-screen w-full overflow-y-auto bg-gray-100">
      <div className="flex flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="my-12 w-full max-w-7xl " />
        {/* --- PHẦN WAREHOUSE SYSTEM (3 MODULES) --- */}
        <div className="w-full max-w-7xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
              Warehouse System
            </h1>
            <p className="text-lg text-gray-600">
              Please select a module to get started
            </p>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {warehouseModules.map((module) => (
              <Link
                key={module.name}
                to={module.path}
                className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-2"
              >
                <div className="bg-blue-500 text-white rounded-full p-5 mb-6 group-hover:bg-blue-600 transition-colors">
                  <module.icon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {module.name}
                </h2>
                <p className="text-gray-500">{module.description}</p>
              </Link>
            ))}
          </main>
        </div>

        {/* Dải phân cách giữa 2 phần */}
        <div className="my-28 w-full max-w-7xl border-t border-gray-200" />

        {/* --- PHẦN CUTTING (1 MODULE) --- */}
        <div className="w-full max-w-7xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
              Cutting
            </h1>
            <p className="text-lg text-gray-600">
              Please select a module to get started
            </p>
          </header>
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {cutting.map((module) => (
              <Link
                key={module.name}
                to={module.path}
                className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-2"
              >
                <div className="bg-blue-500 text-white rounded-full p-5 mb-6 group-hover:bg-blue-600 transition-colors">
                  <module.icon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {module.name}
                </h2>
                <p className="text-gray-500">{module.description}</p>
              </Link>
            ))}
          </main>
        </div>

        {/* Dải phân cách giữa 2 phần */}
        <div className="my-28 w-full max-w-7xl border-t border-gray-200" />

        {/* --- PHẦN DECORATION (1 MODULE) --- */}
        <div className="w-full max-w-7xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
              Decoration
            </h1>
            <p className="text-lg text-gray-600">
              Please select a module to get started
            </p>
          </header>
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {decoration.map((module) => (
              <Link
                key={module.name}
                to={module.path}
                className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-2"
              >
                <div className="bg-blue-500 text-white rounded-full p-5 mb-6 group-hover:bg-blue-600 transition-colors">
                  <module.icon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {module.name}
                </h2>
                <p className="text-gray-500">{module.description}</p>
              </Link>
            ))}
          </main>
        </div>

        {/* Dải phân cách giữa 2 phần */}
        <div className="my-28 w-full max-w-7xl border-t border-gray-200" />

        {/* --- PHẦN BUFFER & SUPERMARKET (1 MODULE) --- */}
        <div className="w-full max-w-7xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
              Buffer & Supermarket
            </h1>
            <p className="text-lg text-gray-600">
              Please select a module to get started
            </p>
          </header>
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {bufferAndSupermarket.map((module) => (
              <Link
                key={module.name}
                to={module.path}
                className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-2"
              >
                <div className="bg-blue-500 text-white rounded-full p-5 mb-6 group-hover:bg-blue-600 transition-colors">
                  <module.icon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {module.name}
                </h2>
                <p className="text-gray-500">{module.description}</p>
              </Link>
            ))}
          </main>
        </div>

        {/* Dải phân cách giữa 2 phần */}
        <div className="my-28 w-full max-w-7xl border-t border-gray-200" />

        {/* --- PHẦN SEWING LINE (1 MODULE) --- */}
        <div className="w-full max-w-7xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
              Sewing Line
            </h1>
            <p className="text-lg text-gray-600">
              Please select a module to get started
            </p>
          </header>
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {sewingLine.map((module) => (
              <Link
                key={module.name}
                to={module.path}
                className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-2"
              >
                <div className="bg-blue-500 text-white rounded-full p-5 mb-6 group-hover:bg-blue-600 transition-colors">
                  <module.icon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {module.name}
                </h2>
                <p className="text-gray-500">{module.description}</p>
              </Link>
            ))}
          </main>
        </div>

        {/* Dải phân cách giữa 2 phần */}
        <div className="my-28 w-full max-w-7xl border-t border-gray-200" />

        {/* --- PHẦN FINISHED GOODS WAREHOUSE (1 MODULE) --- */}
        <div className="w-full max-w-7xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
              Finished Goods Warehouse
            </h1>
            <p className="text-lg text-gray-600">
              Please select a module to get started
            </p>
          </header>
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {finishedgoodsWarehouse.map((module) => (
              <Link
                key={module.name}
                to={module.path}
                className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-2"
              >
                <div className="bg-blue-500 text-white rounded-full p-5 mb-6 group-hover:bg-blue-600 transition-colors">
                  <module.icon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {module.name}
                </h2>
                <p className="text-gray-500">{module.description}</p>
              </Link>
            ))}
          </main>
        </div>

        {/* Dải phân cách giữa 2 phần */}
        <div className="my-28 w-full max-w-7xl border-t border-gray-200" />

        {/* --- PHẦN FACTORY SETTING (1 MODULE) --- */}
        <div className="w-full max-w-7xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
              Factory Setting
            </h1>
            <p className="text-lg text-gray-600">
              Please select a module to get started
            </p>
          </header>
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {factoryModules.map((module) => (
              <Link
                key={module.name}
                to={module.path}
                className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-2"
              >
                <div className="bg-blue-500 text-white rounded-full p-5 mb-6 group-hover:bg-blue-600 transition-colors">
                  <module.icon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {module.name}
                </h2>
                <p className="text-gray-500">{module.description}</p>
              </Link>
            ))}
          </main>
        </div>

        <footer className="mt-16 text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Wata Tech. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
