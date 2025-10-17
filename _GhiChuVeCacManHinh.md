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

Khi ấn vào chức năng quét mã QR chung chỉ hiện thị màn hình Scan QR (giống ảnh đính kèm),
khi thực hiện quét mã QR sẽ tự động nhận biết được đó là mã QR vải, mã QR vị trí kho, mã QR phiếu yêu cầu xuất vải.

- Nếu thực hiện quét mã QR vị trí kho đầu tiên thì sẽ hệ thống sẽ tự hiểu là thực hiện chức năng cất vải vào kho. Chức năng cất vải vào kho sẽ bao gồm 3 bước:

1. Quét mã QR vị trí kho
2. Quét mã QR vải (có thể quét nhiều mã QR vải)
3. Bấm nút "Hoàn tất" để hoàn tất cất vải vào kho. Khi hoàn tất sẽ hiển thị bảng tạm chứa các thông tin cuộn vải đã được cất vào kho.

- Nếu thực hiện quét mã QR vải đầu tiên thì hệ thống sẽ tự hiểu là thực hiện chức năng chuyển vải từ vị trí này sang vị trí khác. Chức năng chuyển vải sẽ bao gồm 2 bước:

1. Quét mã QR vải (chỉ được quét 1 mã QR vải)
2. Quét mã QR vị trí kho mới để chuyển vải đến vị trí kho mới. Khi hoàn tất sẽ hiển thị thông báo đã chuyển vải thành công.

- Nếu thực hiện quét mã QR phiếu yêu cầu xuất vải thì hệ thống sẽ tự hiểu là thực hiện chức năng xuất kho, soạn hàng. Chức năng xuất kho, soạn hàng sẽ bao gồm 2 bước:

1. Quét mã QR phiếu yêu cầu xuất vải (chỉ được quét 1 mã QR phiếu yêu cầu xuất vải)
2. Quét mã QR vải (có thể quét nhiều mã QR vải)
3. Bấm nút "Hoàn tất" để hoàn tất xuất kho, soạn hàng. Khi hoàn tất sẽ hiển thị bảng tạm chứa các thông tin cuộn vải đã được xuất kho.

Bỏ các chức năng xuất phụ liệu, xuất đóng gói vào trong chức năng Scan QR.

7. Xuất Vải
8. Xuất Phụ liệu
9. Xuất đóng gói
10. Báo cáo xuất kho
11. Upload Packing List

- Khi upload 1 file excel packingList lên thì phải đảm bảo file excel các cột sau:
  Số PO (PO Number) Số Purchase Order của cuộn vải.
  Mã Item (Item Code) Chính xác chuỗi ký tự mã vật tư mà hệ thống đã đọc được từ file.
  Màu sắc (Color) Tên hoặc mã màu của cuộn vải.
  Số cuộn (Roll No.) Số thứ tự cuộn vải do nhà cung cấp đánh.
  Số Lô / Mẻ (Lot / Batch No.) Số lô/mẻ sản xuất.
  Số Yards (Yards) Chiều dài cuộn vải (Yards).
  KL Tịnh (Kgs) (Net Weight) Trọng lượng tịnh (Net Weight) của cuộn vải.
  KL Cả bì (Kgs) (Gross Weight) Trọng lượng cả bì (Gross Weight).
  Chiều rộng khổ vải(Width) Chiều rộng khổ vải
  Vị trí kho (Warehouse Location) Vị trí sẽ lưu trữ cuộn vải này trong kho của bạn.

- Khi upload lên sẽ hiển thị bảng dữ liệu gồm các cột như trên để review trước khi xác nhận tải lên hệ thống.

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

Khi bắt đầu vào ứng dụng, sẽ hiển thị 3 module chính là: Kho vải, Kho phụ liệu, kho đóng gói.
Khi ấn vào từng module sẽ hiển thị các chức năng tương ứng trong module đó. Có nút để quay về màn hình chính 3 module.

Ở bước quét mã QR vải khi xuất vải theo phiếu yêu cầu xuất vải, khi quét xong 1 QR vải thì ghi nhận thành công đồng thời tự động trở về màn hình quét mã QR vải để tiếp tục quét các mã QR vải tiếp theo, không cần phải ở màn hình Phiếu yêu cầu xuất kho rồi bấm nút "Bắt đầu quét hàng" nữa.

- Ở bước quét mã QR vải khi xuất vải theo phiếu yêu cầu xuất vải, khi quét xong đủ số lượng vải theo yêu cầu của phiếu xuất kho thì tự động hiện thông báo đã quét đủ số lượng vải theo yêu cầu của phiếu xuất kho.
- Ở màn hình thành công khi thực hiện cất vải vào kho, sẽ hiện thị 1 bảng danh sách các cuộn vải đã được cất vào kho trong lần quét vừa rồi, bao gồm các thông tin: Mã cuộn vải, Mã vị trí kho, Thời gian, màu sắc, chiều dài, số mét, trọng lượng.

Tạo 1 bảng dữ liệu excel mẫu cho việc upload Packing List, gồm các cột sau đây:

Số PO (PO Number) Số Purchase Order của cuộn vải.
Mã Item (Item Code) Chính xác chuỗi ký tự mã vật tư mà hệ thống đã đọc được từ file.
Màu sắc (Color) Tên hoặc mã màu của cuộn vải.
Số cuộn (Roll No.) Số thứ tự cuộn vải do nhà cung cấp đánh.
Số Lô / Mẻ (Lot / Batch No.) Số lô/mẻ sản xuất.
Số Yards (Yards) Chiều dài cuộn vải (Yards).
KL Tịnh (Kgs) (Net Weight) Trọng lượng tịnh (Net Weight) của cuộn vải.
KL Cả bì (Kgs) (Gross Weight) Trọng lượng cả bì (Gross Weight).
Chiều rộng khổ vải(Width) Chiều rộng khổ vải
Vị trí kho (Warehouse Location) Vị trí sẽ lưu trữ cuộn vải này trong kho của bạn.
QR Code (QR Code) Mã QR của cuộn vải
QC Status (QC Status) Trạng thái QC của cuộn vải (Passed/Failed/Pending)
Date Received (Date Received) Ngày nhận cuộn vải
Printed (Printed) Trạng thái đã in mã QR hay chưa (Yes/No)
