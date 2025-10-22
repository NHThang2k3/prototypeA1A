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

Số PO (PO Number) Số Purchase Order của cuộn vải.
Mã Item (Item Code) Chính xác chuỗi ký tự mã vật tư mà hệ thống đã đọc được từ file.
Màu sắc (Color) Tên hoặc mã màu của cuộn vải.
Số cuộn (Roll No) Số thứ tự cuộn vải do nhà cung cấp đánh.
Số Lô / Mẻ (Lot No) Số lô/mẻ sản xuất.
Số Yards (Yards) Chiều dài cuộn vải (Yards).
KL Tịnh (Kgs) (Net Weight (Kgs)) Trọng lượng tịnh (Net Weight) của cuộn vải.
KL Cả bì (Kgs) (Gross Weight (Kgs)) Trọng lượng cả bì (Gross Weight) của cuộn vải.
Chiều rộng khổ vải(Width) Chiều rộng khổ vải
Vị trí kho (Location) Vị trí sẽ lưu trữ cuộn vải này trong kho của bạn.
QR Code (QR Code) Mã QR của cuộn vải
QC Status (QC Status) Trạng thái QC của cuộn vải (Passed/Failed/Pending)
Date Received (Date Received) Ngày nhận cuộn vải
Printed (Printed) Trạng thái đã in mã QR hay chưa (Yes/No)

Color Code (Color Code) Mã màu của cuộn vải
Factory (Factory) Tên nhà máy sản xuất cuộn vải
Hour Standard (Hour Standard) Tiêu chuẩn giờ cho việc xả cuộn vải
Hour Relax (Hour Relax) Giờ xả cuộn vải thực tế
Comment (Comment) Ghi chú thêm về cuộn vải
Balance Yards (Balance Yards) Số yards còn lại trong cuộn vải
Supplier (Supplier) Tên nhà cung cấp cuộn vải
Invoice No (Invoice No) Số hóa đơn liên quan đến cuộn vải

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

Bảng Item List sẽ gồm các cột sau đây:
Số PO (PO Number) Số Purchase Order của cuộn vải.
Mã Item (Item Code) Chính xác chuỗi ký tự mã vật tư mà hệ thống đã đọc được từ file.
Màu sắc (Color) Tên hoặc mã màu của cuộn vải.
Số cuộn (Roll No) Số thứ tự cuộn vải do nhà cung cấp đánh.
Số Lô / Mẻ (Lot No) Số lô/mẻ sản xuất.
Số Yards (Yards) Chiều dài cuộn vải (Yards).
KL Tịnh (Kgs) (Net Weight (Kgs)) Trọng lượng tịnh (Net Weight) của cuộn vải.
KL Cả bì (Kgs) (Gross Weight (Kgs)) Trọng lượng cả bì (Gross Weight) của cuộn vải.
Chiều rộng khổ vải(Width) Chiều rộng khổ vải
Vị trí kho (Location) Vị trí sẽ lưu trữ cuộn vải này trong kho của bạn.
QR Code (QR Code) Mã QR của cuộn vải
QC Status (QC Status) Trạng thái QC của cuộn vải (Passed/Failed/Pending)
Date Received (Date Received) Ngày nhận cuộn vải
Printed (Printed) Trạng thái đã in mã QR hay chưa (Yes/No)
Action

Và dữ liệu giả cho bảng Item List như sau:

- Ở packingListTable sẽ có 1 nút bấm, khi ấn vào sẽ sổ xuống 1 bảng chọn các cột để hiển thị hoặc ẩn đi trên bảng dữ liệu packingListTable.
- Có thêm chức năng phân rã cuộn vải theo số yards, ví dụ 1 dòng dữ liệu như sau:
  POPU0018251 CK-101-04-00332 Light Gold 1 225628091 65 16.5 16.9 60" A-01-01 9F00-0002551-000000019052A502112350 Yes 17/10/2025 Not Printed
  Khi ấn vào nút "Phân rã cuộn vải" sẽ hiện thị popup cho phép nhập số yards cần phân rã, ví dụ nhập 20 yards, thì hệ thống sẽ tự động tạo ra 1 dòng mới với số yards là 20 yards, và dòng gốc sẽ được trừ đi 20 yards, thành 45 yards.
  Và mã QR code của dòng mới sẽ được tạo tự động, các thông tin khác giống dòng gốc.

# Các trường dữ liệu được sử dụng

- Upload Packing List:
  Số PO (PO Number) Số Purchase Order của cuộn vải.
  Mã Item (Item Code) Chính xác chuỗi ký tự mã vật tư mà hệ thống đã đọc được từ file.
  Factory (Factory) Tên nhà máy sản xuất cuộn vải
  Supplier (Supplier) Tên nhà cung cấp cuộn vải
  Invoice No (Invoice No) Số hóa đơn liên quan đến cuộn vải
  Color Code (Color Code) Mã màu của cuộn vải
  Màu sắc (Color) Tên hoặc mã màu của cuộn vải.
  Số cuộn (Roll No) Số thứ tự cuộn vải do nhà cung cấp đánh.
  Số Lô / Mẻ (Lot No) Số lô/mẻ sản xuất.
  Số Yards (Yards) Chiều dài cuộn vải (Yards).
  KL Tịnh (Kgs) (Net Weight (Kgs)) Trọng lượng tịnh (Net Weight) của cuộn vải.
  KL Cả bì (Kgs) (Gross Weight (Kgs)) Trọng lượng cả bì (Gross Weight) của cuộn vải.
  Chiều rộng khổ vải(Width) Chiều rộng khổ vải
  Vị trí kho (Location) Vị trí sẽ lưu trữ cuộn vải này trong kho của bạn.
  QR Code (QR Code) Mã QR của cuộn vải
  Date In House (Date In House) Ngày nhận cuộn vải
  Description (Description) Mô tả thêm về cuộn vải
- Packing List Table sẽ có các trường dữ liệu sau đây:
  QC Status (QC Status) Trạng thái QC của cuộn vải (Passed/Failed/Pending)
  QC Date (QC Date) Ngày thực hiện QC cuộn vải
  QC By (QC By) Người thực hiện QC cuộn vải
  Comment (Comment) Ghi chú thêm về cuộn vải khi thực hiện QC
  Printed (Printed) Trạng thái đã in mã QR hay chưa (Yes/No)
- Inventory Table sẽ có các trường dữ liệu sau đây:
  Balance Yards (Balance Yards) Số yards còn lại trong cuộn vải
  Hour Standard (Hour Standard) Tiêu chuẩn giờ cho việc xả cuộn vải
  Hour Relax (Hour Relax) Giờ xả cuộn vải thực tế
  Relax Date (Relax Date) Ngày xả cuộn vải
  Relax Time (Relax Time) Thời gian xả cuộn vải (giờ:phút)
  Relax By (Relax By) Người thực hiện xả cuộn vải
- Issued Fabric Report sẽ có các trường dữ liệu sau đây:
  JOB (JOB) Mã công đoạn sản xuất yêu cầu xuất vải
  Issued Date (Issued Date) Ngày xuất kho cuộn vải
  Issued By (Issued By) Người thực hiện xuất kho cuộn vải
  Destination (Destination) Địa điểm xuất kho cuộn vải đến

- Location Management sẽ có các trường dữ liệu sau đây:
  Location (Location) Mã vị trí kho
  Warehouse (Warehouse) Tên kho chứa vị trí kho
  Shelf (Shelf) Kệ chứa trong vị trí kho
  Pallet (Pallet) Pallet chứa trong vị trí kho
  Capacity (Capacity) Sức chứa tối đa của vị trí kho
  Current Occupancy (Current Occupancy) Số lượng hiện tại đang lưu trữ trong vị trí kho
  Last Updated (Last Updated) Ngày cập nhật cuối cùng của vị trí kho
  Description (Description) Mô tả thêm về vị trí kho

# Cutting Plan sẽ gồm các trường dữ liệu sau đây:

