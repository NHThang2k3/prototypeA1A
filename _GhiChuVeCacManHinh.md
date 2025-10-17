1. Inbound Dashboard
2. Packing List / Print QR
   Bảng trong Packing List gồm các cột cơ bản: PO, Item, Description, Color, Lot, Quantity, Unit, Trạng thái (In hay chưa In)
   Cho phép chọn nhiều hàng để in QR code, in lại QR code.
   mỗi dòng hàng cần được chia thành nhiều đơn vị thực tế (cuộn, thùng) với mã QR riêng.
   Cập nhật cần thiết:
   Thêm chức năng "Phân rã Lô hàng" (Breakdown): Sau khi có danh sách vật tư từ Packing List, phải có một bước cho phép người dùng nhập chi tiết cho từng dòng.
   Ví dụ: Dòng "Vải Cotton - 1500m", người dùng có thể thêm 10 dòng con: "Cuộn 1: 150m", "Cuộn 2: 148.5m",...
   Thay đổi logic "In tem": Chức năng in tem phải hoạt động dựa trên các dòng đã được phân rã, sinh ra một mã QR duy nhất cho mỗi cuộn vải, mỗi thùng hàng. Dữ liệu của mã QR này phải được lưu vào cơ sở dữ liệu trung tâm.
3. Inventory
   Cho phép chuyển kho, chuyển vị trí trong kho.
4. Kanban
5. Location
6. Scan QR

- Cập nhật lại quy trình cất vải vào kho như sau:
  Bước 1: Quét mã QR của vị trí kho (Location)
  Bước 2: Lần lượt quét mã QR của các cuộn vải (Roll)
  Bước 3: Bấm nút "Hoàn tất" để hệ thống ghi nhận các cuộn vải đã được cất vào vị trí kho đã chọn, đồng thời hiện thị danh sách các cuộn vải đã được quét thành công.
- Cập nhật lại quy trình chuyển vải từ vị trí này sang vị trí khác như sau:
  Bước 1: Quét mã QR trên cuộc vải cần chuyển (Lúc này vị trí kho hiện tại của cuộn vải sẽ được gỡ bỏ)
  Bước 2: Quét mã QR của vị trí kho mới (Location), hệ thống sẽ ghi nhận và thông báo đã chuyển vải thành công.
- Cập nhật lại quy trình xuất kho, soạn hàng như sau: Bỏ qua bước xác nhận số lượng xuất, tự động lấy hết số lượng vải trong cuộn đã quét để xuất kho.
- Tách ra quét vải, quét phụ liệu, quét đóng gói thành 3 chức năng riêng biệt, mỗi chức năng có quy trình quét tương tự như trên. thiết kế các nút chuyển đổi giữa các chức năng quét.

7. Xuất Vải
8. Xuất Phụ liệu
9. Xuất đóng gói
10. Báo cáo xuất kho
11. Upload Packing List
    Khi upload file Packing List lên thì cho phép review trước khi xác nhận tải lên.

Cho thanh layout Warehouse bên trái có thể mở to hoặc thu gọn lại
Nội dung cấu trúc layout Warehouse bên trái như sau, khi ấn vào từng mục có thể mở rộng ra hoặc thu nhỏ lại các mục con bên trong:
Productivity
├─Kanban Board & Planning
│ ├── Dashboard Hàng Nhập
│ ├── Quản lý Tồn Kho
│ └── Bảng Kanban
├─Receipt
│ ├── Upfile Packing List
│ ├── QL Packing List/InQR
│ ├── Chi tiết lô hàng
│ └── Báo cáo xuất kho
├─Inventory Tracking
│ ├── Tạo Phiếu xuất vải
│ ├── tạo phiếu xuất phụ liệu
│ └── tạo phiếu xuất đóng gói
└─Delivery transaction
│ ├── Quản lý vị trí
│ └── Quét mã QR
Quality
├── QC Management (Reuse)
├── Record Supplier KPI (Reuse)
├── Material Issue Notification (Reuse)
└── Action Plan
Availability (Other Phase)
Ability (Other Phase)

Khi bắt đầu vào ứng dụng, sẽ hiển thị 6 module chính là: Warehouse, Cutting, Sewing, Buffer/Supermarket, Decoration, Finish Goods WH.
Khi ấn vào từng module sẽ hiển thị các chức năng tương ứng trong module đó. Có nút để quay về màn hình chính 6 module.
