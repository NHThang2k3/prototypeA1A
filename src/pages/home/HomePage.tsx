// Path: src/pages/home/HomePage.tsx
import { Link } from "react-router-dom";
import {
  Boxes,
  Package,
  Shirt,
  // Scissors
} from "lucide-react";

const modules = [
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
  // {
  //   name: "Cutting",
  //   path: "/cutting",
  //   icon: Scissors,
  //   description:
  //     "Manage master plans, cutting processes, and performance tracking.",
  // },
];

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
          Warehouse System
        </h1>
        <p className="text-lg text-gray-600">
          Please select a module to get started
        </p>
      </header>

      {/* Cập nhật grid để hỗ trợ 4 cột trên màn hình lớn */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {modules.map((module) => (
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

      <footer className="mt-16 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Wata Tech. All Rights Reserved.</p>
        <Link to="/admin" className="text-gray-100 ">
          Admin
        </Link>
      </footer>
    </div>
  );
};

export default HomePage;
