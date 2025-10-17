// Path: src/pages/shipment-detail/components/PageHeader.tsx

import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  children?: React.ReactNode; // For action buttons
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbItems,
  children,
}) => {
  return (
    <div className="mb-6">
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={item.label}>
              <div className="flex items-center">
                {index > 0 && (
                  <ChevronRight
                    className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2"
                    aria-hidden="true"
                  />
                )}
                <NavLink
                  to={item.href}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {item.label}
                </NavLink>
              </div>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            {title}
          </h1>
        </div>
        <div className="mt-4 flex flex-shrink-0 md:mt-0 md:ml-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
