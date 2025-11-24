# Báo Cáo Phân Tích Module Warehouse

Dựa trên việc phân tích mã nguồn trong thư mục `src/pages/Warehouse`, dưới đây là tổng hợp về các luồng nghiệp vụ, mô hình IPO, các bên liên quan và giá trị cốt lõi của hệ thống.

## 1. Các Luồng Chính (Main Flows)
Hệ thống Warehouse có 4 luồng nghiệp vụ chính xoay quanh vòng đời của nguyên phụ liệu (đặc biệt là Vải):

### A. Luồng Nhập Kho (Inbound / Import)
- **Mục đích:** Đưa dữ liệu Packing List từ nhà cung cấp vào hệ thống và tạo định danh (QR Code) cho từng cuộn/kiện.
- **File chính:** `ImportPackingListFormPage.tsx`
- **Hoạt động:**
    1. Upload file Excel Packing List.
    2. Hệ thống parse và validate dữ liệu (PO, Item Code, Số lượng, Màu...).
    3. Tạo lô nhập (Inbound Shipment) và sinh mã QR duy nhất cho từng item.

### B. Luồng Quản Lý Tồn Kho (Inventory Management)
- **Mục đích:** Theo dõi trạng thái, vị trí và số lượng thực tế trong kho.
- **File chính:** `InventoryListPage.tsx`
- **Hoạt động:**
    1. Hiển thị danh sách tồn kho với các trạng thái QC (Passed/Failed/Pending).
    2. Quản lý vị trí (Location) và lịch sử di chuyển.
    3. In lại tem nhãn, điều chuyển kho.

### C. Luồng Xử Lý Vải (Fabric Processing - Relax)
- **Mục đích:** Đảm bảo vải được xả (relax) đủ thời gian trước khi cắt để tránh co rút thành phẩm.
- **File chính:** `FabricRelaxScreen.tsx`
- **Hoạt động:**
    1. Scan QR trạm xả (Station) -> Scan QR vải.
    2. Hệ thống đếm ngược thời gian xả (so sánh Standard Hour vs Actual).
    3. Xác nhận hoàn thành xả để vải đủ điều kiện cấp phát.

### D. Luồng Xuất Kho (Outbound / Issue)
- **Mục đích:** Cấp phát nguyên liệu cho sản xuất dựa trên Kế hoạch cắt (Cutting Plan).
- **File chính:** `IssueFabricFromJobPage.tsx`
- **Hoạt động:**
    1. Chọn JOB/Kế hoạch cắt từ ERP.
    2. Hệ thống tính toán lượng vải cần thiết.
    3. Gợi ý các cuộn vải phù hợp (FIFO, cùng Lot/Màu).
    4. Scan QR để xác nhận xuất kho (trừ lùi số lượng tồn).

---

## 2. Mô Hình IPO (Input - Process - Output)

| Luồng | Input (Đầu vào) | Process (Xử lý) | Output (Đầu ra) |
|-------|-----------------|-----------------|-----------------|
| **Nhập Kho** | File Excel Packing List, Thông tin PO | Validate format, Mapping dữ liệu, Sinh mã ID/QR | Dữ liệu tồn kho ban đầu, Tem QR Code |
| **Tồn Kho** | Dữ liệu QC, Lệnh điều chuyển | Cập nhật trạng thái QC, Ghi log vị trí | Báo cáo tồn kho, Lịch sử truy vết |
| **Xả Vải** | Cuộn vải (QR), Quy định giờ xả | Bấm giờ, Kiểm tra điều kiện (Time Check) | Trạng thái "Relaxed", Sẵn sàng cắt |
| **Xuất Kho** | Yêu cầu từ JOB (Cutting Plan) | Tính toán thiếu/đủ, Gợi ý cuộn (Allocation), Trừ kho | Phiếu xuất kho, Cập nhật Balance |

---

## 3. Các Bên Liên Quan (Stakeholders) & Người Dùng

1. **Nhân viên Kho (Warehouse Staff):**
   - Người dùng trực tiếp và thường xuyên nhất.
   - Thao tác: Upload file, Scan QR nhập/xuất, Sắp xếp vị trí, Scan xả vải.
2. **Bộ phận Kế hoạch (Planning / Merchandiser):**
   - Người ảnh hưởng: Cung cấp dữ liệu đầu vào (PO, Cutting Plan).
   - Thao tác: Theo dõi tiến độ về vải để lên lịch sản xuất.
3. **Bộ phận QC (Quality Control):**
   - Người ảnh hưởng: Quyết định vải có được dùng hay không.
   - Thao tác: Cập nhật trạng thái QC (Passed/Failed) trên hệ thống kho.
4. **Bộ phận Sản xuất (Factory/Cutting):**
   - Người thụ hưởng: Nhận nguyên liệu đúng, đủ và đúng chất lượng (đã xả).

---

## 4. Kết Quả & Giá Trị (Value)

### Giá trị cuối cùng:
- **Chính xác (Accuracy):** Loại bỏ sai sót nhập liệu thủ công nhờ import Excel và Scan QR.
- **Truy xuất nguồn gốc (Traceability):** Biết chính xác cuộn vải nào dùng cho JOB nào, lịch sử đi qua những đâu.
- **Kiểm soát quy trình (Process Control):**
    - Không cho phép xuất vải chưa đạt QC.
    - Không cho phép xuất vải chưa xả đủ giờ (đối với loại vải cần xả).
    - Cảnh báo thiếu hụt (Shortage) ngay khi lập lệnh xuất.

### Cách đạt được:
- Sử dụng **Mã QR** định danh duy nhất cho từng đơn vị quản lý (cuộn/kiện).
- Tích hợp chặt chẽ giữa **Dữ liệu Kế hoạch (JOB)** và **Dữ liệu Kho thực tế**.
- Số hóa các quy trình vật lý (Xả, Di chuyển) thành các thao tác trên phần mềm (Scan, Confirm).