ID (ID) Mã định danh duy nhất của kế hoạch cắt
Plan Name (Plan Name) Tên của kế hoạch cắt
Factory (Factory) Tên nhà máy thực hiện kế hoạch cắt
Plan Date (Plan Date) Ngày thực hiện kế hoạch cắt
Style (Style) Mã kiểu dáng sản phẩm liên quan đến kế hoạch cắt
JOB (JOB) Mã công đoạn sản xuất liên quan đến kế hoạch cắt
Item Code (Item Code) Mã vải cần cắt theo kế hoạch
Color (Color) Màu vải cần cắt theo kế hoạch
Request Quantity (Request Quantity) Số lượng sản phẩm cần cắt theo kế hoạch
Issued Quantity (Issued Quantity) Số lượng đã xuất kho theo kế hoạch
Status (Status) Trạng thái hiện tại của kế hoạch cắt (Planned/In Progress/Completed)
Created By (Created By) Người tạo kế hoạch cắt
Remarks (Remarks) Ghi chú thêm về kế hoạch cắt

- Tạo giao diện bằng react typescript, tailwindcss
  Sửa lại giao diện trang Kanban Board để phù hợp với mục tiêu quản lý kho vải:
- **Mục tiêu:** Trực quan hóa luồng yêu cầu và luân chuyển vật tư giữa các bộ phận (từ kho đến cắt). Giúp đội ngũ kho quản lý công việc một cách hiệu quả, xác định các điểm nghẽn và ưu tiên các yêu cầu khẩn cấp.
- Dữ liệu của bảng Cutting Plan như sau:
  ID Plan Name Factory Plan Date Style JOB Item Code Color Request Quantity Issued Quantity Status Created By Remarks
  CP001 Kế hoạch cắt áo T-Shirt đợt 1 F1 10/20/2025 TSH-001 JOB-101 CTN-005 Trắng 500 0 Planned an.nguyen Ưu tiên cắt trước.
  CP002 Kế hoạch cắt quần Jean nam F1 10/21/2025 JEA-002 JOB-102 DNM-003 Xanh đậm 350 0 Planned an.nguyen Vải denim cần kiểm tra độ co rút.
  CP003 Kế hoạch cắt váy liền thân F2 10/22/2025 DRS-004 JOB-103 SIL-001 Đỏ đô 200 150 In Progress bao.tran Đã nhận đủ vải.
  CP004 Kế hoạch cắt áo sơ mi nữ F2 10/23/2025 SHT-003 JOB-104 POP-002 Xanh nhạt 420 0 Planned chi.le Yêu cầu kiểm tra sơ đồ cắt.
  CP005 Kế hoạch cắt áo khoác bomber F3 10/25/2025 JCK-005 JOB-105 NYL-007 Đen 150 150 Completed bao.tran Đã hoàn thành, chờ chuyển sang may.

Bảng Inventory sẽ có 1 nút bấm, khi bấm vào sẽ sổ xuống 1 bảng chọn các cột để hiển thị hoặc ẩn đi trên bảng dữ liệu InventoryTable.

Bộ lọc cho bảng Inventory sẽ có thể thu gọn thành 1 nút bấm "Bộ lọc" để khi ấn vào sẽ sổ xuống các bộ lọc, giúp tiết kiệm không gian hiển thị.

Khi ấn vào dấu 3 chấm ở mỗi dòng trong bảng Inventory sẽ có các chức năng sau đây:

- Inmã QR (Print QR Code): In lại mã QR cho cuộn vải đã chọn.
- Chuyển vị trí kho (Transfer Location): Mở popup cho phép chọn vị trí kho mới để chuyển cuộn vải đến vị trí kho mới.
- Xem lịch sử chuyển vị trí (View Transfer History): Mở popup hiển thị lịch sử các lần chuyển vị trí kho của cuộn vải đã chọn, bao gồm các thông tin: Vị trí kho cũ, Vị trí kho mới, Ngày chuyển, Người thực hiện chuyển.
- Phân rã cuộn vải (Breakdown Roll): Mở popup cho phép nhập số yards cần phân rã, sau đó tạo ra 1 dòng mới với số yards đã phân rã và trừ đi số yards tương ứng ở dòng gốc, tạo mã QR code mới cho dòng mới, các thông tin khác giống dòng gốc, và có trường thông báo rằng cuộn vải mới chưa được in mã QR. Có 1 cột mới là "Parent QR Code" để liên kết cuộn vải mới với cuộn vải gốc.
- Cho phép cập nhật Hour Relax, sau đó Relax Date, Relax Time, Relax By sẽ được tự động cập nhật theo thời gian hiện tại và người đang đăng nhập.

- Tạo thêm file data.ts để quản lí dữ liệu, và chuyển dữ liệu giả sang file data.ts
- Sửa lại cấu trúc trang, cho bảng Inventory full chiều ngang
- Bảng Inventory còn thiếu 1 số cột sau đây, tham khải fule excel sau và thêm vào bảng Inventory:
  PO Number Item Code Factory Supplier Invoice No Color Code Color Roll No Lot No Yards Net Weight (Kgs) Gross Weight (Kgs) Width Location QR Code Date In House Description QC Status QC Date QC By Comment Printed Balance Yards Hour Standard Hour Relax Relax Date Relax Time Relax By Parent QR Code
  POPU0018251 CK-101-04-00332 Factory A Supplier Y INV-001 CC-003 Light Gold 1 225628091 65 16.5 16.9 60" F1-01-01 QR-43468 6/8/2023 Denim Material Failed 12/23/2023 John Doe No issues found TRUE 46 24 24 12/25/2023 10:30 Alice null
  POPU0018251 CK-101-04-00332 Factory B Supplier Z INV-002 CC-004 Royal Sapphire 2 225628091 82 20.1 20.5 60" F1-01-02 QR-33961 8/10/2023 Silk Blend Failed 10/22/2023 John Doe Approved for production FALSE 39 24 24 9/28/2023 14:00 Bob null
  PSPU0002932 CK-101-04-00483 Factory B Supplier Z INV-003 CC-003 Puma Black 1 225628091 82 17.7 18.1 60" F1-01-03 QR-81808 10/14/2023 Polyester Blend Failed 9/19/2023 Peter Jones Approved for production TRUE 22 36 36 1/20/2023 9:00 Charlie null
  POPU0018238 CK-102-05-00049 Factory B Supplier Y INV-004 CC-002 Puma Black 1 225628091 55 17.5 18 53" F1-01-04 QR-35149 4/21/2023 Polyester Blend Failed 3/5/2023 John Doe No issues found TRUE 34 36 36 8/1/2023 10:30 Bob null
  POPU0018235 CK-126-04-00277 Factory C Supplier Z INV-005 CC-002 Puma Black 1 225628091 45 17.4 17.8 68" F2-03-05 QR-76433 2/18/2023 Polyester Blend Failed 4/29/2023 John Doe Minor defect on edge TRUE 37 48 48 1/17/2023 9:00 Alice null
  PSPU0002986 WO-413-04-00361 Factory B Supplier X INV-006 CC-004 PUMA BLACK 1 225628091 22 4.5 4.8 57" F2-03-06 QR-93641 3/16/2023 Silk Blend Passed 8/5/2023 Jane Smith No issues found FALSE 13 48 48 5/10/2023 15:45 Bob null
  PSPU0002986 WO-413-04-00361 Factory B Supplier X INV-007 CC-003 PUMA WHITE 2 225628091 119 24.6 24.7 57" F2-03-07 QR-89437 11/22/2023 Polyester Blend Failed 3/18/2023 Peter Jones Approved for production TRUE 26 48 48 5/25/2023 15:45 Bob null
  SPPU0004476 CK-105-05-00062 Factory C Supplier Y INV-008 CC-003 PUMA WHITE 1 225628091 4 1 1.4 61" F2-03-08 QR-22682 12/8/2023 Cotton Fabric Failed 2/27/2023 John Doe No issues found FALSE 32 48 48 3/6/2023 10:30 Charlie null
  SSPU0002939 CK-105-04-00325 Factory C Supplier Y INV-009 CC-002 PUMA WHITE 1 225628091 90 24 24.4 63" F2-03-09 QR-16812 5/5/2023 Denim Material Pending 3/12/2023 Peter Jones Rework required TRUE 26 48 48 2/24/2023 15:45 Alice null

