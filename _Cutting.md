### ♻️ Nhóm chức năng có thể Tái sử dụng (Reuse)

- **Generate Docket file**
  - Docket file
  - Generate Barcode
  - Print barcode
- **Cut Process**
  - Record data fabric spreading
  - Record data cutting
  - Record data numbering
  - Record data bundling
  - Record data PO splitting
- **Roll Cutting Monitoring**
  - Manage fabric roll receiving
  - Manage roll storage
  - Manage roll issuance
- **Cutting Reports**
  - Cutting reports
- **QC Management**
  - QC inline
  - QC endline
- **Machine Downtime**
  - Machine downtime

---

### 🏗️ Nhóm chức năng Cần xây dựng lại (Have to rebuild)

- **Planning**
  - Master Plan
  - Plan Cutting Weekly & Daily
- **Bundle Data**
  - Import JOB/PO (Suggest Integration ERP)
  - Search Job
  - Form update Job information
  - Generate QR Code
  - Print QR Code
- **Cutting Performance Dashboard (TV Performance)**
  - Cutting Performance Dashboard
- **Action Plan**
  - Action Plan
- **Tool Management**
  - Tool management

---

Bạn có muốn tôi giúp tạo một bảng so sánh các tính năng này để dễ theo dõi hơn không?

- file Master gồm các cột:

- file MAST_SUM_QTY gồm các cột:

- file SIZE gồm các cột:

- file COLOR gồm các cột:

- file STYLE_COMBO gồm các cột:

STYLE_SIZE gồm các cột:

STYLE

DECORATION

# Màn hình Master Plan -> Final Kanban

tạo giao diện bằng react tsx, tailwindcss trong thư mục master-plan
Màn hình cho phép người dùng upload Master Plan (file excel hoặc pdf) lên hệ thống, sau đó hệ thống sẽ biến đổi và tạo ra Final Kanban tự động dựa trên dữ liệu từ Master Plan đó. sau đó có tùy chọn để xuất Final Kanban ra file excel hoặc pdf, gửi đến các bộ phận liên quan.

# Plan Cutting Weekly & Daily

tạo giao diện bằng react tsx, tailwindcss trong thư mục cutting-daily-weekly
Màn hình hiển thị kế hoạch cắt vải hàng tuần và hàng ngày, cho phép người dùng theo dõi tiến độ và điều chỉnh kế hoạch khi cần thiết.

# Màn hình Bundle Management

tạo giao diện bằng react tsx, tailwindcss trong thư mục bundle-management
Màn hình hiển thị danh sách các JOB.
người dùng có thể nhấn vào từng JOB để xem chi tiết thông tin, sửa đổi 1 số thông tin của JOB, tạo mã QR code cho JOB , in mã QR code.
Người dùng có thể tìm kiếm theo mã JOB.
Có 1 nút import file, khi ấn vào sẽ mở popup cho phép người dùng import 8 file excel vào hệ thống để tạo ra 1 JOB mới.

Bảng danh sách JOB gồm các cột sau:
JOB NO SUB NO JOB DATE REQUIRE DATE SHIPMENT DATE ORDER TYPE REC DATE BRAND CODE PO NO PO DATE SHIP_BY SUM QTY STYLE NO STYLE DESC Season Country PLANT_CODE MER Unit COMBO_CODE COMBO_DESC SEQ_COLOR COLOR_NAME JOB_SIZE Extend Term Color Group
SOAD2510112 1 15/10/2025 30/11/2025 30/11/2025 1 30/11/2025 AD 900988541 14/10/2025 MO-001 3500 F3108HMU202S MENS H SWEAT (1/2) FW25 DEU A1A2 304459871 PCS JI7550 BLUE 1 ROYAL BLUE M Net 30 Blue
SOAD2510113 1 15/10/2025 15/12/2025 10/12/2025 1 15/12/2025 RB 900988542 14/10/2025 MO-002 8200 R2801LKL109S WMNS L JACKET (FULL) FW25 VNM B2C1 304112345 PCS JI7551 BLACK 1 BLACK S Net 60 Black
SOAD2510113 2 16/10/2025 15/12/2025 10/12/2025 1 15/12/2025 RB 900988542 14/10/2025 MO-002 4150 R2801LKL109S WMNS L JACKET (FULL) FW25 VNM B2C1 304112345 PCS JI7552 WHITE 2 WHITE M Net 60 White
SOAD2510114 1 17/10/2025 5/12/2025 1/12/2025 2 5/12/2025 AD 900988776 16/10/2025 AO-005 650 F4502KID111S KIDS TEE (1/1) SS26 KOR C3A1 304998877 PCS JI7610 RED 1 SCARLET 128 Red
SOTSM2503115 1 18/10/2025 25/11/2025 25/11/2025 1 25/11/2025 PU TEST SHIPMENT 18/10/2025 MO-003 15 P1105SHO331S SAMPLE M SHOE FW25 TES A1A2 TEST PCS JI8001 GREY/BLK 1 CHARCOAL 42 Grey
SOTSM2503115 1 18/10/2025 25/11/2025 25/11/2025 1 25/11/2025 PU TEST SHIPMENT 18/10/2025 MO-003 15 P1105SHO331S SAMPLE M SHOE FW25 TES A1A2 TEST PCS JI8001 GREY/BLK 2 BLACK 42 Black
SOAD2510116 1 20/10/2025 10/1/2026 5/1/2026 1 10/1/2026 AD 900989112 19/10/2025 MO-002 12050 F2998TRP404S MENS TRACKPANTS SS26 IDN D4B5 304776655 PCS JI9141 NAVY 1 COLLEGIATE NAVY L Net 30 Blue
SOAD2510117 1 21/10/2025 20/12/2025 18/12/2025 3 20/12/2025 RB 900989253 20/10/2025 AO-001 980 R5050ACC880S UNISEX CAP FW25 CHN E5F8 304321987 PCS JI9211 GREEN 1 OLIVE GREEN OSFM Green
SOAD2510118 1 22/10/2025 15/01/2026 10/1/2026 1 15/01/2026 AD 900989444 21/10/2025 MO-001 7500 F3108HMU202S MENS H SWEAT (1/2) SS26 DEU A1A2 304459871 PCS JI7553 GREY 2 HEATHER GREY XL Grey
SOAD2510119 1 22/10/2025 28/12/2025 28/12/2025 1 28/12/2025 PU 900989501 21/10/2025 MO-004 4300 P6543LEG765S WMNS LEGGING FW25 KHM F1A9 304887712 PCS JI9834 BURGUNDY 1 BOLD BURGUNDY M Net 45 Red

