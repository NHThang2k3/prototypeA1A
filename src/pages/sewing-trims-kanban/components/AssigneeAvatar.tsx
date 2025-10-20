// Path: src/pages/kanban-board/components/AssigneeAvatar.tsx
import React from "react";
import type { Assignee } from "../types";

interface Props {
  assignee?: Assignee;
}

const AssigneeAvatar: React.FC<Props> = ({ assignee }) => {
  if (!assignee) {
    return null;
  }

  const initials = assignee.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      title={assignee.name}
      className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
    >
      {assignee.avatarUrl ? (
        <img
          src={assignee.avatarUrl}
          alt={assignee.name}
          className="w-full h-full rounded-full"
        />
      ) : (
        initials
      )}
    </div>
  );
};

export default AssigneeAvatar;