- Cập nhật, thiết kế trang Location Management theo dữ liệu sau đây:
  Location Warehouse Shelf Pallet Capacity Current Occupancy Last Updated Description
  F1-01-01 F1 1 1 100 85 10/18/2025 Khu vực vải cotton
  F2-05-03 F2 5 3 120 110 10/17/2025 Khu vực vải kaki màu
  F1-02-02 F1 2 2 80 50 10/18/2025 Khu vực vải lụa
  F3-10-08 F3 10 8 150 150 10/16/2025 Khu vực vải denim (jean)
  F2-03-05 F2 3 5 100 75 10/18/2025 Khu vực vải voan

- Thêm chức năng group theo Warehouse, Shelf, xem tổng số Capacity và Current Occupancy theo từng nhóm.
- Khi ấn vào từng Location sẽ hiển thị danh sách các cuộn vải đang nằm trong Location đó, bao gồm các thông tin: Mã cuộn vải (Item Code), Mã vị trí kho (Location), màu sắc (Color Code), chiều dài (Yards), Roll No, Lot No, QR Code. Có thể thực hiện chuyên vị trí kho cho từng cuộn vải trong danh sách này.

Thiết kế lại trang Inbound Dashboard để hiển thị các thông tin và biểu đồ cần thiết cho việc quản lý kho vải, bao gồm:

# Dashboard Inbound sẽ hiển thị các thông tin sau:

- Tổng số lượng cuộn vải đã nhập kho
- Tổng Lượng Vải Tồn Kho (Yards): SUM(inventory['Balance Yards']). Con số tổng quan về lượng nguyên liệu sẵn có.
- Tỷ Lệ Lấp Đầy Kho: SUM(warehouse['Current Occupancy']) / SUM(warehouse['Capacity']). Hiển thị dưới dạng đồng hồ đo (gauge) hoặc % để biết tổng thể kho đang đầy hay trống.
- Số Kế Hoạch Cắt Đang Thực Hiện: COUNT(cutting_plan['Status'] WHERE Status = 'In Progress'). Giúp theo dõi tiến độ sản xuất chung.
- Tỷ Lệ Vải Đạt Chất Lượng (QC Passed): COUNT(inventory['QC Status'] WHERE Status = 'Passed') / TOTAL(inventory). Một chỉ số nhanh về chất lượng nguyên vật liệu đầu vào.
- Biểu đồ cột: Tồn kho theo Loại Vải (Item Code)
  Mục đích: Cho biết loại vải nào đang tồn kho nhiều nhất.
  Trục X: Item Code (Mã vải).
  Trục Y: SUM(Balance Yards) (Tổng số yards còn lại).
  Sắp xếp các cột từ cao đến thấp để dễ dàng xác định các mã vải chủ lực.

- Biểu đồ tròn: Cơ Cấu Tồn Kho theo Trạng Thái QC
  Mục đích: Xem nhanh tỷ lệ vải đã kiểm tra (Đạt, Hỏng) và vải đang chờ kiểm tra (Pending).
  Các phần: Passed, Failed, Pending.

- Biểu đồ cột: Tồn Kho theo Nhà Cung Cấp (Supplier)
  Mục đích: Đánh giá lượng hàng tồn từ mỗi nhà cung cấp.
  Trục X: Tên Supplier.
  Trục Y: SUM(Balance Yards).

- Biểu đồ cột: Tuổi Tồn Kho (Inventory Aging)
  Mục đích: Xác định các loại vải tồn kho đã lâu, có nguy cơ lỗi thời hoặc giảm chất lượng.
  Trục X: Các khoảng thời gian (VD: 0-30 ngày, 31-60 ngày, 61-90 ngày, >90 ngày), tính bằng Ngày hiện tại - [Date In House].
  Trục Y: SUM(Balance Yards).

- Biểu đồ cột ngang: Tỷ Lệ Lấp Đầy Từng Kho/Khu Vực
  Mục đích: So sánh hiệu quả sử dụng không gian giữa các kho hoặc các dãy kệ.
  Trục Y: Location hoặc Warehouse.
  Trục X: Tỷ lệ phần trăm lấp đầy (Current Occupancy / Capacity) \* 100%.
  Có thể tô màu các thanh theo ngưỡng (VD: >90% là màu đỏ cảnh báo).

- Bảng dữ liệu: Các Vị Trí Sắp Đầy
  Mục đích: Liệt kê các vị trí cần chú ý để sắp xếp hoặc mở rộng.
  Điều kiện lọc: (Current Occupancy / Capacity) > 90%.
  Các cột: Location, Capacity, Current Occupancy, Tỷ lệ lấp đầy (%).

- Biểu đồ tròn: Trạng Thái các Kế Hoạch Cắt
  Mục đích: Xem tỷ lệ các kế hoạch đang ở trạng thái Planned, In Progress, và Completed.
  Các phần: Planned, In Progress, Completed.

- Biểu đồ cột chồng: Tiến Độ Cấp Phát Vải cho Kế Hoạch
  Mục đích: Theo dõi chi tiết lượng vải đã cấp so với yêu cầu cho từng JOB.
  Trục X: JOB hoặc Plan Name.
  Trục Y: Lượng (Quantity).
  Phần 1 (đã cấp): Issued Quantity.
  Phần 2 (cần cấp thêm): Request Quantity - Issued Quantity.
  Biểu đồ này rất trực quan để biết kế hoạch nào đã sẵn sàng, kế hoạch nào còn thiếu vải.

- Bảng dữ liệu: Nhu Cầu Vải Sắp Tới
  Mục đích: Giúp bộ phận kho chuẩn bị vải cho các kế hoạch sắp triển khai.
  Điều kiện lọc: Status = 'Planned'.
  Các cột: Plan Name, JOB, Item Code, Color, Request Quantity.

- Bộ Lọc Tương Tác (Interactive Filters)
  Lọc theo Thời Gian: Chọn khoảng ngày (Date In House, Issued Date, Plan Date).
  Lọc theo Nhà Máy (Factory): Factory A, Factory B, Factory C.
  Lọc theo Nhà Cung Cấp (Supplier): Supplier X, Supplier Y, Supplier Z.
  Lọc theo Mã Vải (Item Code).
  Khi người dùng chọn một bộ lọc, tất cả các biểu đồ và số liệu trên dashboard sẽ tự động cập nhật theo lựa chọn đó, tạo ra một công cụ phân tích rất mạnh mẽ.