- thêm nút Search bên cạnh ô tìm kiếm JOB NO
- thêm cột QR Code cho từng JOB, giá trị sẽ là mã QR code đã được generate cho JOB đó (VD: QR123456789)
- Thêm phân trang cho bảng danh sách JOB, mỗi trang hiển thị 10 JOB, cho phép người dùng chuyển trang, chọn số dòng hiển thị trên mỗi trang (10, 25, 50, 100)
- trên bảng danh sách JOB, thêm nút "Update Job" cho mỗi dòng JOB, khi ấn vào sẽ mở popup cho phép người dùng sửa đổi 1 số thông tin của JOB.
- thêm 1 nút, khi người dùng ấn vào sẽ sổ xuống cửa sổ cho phép người dùng tick chọn các cột để hiển thị hoặc ẩn trên bảng danh sách JOB.

# Màn hình Import JOB/PO (Suggest Integration ERP)

# Màn hình Search Job

# Màn hình Form update Job information

# Màn hình Generate QR Code

# Màn hình Print QR Code

# Màn hình Cutting Performance Dashboard

Màn hình nên hiển thị gì?

- Dùng thư viện echarts để hiển thị biểu đồ

# Màn hình Action Plan

# Màn hình Tool management

Khi import 8 file excel vào hệ thống để tạo ra 1 JOB mới, thì JOB mới nên có các thông tin nào?

Thông tin chung về JOB:
JOB NO: Mã số định danh duy nhất cho mỗi JOB (ví dụ: SOAD2479632).
SUB NO: Mã số phụ của JOB.
JOB DATE: Ngày tạo JOB.
REQUIRE DATE: Ngày yêu cầu hoàn thành.
SHIPMENT DATE: Ngày giao hàng.
ORDER TYPE: Loại đơn hàng.
REC DATE: Ngày nhận.
BRAND CODE: Mã thương hiệu.
PO NO: Mã số đơn đặt hàng.
PO DATE: Ngày đặt hàng.
SHIP_BY: Mã đơn vị vận chuyển.
SUM QTY: Tổng số lượng sản phẩm trong JOB.

STYLE NO: Mã kiểu sản phẩm (ví dụ: F2506LHMU101S).
STYLE DESC: Mô tả kiểu sản phẩm.
Season: Mùa của sản phẩm.
Country: Quốc gia.
PLANT_CODE: Mã nhà máy.
MER: Mã nhà cung cấp.
Unit: Đơn vị tính (ví dụ: PCS - chiếc).

COMBO_CODE: Mã phối màu.
COMBO_DESC: Mô tả phối màu.
SEQ_COLOR: Thứ tự màu.
COLOR_NAME: Tên màu.
JOB_SIZE: Kích cỡ sản phẩm.

Extend Term: Điều khoản mở rộng (nếu có).
Color Group: Nhóm màu.

Việc tổng hợp các thông tin này sẽ đảm bảo rằng mỗi JOB mới được tạo ra đều có đầy đủ các chi tiết cần thiết để quản lý và theo dõi đơn hàng một cách hiệu quả.
