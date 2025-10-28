import React, { useState } from "react";
import KanbanBoardPage from "../../kanban-board/KanbanBoardPage";
import TaskDetailsModal from "../../kanban-board/components/TaskDetailsModal";
import type { KanbanTask } from "../../kanban-board/types";
import { mockBoards } from "../../kanban-board/data";

const KanbanBoardPageWrapper: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Use a dummy task for the TaskDetailsModal
  const dummyTask: KanbanTask = mockBoards[0].tasks[0];

  return (
    <div className="flex flex-col">
      <KanbanBoardPage />

      {isModalOpen && dummyTask && (
        // --- THAY ĐỔI Ở ĐÂY ---
        // Chúng ta bọc TaskDetailsModal trong một div.
        // Div này sẽ sử dụng các class đặc biệt của Tailwind để override CSS của component con.
        <div
          className="
            /* --- Override CSS cho div gốc của Modal (lớp phủ) --- */
            /* Buộc nó phải hiển thị như một phần tử bình thường, không phải popup */
            [&>div]:!static 
            /* Gỡ bỏ các thuộc tính vị trí top/left/bottom/right */
            [&>div]:!inset-auto
            /* Bỏ z-index để nó không đè lên các phần tử khác */
            [&>div]:!z-auto
            /* Làm cho lớp nền trong suốt */
            [&>div]:!bg-transparent
            /* Xóa padding của lớp phủ để không có khoảng trống thừa */
            [&>div]:!p-0
            /* Tắt flexbox để không căn giữa nữa */
            [&>div]:block

            /* --- Chỉnh lại style cho div chứa nội dung (card) bên trong --- */
            /* Căn giữa card nội dung theo chiều ngang */
            [&>div>div]:mx-auto
            /* Thêm khoảng cách ở trên để tách khỏi component KanbanBoardPage */
            [&>div>div]:mt-4
          "
        >
          <TaskDetailsModal
            task={dummyTask}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default KanbanBoardPageWrapper;