Cập nhật lại bảng Issue Transaction Reports sẽ gồm các cột và dữ liệu sau đây, có 1 cột cho phép chọn nhiều dòng để xuất excel:
PO Number Item Code Factory Supplier Invoice No Color Code Color Roll No Lot No Yards Net Weight (Kgs) Gross Weight (Kgs) Width Location QR Code Date In House Description QC Status QC Date QC By Comment Printed Balance Yards Hour Standard Hour Relax Relax Date Relax Time Relax By JOB Issued Date Issued By Destination Parent QR Code
POPU0018251 CK-101-04-00332 Factory A Supplier Y INV-001 CC-003 Light Gold 1 225628091 65 16.5 16.9 60" F1-01-01 QR-43468 6/8/2023 Denim Material Failed 12/23/2023 John Doe No issues found TRUE 46 24 24 12/25/2023 10:30 Alice JOB-B5 8/26/2023 David Warehouse A null
POPU0018251 CK-101-04-00332 Factory B Supplier Z INV-002 CC-004 Royal Sapphire 2 225628091 82 20.1 20.5 60" F1-01-02 QR-33961 8/10/2023 Silk Blend Failed 10/22/2023 John Doe Approved for production FALSE 39 24 24 9/28/2023 14:00 Bob JOB-A2 3/15/2023 Eve Store B null
PSPU0002932 CK-101-04-00483 Factory B Supplier Z INV-003 CC-003 Puma Black 1 225628091 82 17.7 18.1 60" F1-01-03 QR-81808 10/14/2023 Polyester Blend Failed 9/19/2023 Peter Jones Approved for production TRUE 22 36 36 1/20/2023 9:00 Charlie JOB-B2 10/5/2023 Frank Store B null
POPU0018238 CK-102-05-00049 Factory B Supplier Y INV-004 CC-002 Puma Black 1 225628091 55 17.5 18 53" F1-01-04 QR-35149 4/21/2023 Polyester Blend Failed 3/5/2023 John Doe No issues found TRUE 34 36 36 8/1/2023 10:30 Bob JOB-A5 4/29/2023 David Warehouse A null
POPU0018235 CK-126-04-00277 Factory C Supplier Z INV-005 CC-002 Puma Black 1 225628091 45 17.4 17.8 68" F2-03-05 QR-76433 2/18/2023 Polyester Blend Failed 4/29/2023 John Doe Minor defect on edge TRUE 37 48 48 1/17/2023 9:00 Alice JOB-C4 9/22/2023 Eve Store B null
PSPU0002986 WO-413-04-00361 Factory B Supplier X INV-006 CC-004 PUMA BLACK 1 225628091 22 4.5 4.8 57" F2-03-06 QR-93641 3/16/2023 Silk Blend Passed 8/5/2023 Jane Smith No issues found FALSE 13 48 48 5/10/2023 15:45 Bob JOB-A9 2/12/2023 Eve Distribution Center C null
PSPU0002986 WO-413-04-00361 Factory B Supplier X INV-007 CC-003 PUMA WHITE 2 225628091 119 24.6 24.7 57" F2-03-07 QR-89437 11/22/2023 Polyester Blend Failed 3/18/2023 Peter Jones Approved for production TRUE 26 48 48 5/25/2023 15:45 Bob JOB-B6 10/30/2023 Eve Distribution Center C null
SPPU0004476 CK-105-05-00062 Factory C Supplier Y INV-008 CC-003 PUMA WHITE 1 225628091 4 1 1.4 61" F2-03-08 QR-22682 12/8/2023 Cotton Fabric Failed 2/27/2023 John Doe No issues found FALSE 32 48 48 3/6/2023 10:30 Charlie JOB-C8 6/2/2023 Frank Distribution Center C null
SSPU0002939 CK-105-04-00325 Factory C Supplier Y INV-009 CC-002 PUMA WHITE 1 225628091 90 24 24.4 63" F2-03-09 QR-16812 5/5/2023 Denim Material Pending 3/12/2023 Peter Jones Rework required TRUE 26 48 48 2/24/2023 15:45 Alice JOB-A8 4/26/2023 David Warehouse A null

- Bảng Issue Transaction Reports sẽ có 1 nút bấm, khi bấm vào sẽ sổ xuống 1 bảng chọn các cột để hiển thị hoặc ẩn đi trên bảng dữ liệu IssueTransactionReportsTable.
- Thêm phân trang cho bảng Issue Transaction Reports, mỗi trang cho phép hiển thị 10, 20, 50, 100 dòng.
- Điều chỉnh lại thanh filter cho gọn hơn, Supplier, QC Status nhỏ chiều ngang lại để tiết kiệm không gian hiển thị.

Chỉnh lại thanh tìm kiếm cho gọn lại, sẽ bao gồm các trường dữ liệu sau đây để tìm kiếm:
Invoice No
PO Number
Item Code
Color
Roll No
Lot No
JOB

# Quản lí tồn kho phụ liệu (Accessory Inventory Management) có các trường dữ liệu sau đây:

ItemNumber (Item Number) Mã phụ liệu
ItemCategory (Item Category) Mã loại phụ liệu
MaterialName (Material Name) Tên phụ liệu
Color (Color) Màu sắc phụ liệu
Size (Size) Kích thước phụ liệu
Quantity (Quantity) Số lượng phụ liệu
Unit (Unit) Đơn vị tính phụ liệu
Location (Location) Vị trí kho phụ liệu
RequiredQuantity (Required Quantity) Số lượng phụ liệu yêu cầu
Status (Status) Trạng thái phụ liệu (In Stock/Out of Stock/Low Stock)
BatchNumber (Batch Number) Số lô phụ liệu
DateReceived (Date Received) Ngày nhận phụ liệu
Supplier (Supplier) Nhà cung cấp phụ liệu
PO Number (PO Number) Đơn đặt hàng phụ liệu
ReorderPoint (Reorder Point) Điểm đặt hàng lại phụ liệu
LastModifiedDate (Last Modified Date) Ngày cập nhật cuối cùng phụ liệu
LastModifiedBy (Last Modified By) Người cập nhật cuối cùng phụ liệu
Description (Description) Mô tả phụ liệu

- Bảng Accessory Inventory sẽ có 1 nút bấm, khi bấm vào sẽ sổ xuống 1 bảng chọn các cột để hiển thị hoặc ẩn đi trên bảng dữ liệu AccessoryInventoryTable.
- Có chức năng chuyển vị trí sang kho khác.
- Có chức năng xuất phụ liệu theo yêu cầu, tức là trừ số lượng phụ liệu trong kho theo yêu cầu xuất phụ liệu.

ItemNumber ItemCategory MaterialName Color Size Quantity Unit Location RequiredQuantity Status BatchNumber DateReceived Supplier PO Number ReorderPoint LastModifiedDate LastModifiedBy Description
BTN-001 BTN Cúc nhựa 4 lỗ Đen 15mm 5000 Cái Kệ A-01-05 500 In Stock B20231001 2023-10-01 Phụ liệu Phong Phú PO23-115 1000 2023-10-26 Nguyễn Văn An Cúc nhựa thông dụng cho áo sơ mi nam.
ZIP-001 ZIP Khóa kéo kim loại Đồng 50cm 850 Cái Kệ B-03-01 200 In Stock Z20230915 2023-09-15 Dệt may Thành Công PO23-098 200 2023-10-25 Trần Thị Bích Dùng cho áo khoác jean, loại răng 5.
THR-001 THR Chỉ may polyester Trắng 40/2 150 Cuộn Kệ C-02-11 30 In Stock T20231010 2023-10-10 Sợi Việt Thắng PO23-121 50 2023-10-26 Lê Minh Tuấn Chỉ may vắt sổ, độ bền cao.
BTN-002 BTN Cúc gỗ 2 lỗ Nâu 20mm 90 Cái Kệ A-01-06 200 Low Stock B20230820 2023-08-20 Phụ liệu Sài Gòn PO23-075 100 2023-10-24 Trần Thị Bích Cúc trang trí cho áo khoác len.
LBL-001 LBL Nhãn dệt logo Nhiều màu 2cm x 5cm 0 Cái Kệ D-05-02 1000 Out of Stock L20230701 2023-07-01 Nhãn mác An Phát PO23-050 500 2023-10-20 Nguyễn Văn An Nhãn dệt chính cho áo T-shirt.
ELS-001 ELS Thun dệt kim Trắng 2.5cm 2500 Mét Kệ C-04-08 800 In Stock E20230928 2023-09-28 Phụ liệu Phong Phú PO23-109 500 2023-10-26 Lê Minh Tuấn Thun luồn lưng quần thể thao.
INT-001 INT Keo giấy dựng cổ Trắng 90cm 800 Mét Kệ B-01-03 150 In Stock I20230905 2023-09-05 Dệt may Thành Công PO23-088 150 2023-10-22 Nguyễn Văn An Keo ủi dùng cho cổ và nẹp áo sơ mi.
ZIP-002 ZIP Khóa kéo giọt nước Đỏ 20cm 320 Cái Kệ B-03-09 100 In Stock Z20231005 2023-10-05 Phụ liệu Sài Gòn PO23-118 100 2023-10-25 Trần Thị Bích Khóa kéo giấu, dùng cho đầm nữ.
THR-002 THR Chỉ may cotton Xanh Navy 50/3 45 Cuộn Kệ C-02-12 60 Low Stock T20230815 2023-08-15 Sợi Việt Thắng PO23-070 50 2023-10-26 Lê Minh Tuấn Chỉ cotton chần cho quần kaki.
LBL-002 LBL Nhãn satin in HDSD Trắng 3cm x 6cm 4500 Cái Kệ D-05-03 0 In Stock L20231012 2023-10-12 Nhãn mác An Phát PO23-124 1000 2023-10-23 Nguyễn Văn An Nhãn sườn in hướng dẫn sử dụng.

