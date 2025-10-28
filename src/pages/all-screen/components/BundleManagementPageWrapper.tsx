import React, { useState } from "react";
import BundleManagementPage from "../../bundle-management/BundleManagementPage";
import ImportJobModal from "../../bundle-management/components/ImportJobModal";
import UpdateJobModal from "../../bundle-management/components/UpdateJobModal";
import { sampleJobs } from "../../bundle-management/data";
import type { Job } from "../../bundle-management/types";

const BundleManagementPageWrapper: React.FC = () => {
  const [isImportModalOpen, setImportModalOpen] = useState(true);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(true);

  // Use a dummy job for the UpdateJobModal
  const dummyJob: Job = sampleJobs[0];

  const handleSaveJob = (updatedJob: Job) => {
    console.log("Saving job:", updatedJob);
    setUpdateModalOpen(false);
  };

  // Lớp CSS dùng để override hành vi của modal, biến nó thành component phẳng
  const modalOverrideClasses = `
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
    [&>div]:!block

    /* --- Chỉnh lại style cho div chứa nội dung (card) bên trong --- */
    /* Căn giữa card nội dung theo chiều ngang */
    [&>div>div]:!mx-auto
    /* Thêm khoảng cách ở trên để tách khỏi component ở trên */
    [&>div>div]:!mt-6
    /* Thêm khoảng cách ở dưới để các modal không dính vào nhau */
    [&>div>div]:!mb-6
  `;

  return (
    <div className="flex flex-col">
      <BundleManagementPage />

      {/* --- THAY ĐỔI Ở ĐÂY --- */}
      {/* Bọc mỗi modal trong một div với các lớp CSS override */}

      <div className={modalOverrideClasses}>
        <ImportJobModal
          isOpen={isImportModalOpen}
          onClose={() => setImportModalOpen(false)}
        />
      </div>

      <div className={modalOverrideClasses}>
        {dummyJob && (
          <UpdateJobModal
            isOpen={isUpdateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            job={dummyJob}
            onSave={handleSaveJob}
          />
        )}
      </div>
    </div>
  );
};

export default BundleManagementPageWrapper;
