import { productionOrders } from "../data";

const FormHeader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <label
          htmlFor="requester"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Người yêu cầu
        </label>
        <input
          type="text"
          id="requester"
          disabled
          value="Admin (auto-filled)"
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="department"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Bộ phận
        </label>
        <input
          type="text"
          id="department"
          value="Đóng gói & Hoàn thiện"
          disabled
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="productionOrder"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tham chiếu Lệnh SX
        </label>
        <select
          id="productionOrder"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">-- Chọn Lệnh SX --</option>
          {productionOrders.map((po) => (
            <option key={po.id} value={po.id}>
              {po.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="requiredDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ngày cần hàng
        </label>
        <input
          type="date"
          id="requiredDate"
          defaultValue={new Date().toISOString().substring(0, 10)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
};

export default FormHeader;