chuyển nội dung hiện thị trang inbound-dashboard sang tiếng anh
các trang trong thư mục pages của dự án

oke chuyển nội dung hiển thị sang tiếng anh nhé

# Kanban từ chuyền may sẽ gồm các trường dữ liệu sau đây:

ID (ID) Mã định danh duy nhất của yêu cầu
Request Name (Request Name) Tên của yêu cầu
Date Created (Date Created) Ngày tạo yêu cầu
Date Required (Date Required) Ngày yêu cầu hoàn thành
Factory Line (Factory Line) Tên dây chuyền sản xuất yêu cầu
Style (Style) Mã kiểu dáng sản phẩm liên quan đến yêu cầu
JOB (JOB) Mã công đoạn sản xuất liên quan đến yêu cầu
Color (Color) Màu vải liên quan đến yêu cầu
Size (Size) Kích thước sản phẩm liên quan đến yêu cầu
PO Number (PO Number) Số đơn đặt hàng liên quan đến yêu cầu
Required Quantity (Required Quantity) Số lượng sản phẩm yêu cầu
Issued Quantity (Issued Quantity) Số lượng đã xuất kho theo yêu cầu
Status (Status) Trạng thái hiện tại của yêu cầu (New/Confirmed/Picking/Ready for Pickup/Partially Issued/Completed/Cancelled)
Priority (Priority) Mức độ ưu tiên của yêu cầu (Low/Medium/High)
BOM ID (BOM ID) Mã định danh của bảng kê nguyên vật liệu liên quan đến yêu cầu
Created By (Created By) Người tạo yêu cầu
Remarks (Remarks) Ghi chú thêm về yêu cầu

Bộ lọc:

- Date Required: Chọn khoảng ngày để lọc yêu cầu theo ngày yêu cầu hoàn thành
- Factory Line: Chọn dây chuyền sản xuất để lọc yêu cầu theo dây chuyền
- JOB: Chọn mã công đoạn sản xuất để lọc yêu cầu theo công đoạn

ID Request Name Date Created Date Required Factory Line Style JOB Color Size PO Number Required Quantity Issued Quantity Status Priority BOM ID Created By Remarks
KB-001 Yêu cầu vải chính JKT-0821 2023-11-20 08:00 2023-11-20 10:00 Chuyền 1 JKT-0821 Cắt Black M PO-23-US-5512 500 0 New High BOM-JKT-0821-V2 Nguyễn Thị Lan Cần gấp để kịp tiến độ cắt.
KB-002 Cấp chỉ may PNT-5503 2023-11-19 14:30 2023-11-20 09:00 Chuyền 3 PNT-5503 May Navy L PO-23-EU-8904 1200 1200 Completed Medium BOM-PNT-5503-V1 Trần Văn Hùng Đã nhận đủ hàng.
KB-003 Yêu cầu cúc áo SHRT-112A 2023-11-20 09:15 2023-11-21 17:00 Chuyền 5 SHRT-112A Hoàn thiện White S PO-23-JP-7765 800 500 Partially Issued Medium BOM-SHRT-112A-V1 Lê Thị Hoa Kho báo sẽ cấp phần còn lại vào chiều nay.
KB-004 Lấy vải lót cho JKT-0821 2023-11-20 10:00 2023-11-20 15:00 Chuyền 1 JKT-0821 May Black M PO-23-US-5512 500 0 Ready for Pickup Medium BOM-JKT-0821-V2 Nguyễn Thị Lan Kho đã soạn xong, chờ tổ trưởng nhận.
KB-005 Yêu cầu dây kéo cho PNT-5503 2023-11-20 11:25 2023-11-21 11:30 Chuyền 3 PNT-5503 May Navy L PO-23-EU-8904 1200 0 Confirmed Medium BOM-PNT-5503-V1 Trần Văn Hùng
KB-006 Bổ sung vải cho đơn hàng gấp 2023-11-21 08:30 2023-11-21 09:30 Chuyền Mẫu DRESS-X01 May Mẫu Red Free Size PO-SAMPLE-012 10 10 Completed High BOM-DRESS-X01-V1 Phạm Văn Bách Ưu tiên cho phòng mẫu.
KB-007 Yêu cầu nhãn mác cho SHRT-112A 2023-11-21 13:00 2023-11-22 16:00 Chuyền 5 SHRT-112A Hoàn thiện White S, M, L PO-23-JP-7765 2400 0 Picking Low BOM-SHRT-112A-V1 Lê Thị Hoa Kho đang tìm hàng.
KB-008 Yêu cầu chỉ vắt sổ TSH-205 2023-11-22 09:00 2023-11-22 17:00 Chuyền 2 TSH-205 May Heather Grey XL PO-23-CAN-3450 3000 3000 Completed Medium BOM-TSH-205-V3 Hoàng Minh Tú
KB-009 Hủy yêu cầu vải JKT-0821 2023-11-22 10:45 2023-11-22 10:45 Chuyền 1 JKT-0821 Cắt Beige S PO-23-US-5512 250 0 Cancelled Low BOM-JKT-0821-V2 Nguyễn Thị Lan Đổi mã màu, sẽ tạo yêu cầu mới.
KB-010 Yêu cầu mex cổ cho SHRT-112A 2023-11-23 08:10 2023-11-24 08:00 Chuyền 5 SHRT-112A Cắt White All sizes PO-23-JP-7765 1500 0 New Medium BOM-SHRT-112A-V1 Lê Thị Hoa
32.3s
Use Arrow Up and Arrow Down to select a turn, Enter to jump to it, and Escape to return to the chat.

Khi ấn vào nút Import Packing List trong trang fabric-warehouse/packing-list sẽ mở popup cho phép chọn file excel. và giao diện popup chính là giao diện trang fabric-warehouse/import-packing-list, chức năng tương tự luôn.

Lúc import file excel vào thì bảng review dài quá làm màn hình không hiển thị nút complete và nút x để đóng popup, nên cần fix lại giao diện bảng review để có thể hiển thị đầy đủ nút complete và nút x đóng popup.

# Màn hình Issue Fabric Form sẽ có những thông tin sau đây:

- 1 list JOB được lấy từ bảng Cutting Plan, người dùng có thể chọn 1 JOB từ list này. có thể tìm kiếm JOB theo mã JOB, filter theo ngày Plan Date và Factory.
- Danh sách các cuộn vải trong kho Inventory, có thể tìm kiếm và lọc để chọn cuộn vải cần xuất cho JOB đã chọn, trên header của bảng có 1 nút bấm, khi ấn vào sẽ mở popup cho phép chọn các cột để hiển thị hoặc ẩn đi trên bảng dữ liệu InventoryTable.
- Người dùng sẽ chọn số lượng yards cần xuất từ mỗi cuộn vải đã chọn.
- Sau khi chọn xong nhấn nút Submit để hoàn tất việc xuất vải cho JOB đã chọn.

- Dữ liệu bảng Cutting Plan sẽ gồm các trường sau đây:
  ID Plan Name Factory Plan Date Style JOB Item Code Color Request Quantity Issued Quantity Status Created By Remarks
  CP001 Kế hoạch cắt áo T-Shirt đợt 1 F1 10/20/2025 TSH-001 JOB-101 CTN-005 Trắng 500 0 Planned an.nguyen Ưu tiên cắt trước.
  CP002 Kế hoạch cắt quần Jean nam F1 10/21/2025 JEA-002 JOB-102 DNM-003 Xanh đậm 350 0 Planned an.nguyen Vải denim cần kiểm tra độ co rút.
  CP003 Kế hoạch cắt váy liền thân F2 10/22/2025 DRS-004 JOB-103 SIL-001 Đỏ đô 200 150 In Progress bao.tran Đã nhận đủ vải.
  CP004 Kế hoạch cắt áo sơ mi nữ F2 10/23/2025 SHT-003 JOB-104 POP-002 Xanh nhạt 420 0 Planned chi.le Yêu cầu kiểm tra sơ đồ cắt.
  CP005 Kế hoạch cắt áo khoác bomber F3 10/25/2025 JCK-005 JOB-105 NYL-007 Đen 150 150 Completed bao.tran Đã hoàn thành, chờ chuyển sang may.

