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
  Bước 3: Bấm nút "Hoàn tất" để hệ thống ghi nhận các cuộn vải đã được cất vào vị trí kho đã chọn.
- Bỏ tính năng kiểm kê trong khi quét QR

7. Xuất Vải
8. Xuất Phụ liệu
9. Xuất đóng gói
10. Báo cáo xuất kho
11. Upload Packing List
    Khi upload file Packing List lên thì cho phép review trước khi xác nhận tải lên.
