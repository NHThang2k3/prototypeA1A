// Path: src/pages/home/HomePage.tsx
import { Link } from "react-router-dom";
import { Boxes, Package, Shirt } from "lucide-react";

const modules = [
  {
    name: "Kho Vải",
    path: "/fabric-warehouse",
    icon: Shirt,
    description: "Quản lý nhập, xuất, tồn kho cho nguyên liệu vải.",
  },
  {
    name: "Kho Phụ Liệu",
    path: "/accessory-warehouse",
    icon: Boxes,
    description: "Quản lý phụ liệu, chỉ, nút, khóa kéo và các vật tư khác.",
  },
  {
    name: "Kho Đóng Gói",
    path: "/packaging-warehouse",
    icon: Package,
    description: "Quản lý vật tư đóng gói như thùng carton, túi, nhãn mác.",
  },
];

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Hệ Thống Quản Lý Kho
        </h1>
        <p className="text-lg text-gray-600">
          Vui lòng chọn module để bắt đầu làm việc
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {modules.map((module) => (
          <Link
            key={module.name}
            to={module.path}
            className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center transform hover:-translate-y-2"
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
      </footer>
    </div>
  );
};

export default HomePage;