- Dữ liệu bảng Inventory sẽ gồm các trường sau đây:
  PO Number Item Code Factory Supplier Invoice No Color Code Color Roll No Lot No Yards Net Weight (Kgs) Gross Weight (Kgs) Width Location QR Code Date In House Description QC Status QC Date QC By Comment Printed Balance Yards Hour Standard Hour Relax Relax Date Relax Time Relax By Parent QR Code
  POPU0018251 CK-101-04-00332 Factory A Supplier Y INV-001 CC-003 Light Gold 1 225628091 65 16.5 16.9 60" F1-01-01 QR-43468 6/8/2023 Denim Material Failed 12/23/2023 John Doe No issues found TRUE 46 24 24 12/25/2023 10:30 Alice null
  POPU0018251 CK-101-04-00332 Factory B Supplier Z INV-002 CC-004 Royal Sapphire 2 225628091 82 20.1 20.5 60" F1-01-02 QR-33961 8/10/2023 Silk Blend Failed 10/22/2023 John Doe Approved for production FALSE 39 24 24 9/28/2023 14:00 Bob null
  PSPU0002932 CK-101-04-00483 Factory B Supplier Z INV-003 CC-003 Puma Black 1 225628091 82 17.7 18.1 60" F1-01-03 QR-81808 10/14/2023 Polyester Blend Failed 9/19/2023 Peter Jones Approved for production TRUE 22 36 36 1/20/2023 9:00 Charlie null
  POPU0018238 CK-102-05-00049 Factory B Supplier Y INV-004 CC-002 Puma Black 1 225628091 55 17.5 18 53" F1-01-04 QR-35149 4/21/2023 Polyester Blend Failed 3/5/2023 John Doe No issues found TRUE 34 36 36 8/1/2023 10:30 Bob null
  POPU0018235 CK-126-04-00277 Factory C Supplier Z INV-005 CC-002 Puma Black 1 225628091 45 17.4 17.8 68" F2-03-05 QR-76433 2/18/2023 Polyester Blend Failed 4/29/2023 John Doe Minor defect on edge TRUE 37 48 48 1/17/2023 9:00 Alice null
  PSPU0002986 WO-413-04-00361 Factory B Supplier X INV-006 CC-004 PUMA BLACK 1 225628091 22 4.5 4.8 57" F2-03-06 QR-93641 3/16/2023 Silk Blend Passed 8/5/2023 Jane Smith No issues found FALSE 13 48 48 5/10/2023 15:45 Bob null
  PSPU0002986 WO-413-04-00361 Factory B Supplier X INV-007 CC-003 PUMA WHITE 2 225628091 119 24.6 24.7 57" F2-03-07 QR-89437 11/22/2023 Polyester Blend Failed 3/18/2023 Peter Jones Approved for production TRUE 26 48 48 5/25/2023 15:45 Bob null
  SPPU0004476 CK-105-05-00062 Factory C Supplier Y INV-008 CC-003 PUMA WHITE 1 225628091 4 1 1.4 61" F2-03-08 QR-22682 12/8/2023 Cotton Fabric Failed 2/27/2023 John Doe No issues found FALSE 32 48 48 3/6/2023 10:30 Charlie null
  SSPU0002939 CK-105-04-00325 Factory C Supplier Y INV-009 CC-002 PUMA WHITE 1 225628091 90 24 24.4 63" F2-03-09 QR-16812 5/5/2023 Denim Material Pending 3/12/2023 Peter Jones Rework required TRUE 26 48 48 2/24/2023 15:45 Alice null

# Màn hình Kanban có:

- Tìm kiếm theo ngày Plan Date nhưng cho chọn khoảng ngày (From Date - To Date).
- Trong những thẻ Kanban, chỉ hiển thị những thông tin quan trọng nhất như: JOB, Item, Plan Date, Progress (Tiến độ): Kết hợp Request Quantity và Issued Quantity thành một chỉ số trực quan như 150/200. Các thông tin khác sẽ được hiển thị khi ấn vào xem chi tiết thẻ Kanban đó.
- Thêm Bộ lọc theo Factory.

# Màn hình Inbound Dashboard:

- Tách mỗi biểu đồ thành 1 component riêng biệt để dễ quản lí và tái sử dụng.
- Thêm các bộ lọc tương tác để người dùng có thể tùy chỉnh dữ liệu hiển thị trên dashboard theo nhu cầu phân tích cụ thể của họ.

Bảng Inventory Management ở đường dẫn fabric-warehouse/inventory có thêm 1 cột checkbox đầu tiên để chọn nhiều dòng, có nút xuất excel cho các dòng đã chọn, chức năng Print QR Code cũng có thể in mã QR cho nhiều dòng đã chọn luôn.

Bảng Accessory Inventory Management ở đường dẫn accessory-warehouse/inventory thêm 1 cột QR Code để quản lý từng phụ liệu, ấn vào nút 3 chấm cũng có thể in mã QR cho từng phụ liệu. Có thêm 1 cột checkbox đầu tiên để chọn nhiều dòng, có nút xuất excel cho các dòng đã chọn, chức năng Print QR Code cũng có thể in mã QR cho nhiều dòng đã chọn luôn.

Bảng Packaging Inventory Management ở đường dẫn packaging-warehouse/inventory có thêm 1 cột QR Code để quản lý từng bao bì, ấn vào nút 3 chấm cũng có thể in mã QR cho từng bao bì. Có thêm 1 cột checkbox đầu tiên để chọn nhiều dòng, có nút xuất excel cho các dòng đã chọn, chức năng Print QR Code cũng có thể in mã QR cho nhiều dòng đã chọn luôn. Đổi data giả của bảng Packaging Inventory Management cho phù hợp với quản lí bao bì đóng gói.

# Màn hình Sewing Line - Trims Request Kanban có:

- Sửa lại data cột JOB là mã JOB (ví dụ: SEW-001, SEW-002...) thay vì tên JOB.
- Tìm kiếm theo ngày Date Required nhưng cho chọn khoảng ngày (From Date - To Date).
- Trong những thẻ Kanban, chỉ hiển thị những thông tin quan trọng nhất như: JOB, Request Name, Date Required, Priority, Progress (Tiến độ): Kết hợp Request Quantity và Issued Quantity thành một chỉ số trực quan như 150/200. Các thông tin khác sẽ được hiển thị khi ấn vào nút 3 chấm xem chi tiết thẻ Kanban đó.
- Bỏ tính năng kéo thả thẻ Kanban để thay đổi trạng thái.
- Tham khảo giao diện Kanban Board của trang fabric-warehouse/cutting-plan để thiết kế lại giao diện trang sewing-line/trims-request-kanban cho đồng bộ.

# Màn hình Issue Accessory Form sẽ có những thông tin sau đây:

- 1 list JOB được lấy từ bảng Sewing Line - Trims Request, người dùng có thể chọn 1 JOB từ list này. có thể tìm kiếm JOB theo mã JOB, filter theo ngày Date Required và Factory Line.
- Danh sách các cuộn vải trong kho Accessory Inventory, có thể tìm kiếm và lọc để chọn cuộn vải cần xuất cho JOB đã chọn, trên header của bảng có 1 nút bấm, khi ấn vào sẽ mở cửa sổ sổ xuống cho phép chọn các cột để hiển thị hoặc ẩn đi trên bảng dữ liệu Accessory Inventory.
- Người dùng sẽ chọn số lượng cần xuất từ mỗi phụ liệu đã chọn.
- Sau khi chọn xong nhấn nút Submit để hoàn tất việc xuất phụ liệu cho JOB đã chọn.

- Tham khảo giao diện Issue Fabric Form để thiết kế lại giao diện trang issue-accessory cho đồng bộ.

