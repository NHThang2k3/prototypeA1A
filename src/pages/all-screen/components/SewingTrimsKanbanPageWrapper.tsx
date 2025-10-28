import React from "react";
import SewingTrimsKanbanPage from "../../sewing-trims-kanban/SewingTrimsKanbanPage";
import SewingTrimsTaskDetailsModal from "../../sewing-trims-kanban/components/SewingTrimsTaskDetailsModal";
import { mockSewingBoard } from "../../sewing-trims-kanban/data";

const SewingTrimsKanbanPageWrapper: React.FC = () => {
  // Lấy một task mẫu từ dữ liệu giả để hiển thị trong modal
  // Chọn task có `remarks` để hiển thị đầy đủ các trường
  const dummyTask = mockSewingBoard[0].tasks.find(
    (task) => task.id === "KB-003"
  );

  return (
    <div className="flex flex-col space-y-8">
      {/* 1. Render trang Kanban như bình thường */}
      <div className="border rounded-lg shadow-inner overflow-hidden">
        {/* Giới hạn chiều cao để trang không quá dài */}
        <div className="h-[800px]">
          <SewingTrimsKanbanPage />
        </div>
      </div>

      {/* 2. Render Modal chi tiết như một thành phần tĩnh để review */}
      {dummyTask && (
        <div className="border-t-2 border-dashed border-gray-300 pt-8">
          <h3 className="text-xl font-bold text-center text-gray-600 mb-6">
            --- Modal Showcase: Task Details ---
          </h3>
          <div
            className="
              [&>div]:!static 
              [&>div]:!inset-auto
              [&>div]:!z-auto
              [&>div]:!bg-transparent
              [&>div]:!p-0
              [&>div]:block

              [&>div>div]:mx-auto
            "
          >
            <SewingTrimsTaskDetailsModal
              task={dummyTask}
              onClose={() => {}} // Hàm rỗng, không cần chức năng đóng
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SewingTrimsKanbanPageWrapper;
