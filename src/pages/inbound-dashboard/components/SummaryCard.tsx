import React from "react";

interface SummaryCardProps {
  icon: React.ElementType;
  title: string;
  value: number;
  color: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  icon: Icon,
  title,
  value,
  color,
}) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-4">
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};