Dữ liệu bảng Sewing Line - Trims Request sẽ gồm các trường sau đây:
ID Request Name Date Created Date Required Factory Line Style JOB Color Size PO Number Required Quantity Issued Quantity Status Priority BOM ID Created By Remarks
KB-001 Yêu cầu vải chính JKT-0821 11/20/2023 8:00 11/20/2023 10:00 Chuyền 1 JKT-0821 Cắt Black M PO-23-US-5512 500 0 New High BOM-JKT-0821-V2 Nguyễn Thị Lan Cần gấp để kịp tiến độ cắt.
KB-002 Cấp chỉ may PNT-5503 11/19/2023 14:30 11/20/2023 9:00 Chuyền 3 PNT-5503 May Navy L PO-23-EU-8904 1200 1200 Completed Medium BOM-PNT-5503-V1 Trần Văn Hùng Đã nhận đủ hàng.
KB-003 Yêu cầu cúc áo SHRT-112A 11/20/2023 9:15 11/21/2023 17:00 Chuyền 5 SHRT-112A Hoàn thiện White S PO-23-JP-7765 800 500 Partially Issued Medium BOM-SHRT-112A-V1 Lê Thị Hoa Kho báo sẽ cấp phần còn lại vào chiều nay.
KB-004 Lấy vải lót cho JKT-0821 11/20/2023 10:00 11/20/2023 15:00 Chuyền 1 JKT-0821 May Black M PO-23-US-5512 500 0 Ready for Pickup Medium BOM-JKT-0821-V2 Nguyễn Thị Lan Kho đã soạn xong, chờ tổ trưởng nhận.
KB-005 Yêu cầu dây kéo cho PNT-5503 11/20/2023 11:25 11/21/2023 11:30 Chuyền 3 PNT-5503 May Navy L PO-23-EU-8904 1200 0 Confirmed Medium BOM-PNT-5503-V1 Trần Văn Hùng
KB-006 Bổ sung vải cho đơn hàng gấp 11/21/2023 8:30 11/21/2023 9:30 Chuyền Mẫu DRESS-X01 May Mẫu Red Free Size PO-SAMPLE-012 10 10 Completed High BOM-DRESS-X01-V1 Phạm Văn Bách Ưu tiên cho phòng mẫu.
KB-007 Yêu cầu nhãn mác cho SHRT-112A 11/21/2023 13:00 11/22/2023 16:00 Chuyền 5 SHRT-112A Hoàn thiện White S, M, L PO-23-JP-7765 2400 0 Picking Low BOM-SHRT-112A-V1 Lê Thị Hoa Kho đang tìm hàng.
KB-008 Yêu cầu chỉ vắt sổ TSH-205 11/22/2023 9:00 11/22/2023 17:00 Chuyền 2 TSH-205 May Heather Grey XL PO-23-CAN-3450 3000 3000 Completed Medium BOM-TSH-205-V3 Hoàng Minh Tú
KB-009 Hủy yêu cầu vải JKT-0821 11/22/2023 10:45 11/22/2023 10:45 Chuyền 1 JKT-0821 Cắt Beige S PO-23-US-5512 250 0 Cancelled Low BOM-JKT-0821-V2 Nguyễn Thị Lan Đổi mã màu, sẽ tạo yêu cầu mới.
KB-010 Yêu cầu mex cổ cho SHRT-112A 11/23/2023 8:10 11/24/2023 8:00 Chuyền 5 SHRT-112A Cắt White All sizes PO-23-JP-7765 1500 0 New Medium BOM-SHRT-112A-V1 Lê Thị Hoa

Dữ liệu bảng Accessory Inventory sẽ gồm các trường sau đây:
QR Code ItemNumber ItemCategory MaterialName Color Size Quantity Unit Location RequiredQuantity Status BatchNumber DateReceived Supplier PO Number ReorderPoint LastModifiedDate LastModifiedBy Description
ACC-BTN-001-BLK BTN-001 BTN Cúc nhựa 4 lỗ Đen 15mm 5000 Cái Kệ A-01-05 500 In Stock B20231001 10/1/2023 Phụ liệu Phong Phú PO23-115 1000 10/26/2023 Nguyễn Văn An Cúc nhựa thông dụng cho áo sơ mi nam.
ACC-ZIP-001-BRS ZIP-001 ZIP Khóa kéo kim loại Đồng 50cm 850 Cái Kệ B-03-01 200 In Stock Z20230915 9/15/2023 Dệt may Thành Công PO23-098 200 10/25/2023 Trần Thị Bích Dùng cho áo khoác jean, loại răng 5.
ACC-THR-001-WHT THR-001 THR Chỉ may polyester Trắng 40/2 150 Cuộn Kệ C-02-11 30 In Stock T20231010 10/10/2023 Sợi Việt Thắng PO23-121 50 10/26/2023 Lê Minh Tuấn Chỉ may vắt sổ, độ bền cao.
ACC-BTN-002-BRN BTN-002 BTN Cúc gỗ 2 lỗ Nâu 20mm 90 Cái Kệ A-01-06 200 Low Stock B20230820 8/20/2023 Phụ liệu Sài Gòn PO23-075 100 10/24/2023 Trần Thị Bích Cúc trang trí cho áo khoác len.
ACC-LBL-001-MLT LBL-001 LBL Nhãn dệt logo Nhiều màu 2cm x 5cm 0 Cái Kệ D-05-02 1000 Out of Stock L20230701 7/1/2023 Nhãn mác An Phát PO23-050 500 10/20/2023 Nguyễn Văn An Nhãn dệt chính cho áo T-shirt.
ACC-ELS-001-WHT ELS-001 ELS Thun dệt kim Trắng 2.5cm 2500 Mét Kệ C-04-08 800 In Stock E20230928 9/28/2023 Phụ liệu Phong Phú PO23-109 500 10/26/2023 Lê Minh Tuấn Thun luồn lưng quần thể thao.
ACC-INT-001-WHT INT-001 INT Keo giấy dựng cổ Trắng 90cm 800 Mét Kệ B-01-03 150 In Stock I20230905 9/5/2023 Dệt may Thành Công PO23-088 150 10/22/2023 Nguyễn Văn An Keo ủi dùng cho cổ và nẹp áo sơ mi.
ACC-ZIP-002-RED ZIP-002 ZIP Khóa kéo giọt nước Đỏ 20cm 320 Cái Kệ B-03-09 100 In Stock Z20231005 10/5/2023 Phụ liệu Sài Gòn PO23-118 100 10/25/2023 Trần Thị Bích Khóa kéo giấu, dùng cho đầm nữ.
ACC-THR-002-NVY THR-002 THR Chỉ may cotton Xanh Navy 50/3 45 Cuộn Kệ C-02-12 60 Low Stock T20230815 8/15/2023 Sợi Việt Thắng PO23-070 50 10/26/2023 Lê Minh Tuấn Chỉ cotton chần cho quần kaki.
ACC-LBL-002-WHT LBL-002 LBL Nhãn satin in HDSD Trắng 3cm x 6cm 4500 Cái Kệ D-05-03 0 In Stock L20231012 10/12/2023 Nhãn mác An Phát PO23-124 1000 10/23/2023 Nguyễn Văn An Nhãn sườn in hướng dẫn sử dụng.

# accessory-issue-transaction-reports page:

