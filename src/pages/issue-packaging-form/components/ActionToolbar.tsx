const ActionToolbar = () => {
  const handleSubmit = () => {
    // In a real app, you would gather all form data and send it to an API.
    alert("Yêu cầu đã được gửi đi! (logic giả lập)");
  };

  return (
    <div className="sticky bottom-0 bg-white bg-opacity-80 backdrop-blur-sm border-t border-gray-200 p-4 mt-8">
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Lưu nháp
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Gửi Yêu cầu
        </button>
      </div>
    </div>
  );
};

export default ActionToolbar;
