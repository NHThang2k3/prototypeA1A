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

Màn hình hiển thị danh sách các JOB.
người dùng có thể nhấn vào từng JOB để xem chi tiết thông tin, sửa đổi 1 số thông tin của JOB, tạo mã QR code cho JOB , in mã QR code.
Người dùng có thể tìm kiếm theo mã JOB.
Có 1 nút import file, khi ấn vào sẽ mở popup cho phép người dùng import 8 file excel vào hệ thống để tạo ra 1 JOB mới.

# Màn hình Import JOB/PO (Suggest Integration ERP)

# Màn hình Search Job

# Màn hình Form update Job information

# Màn hình Generate QR Code

# Màn hình Print QR Code

# Màn hình Cutting Performance Dashboard

Màn hình nên hiển thị gì?

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