- Thiết kế tương tự như issue-transaction-reports page nhưng dữ liệu là của phụ liệu gồm các trường sau đây:
  QR Code ItemNumber ItemCategory MaterialName Color Size Quantity Unit Location BatchNumber DateReceived Supplier PO Number ReorderPoint LastModifiedDate LastModifiedBy Description JOB Issued Quantity Issued Date Issued By Destination Status Remark
  ACC-BTN-001-BLK BTN-001 BTN Cúc nhựa 4 lỗ Đen 15mm 5000 Cái Kệ A-01-05 B20231001 10/1/2023 Phụ liệu Phong Phú PO23-115 1000 10/26/2023 Nguyễn Văn An Cúc nhựa thông dụng cho áo sơ mi nam. JOB2310-SM01 2000 10/25/2023 Nguyễn Văn An Chuyền may 1 Complete
  ACC-ZIP-001-BRS ZIP-001 ZIP Khóa kéo kim loại Đồng 50cm 850 Cái Kệ B-03-01 Z20230915 9/15/2023 Dệt may Thành Công PO23-098 200 10/25/2023 Trần Thị Bích Dùng cho áo khoác jean, loại răng 5. JOB2310-JK02 350 10/24/2023 Trần Thị Bích Xưởng may 2 Complete
  ACC-THR-001-WHT THR-001 THR Chỉ may polyester Trắng 40/2 150 Cuộn Kệ C-02-11 T20231010 10/10/2023 Sợi Việt Thắng PO23-121 50 10/26/2023 Lê Minh Tuấn Chỉ may vắt sổ, độ bền cao. JOB2310-SM01 50 10/25/2023 Lê Minh Tuấn Chuyền may 1 Complete
  ACC-BTN-002-BRN BTN-002 BTN Cúc gỗ 2 lỗ Nâu 20mm 90 Cái Kệ A-01-06 B20230820 8/20/2023 Phụ liệu Sài Gòn PO23-075 100 10/24/2023 Trần Thị Bích Cúc trang trí cho áo khoác len. JOB2310-SM02 40 10/25/2023 Lê Minh Tuấn Chuyền may 1 Partially Cần đặt thêm hàng.
  ACC-ELS-001-WHT ELS-001 ELS Thun dệt kim Trắng 2.5cm 2500 Mét Kệ C-04-08 E20230928 9/28/2023 Phụ liệu Phong Phú PO23-109 500 10/26/2023 Lê Minh Tuấn Thun luồn lưng quần thể thao. JOB2310-QT05 1200 10/25/2023 Lê Minh Tuấn Tổ cắt Complete
  ACC-INT-001-WHT INT-001 INT Keo giấy dựng cổ Trắng 90cm 800 Mét Kệ B-01-03 I20230905 9/5/2023 Dệt may Thành Công PO23-088 150 10/22/2023 Nguyễn Văn An Keo ủi dùng cho cổ và nẹp áo sơ mi. JOB2310-SM01 400 10/21/2023 Nguyễn Văn An Tổ ép keo Complete
  ACC-ZIP-002-RED ZIP-002 ZIP Khóa kéo giọt nước Đỏ 20cm 320 Cái Kệ B-03-09 Z20231005 10/5/2023 Phụ liệu Sài Gòn PO23-118 100 10/25/2023 Trần Thị Bích Khóa kéo giấu, dùng cho đầm nữ. JOB2310-D03 180 10/24/2023 Trần Thị Bích Chuyền may 3 Complete
  ACC-LBL-002-WHT LBL-002 LBL Nhãn satin in HDSD Trắng 3cm x 6cm 4500 Cái Kệ D-05-03 L20231012 10/12/2023 Nhãn mác An Phát PO23-124 1000 10/23/2023 Nguyễn Văn An Nhãn sườn in hướng dẫn sử dụng. JOB2310-SM01 2000 10/22/2023 Nguyễn Văn An Tổ hoàn thiện Complete

Tạo thư mục mới packaging-issue-transaction-reports trong thư mục pages, thư mục này sẽ chứa trang quản lí báo cáo xuất bao bì đóng gói tương tự như trang accessory-issue-transaction-reports đã có trước đó, trường dữ liệu như nhau, nhưng data giả sẽ là của bao bì đóng gói.

Sửa lại thư mục issue-packaging-form, thư mục này sẽ tương tự như thư mục issue-accessory-form, nhưng data giả sẽ là của bao bì đóng gói.

sửa lại cho giao diện Issue Fabric Form Cutting Plan sẽ không cho search JOB nữa, ở đây người dùng ấn vào nút upload Kanban từ file excel, file excel sẽ chứa danh sách các JOB cần xuất vải, sau khi upload file excel thành công thì bảng Cutting Plan sẽ hiển thị danh sách các JOB đã upload từ file excel, người dùng chọn JOB từ danh sách này để xuất vải.
Khi chọn 1 JOB từ danh sách đã upload, bảng Inventory sẽ hiển thị các cuộn vải có thể xuất cho JOB đó, hệ thống sẽ tự động chọn những cây vải phù hợp với JOB đã chọn, ưu tiên những cây vải có số yards thấp hơn để xuất trước, cây vải cuối cùng có thể điều chỉnh số yards xuất nếu số yards bị thừa so với số yards yêu cầu của JOB.

tạo giao diện bằng react typescript, tailwindcss trong thư mục audit-log
Bảng audit log gồm các trường sau đây:
ID (ID) Mã định danh duy nhất của bản ghi
Action (Action) Hành động đã thực hiện (Create/Update/Delete/Login/Logout)
Module (Module) Tên module hoặc phần mềm nơi hành động được thực hiện (Relax Fabric, Issue Fabric, Inventory Management, v.v.)
User (User) Tên người dùng đã thực hiện hành động
DateTime (DateTime) Ngày và giờ khi hành động được thực hiện

Mục đích của bảng audit log là để theo dõi và ghi lại các hoạt động quan trọng trong hệ thống kho vải 

# Điều chỉnh lại trang inventory-management như sau:
- Các cột hiển thị trên bảng như sau: Order No, Supplier Code, Invoice No, Roll No, Color, Batch No, Shipped length, Actual length, Gross Weight, Net Weight, QC Status, Location, Factory, Relax hour, Relax Progress (thanh tiến trình relax vãi), Date Relaxed.
- Thay đổi bộ lọc theo các trường: Order No, Supplier Code, Invoice No, Roll No, Color, QC Status.
- Thay đổi nút xuất excel thành xuất All bảng dữ liệu hiện tại trên bảng (không phải chỉ các dòng đã chọn).
- thêm 1 nút Action, khi ấn vào sẽ có các tùy chọn:
  - Print QR Code: In mã QR cho cuộn vải đã chọn.
  - View Location History: Xem lịch sử di chuyển vị trí của cuộn vải đã chọn.
  - Transfer Location: Chuyển vị trí của cuộn vải đã chọn sang vị trí khác trong kho.
  - Delete: Xóa cuộn vải đã chọn khỏi hệ thống (yêu cầu xác nhận trước khi xóa).
- Nút view để ẩn hiện các cột trên bảng dữ liệu được đưa xuống dưới dạng nút bấm trên header của bảng, khi ấn vào sẽ mở popup cho phép chọn các cột để hiển thị hoặc ẩn đi trên bảng dữ liệu InventoryTable.

nút Action không phải nằm trên bảng, nút Action nằm bên trái của nút Export All, khi ấn vào sẽ hiện thị menu thả xuống với các tùy chọn 
- Print QR Code: In mã QR cho cuộn vải đã chọn.
  - View Location History: Xem lịch sử di chuyển vị trí của cuộn vải đã chọn.
  - Transfer Location: Chuyển vị trí của cuộn vải đã chọn sang vị trí khác trong kho.
  - Delete: Xóa cuộn vải đã chọn khỏi hệ thống (yêu cầu xác nhận trước khi xóa).

Cho phép Chuyển vị trí của cuộn vải đã chọn sang vị trí khác trong kho, Xem lịch sử di chuyển vị trí của cuộn vải đã chọn, khi ấn xem thì hiện popup hiển thị lịch sử di chuyển vị trí của cuộn vải đó, gồm các cột: Date Time, From Location, To Location, Changed By

cho phép Transfer Location của các cuộn vải đã tích chọn luôn, để di chuyển vị trí của nhiều cuộn vải cùng lúc. View Location History cũng tương tự như vậy.

thêm 1 tùy chọn Xuất excel cho các dòng đã chọn trong nút Action luôn nhé.
Trên từng dòng của bảng có nút 3 chấm, ấn vào sẽ có các tùy chọn:
- Print QR Code: In mã QR cho cuộn vải đó.
- View Location History: Xem lịch sử di chuyển vị trí của cuộn vải đó.
- Transfer Location: Chuyển vị trí của cuộn vải đó sang vị trí khác trong kho.
- Delete: Xóa cuộn vải đó khỏi hệ thống (yêu cầu xác nhận trước khi xóa).


