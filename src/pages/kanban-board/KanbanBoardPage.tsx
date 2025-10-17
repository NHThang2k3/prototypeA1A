// Path: src/pages/kanban-board/KanbanBoardPage.tsx
import React, { useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { mockBoards } from "./data";
import type { KanbanBoard } from "./types";
import KanbanColumn from "./components/KanbanColumn";

const KanbanBoardPage = () => {
  const [boards, setBoards] = useState<KanbanBoard[]>(mockBoards);
  const [activeBoardId, setActiveBoardId] = useState<string>(mockBoards[0].id);

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !activeBoard) return;

    // Nếu kéo card vào một vị trí khác
    if (active.id !== over.id) {
      setBoards((prevBoards) => {
        const newBoards = [...prevBoards];
        const boardIndex = newBoards.findIndex((b) => b.id === activeBoardId);
        if (boardIndex === -1) return prevBoards;

        const boardToUpdate = { ...newBoards[boardIndex] };

        // Tìm cột chứa card đang kéo (active) và cột đích (over)
        const activeContainer = boardToUpdate.columns.find((c) =>
          c.taskIds.includes(active.id as string)
        );
        let overContainer = boardToUpdate.columns.find((c) =>
          c.taskIds.includes(over.id as string)
        );
        if (!overContainer) {
          overContainer = boardToUpdate.columns.find((c) => c.id === over.id);
        }

        if (
          !activeContainer ||
          !overContainer ||
          activeContainer === overContainer
        ) {
          return prevBoards; // Không thay đổi nếu kéo trong cùng cột hoặc không tìm thấy cột
        }

        // Xóa card khỏi cột cũ
        const activeContainerIndex = boardToUpdate.columns.findIndex(
          (c) => c.id === activeContainer!.id
        );
        const newActiveTaskIds = activeContainer.taskIds.filter(
          (id) => id !== active.id
        );
        boardToUpdate.columns[activeContainerIndex] = {
          ...boardToUpdate.columns[activeContainerIndex],
          taskIds: newActiveTaskIds,
        };

        // Thêm card vào cột mới
        const overContainerIndex = boardToUpdate.columns.findIndex(
          (c) => c.id === overContainer!.id
        );
        const newOverTaskIds = [...overContainer.taskIds, active.id as string];
        boardToUpdate.columns[overContainerIndex] = {
          ...boardToUpdate.columns[overContainerIndex],
          taskIds: newOverTaskIds,
        };

        newBoards[boardIndex] = boardToUpdate;
        return newBoards;
      });
    }
  };

  if (!activeBoard) {
    return <div className="p-8">Không tìm thấy bảng công việc.</div>;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-full">
      {/* Header của trang */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Bảng Công Việc Kanban
        </h1>
        <p className="text-gray-500 mt-1">
          Trực quan hóa và theo dõi luồng yêu cầu vật tư.
        </p>
      </div>

      {/* Tabs để chuyển đổi board */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => setActiveBoardId(board.id)}
              className={`${
                board.id === activeBoardId
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
            >
              {board.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Bảng Kanban */}
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {activeBoard.columns.map((column) => {
            const tasks = column.taskIds
              .map((taskId) => activeBoard.tasks.find((t) => t.id === taskId)!)
              .filter(Boolean); // Lọc ra các task undefined nếu có lỗi dữ liệu

            return (
              <KanbanColumn key={column.id} column={column} tasks={tasks} />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoardPage;
