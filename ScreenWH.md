### Phân tích và Danh sách các màn hình cần thiết

#### 1. Kanban Board & Planning (3 Màn hình)

Nhóm này tập trung vào việc theo dõi tổng quan và lập kế hoạch.

- **Màn hình 1: Dashboard Hàng Nhập (Inbound Dashboard)**

  - **Mục đích:** Cung cấp cái nhìn tổng quan về các lô hàng đang trên đường về.
  - **Đáp ứng yêu cầu:** `Inbound Dashboard (Packing List, ETD,ETA,...)`
  - **Chức năng chính:** Hiển thị danh sách các Packing List, thông tin nhà cung cấp, ngày dự kiến đi (ETD), ngày dự kiến đến (ETA), trạng thái lô hàng.

- **Màn hình 2: Quản lý Tồn Kho (Inventory List)**

  - **Mục đích:** Một màn hình trung tâm để xem và quản lý tất cả hàng tồn kho.
  - **Đáp ứng yêu cầu:**
    - `Inventory list`
    - `Fabric WH information report`
    - `Accessory WH information report`
    - `Packing WH information report`
  - **Chức năng chính:** Hiển thị danh sách chi tiết các mặt hàng trong kho. Người dùng có thể **lọc theo loại kho** (Vải, Phụ liệu, Đóng gói) để xem thông tin chi tiết. Chức năng xuất file (Export/Print) trên màn hình này sẽ tạo ra các báo cáo tương ứng.

- **Màn hình 3: Bảng Kanban (Kanban Board)**
  - **Mục đích:** Trực quan hóa luồng công việc và di chuyển vật tư giữa các công đoạn.
  - **Đáp ứng yêu cầu:**
    - `Kanban board for FBWH from cutting office`
    - `Kanban board for ACC and Packing WH from sewing lines`
    - `Kanban board dor ACC WH from decoration office`
  - **Chức năng chính:** Một màn hình Kanban duy nhất nhưng có thể **chuyển đổi/lọc** để xem các luồng công việc khác nhau (Vải từ cắt, Phụ liệu từ may, Phụ liệu từ bộ phận trang trí). Các thẻ (card) trên bảng sẽ đại diện cho các yêu cầu vật tư, di chuyển theo từng cột trạng thái (Mới, Đang xử lý, Hoàn thành).

#### 2. Receipt - Nhập kho (2 Màn hình)

Nhóm này xử lý nghiệp vụ nhận hàng vào kho.

- **Màn hình 4: Form Nhập Kho từ Packing List (Import Packing List Form)**

  - **Mục đích:** Nhập dữ liệu chi tiết của một lô hàng vào hệ thống.
  - **Đáp ứng yêu cầu:** `Import Packing List Form`
  - **Chức năng chính:** Form cho phép người dùng nhập tay hoặc tải lên file Packing List để tạo một phiếu nhập kho mới, ghi nhận số lượng, mã hàng, thông tin chi tiết.

- **Màn hình 5: In Tem & Mã QR (Label & QR Code Printing)**
  - **Mục đích:** Tạo và in tem nhãn có mã QR cho từng đơn vị hàng hóa sau khi nhập kho.
  - **Đáp ứng yêu cầu:** `Packing information & QR Code print Report`
  - **Chức năng chính:** Sau khi nhập kho, hệ thống sẽ dẫn tới màn hình này để hiển thị thông tin chi tiết của lô hàng và cho phép người dùng chọn và in tem QR cho các sản phẩm.

#### 3. Inventory Tracking - Theo dõi tồn kho (2 Màn hình)

Nhóm này quản lý vị trí và theo dõi hàng hóa bằng QR code.

- **Màn hình 6: Quản lý Vị trí Kho (Location Management)**

  - **Mục đích:** Thiết lập và quản lý sơ đồ, cấu trúc của kho hàng.
  - **Đáp ứng yêu cầu:** `Location Managerment`
  - **Chức năng chính:** Giao diện cho phép tạo, sửa, xóa các vị trí trong kho (dãy, kệ, tầng, ô). Có thể hiển thị dưới dạng cây thư mục hoặc sơ đồ trực quan.

- **Màn hình 7: Giao diện Quét Mã QR (QR Scan Interface)**
  - **Mục đích:** Màn hình chuyên dụng (thường trên thiết bị di động/máy quét) để thực hiện nhanh các thao tác.
  - **Đáp ứng yêu cầu:** `QR Scan`
  - **Chức năng chính:** Giao diện đơn giản, có thể bật camera để quét mã. Sau khi quét, hệ thống sẽ hiển thị thông tin sản phẩm và các nút hành động nhanh như: "Kiểm tra thông tin", "Chuyển vị trí", "Thêm vào phiếu xuất", v.v.

#### 4. Delivery transaction - Giao dịch xuất kho (4 Màn hình)

Nhóm này xử lý các nghiệp vụ xuất vật tư cho sản xuất. Các form xuất kho được tách riêng vì chúng thường có các trường thông tin và quy trình khác nhau.

- **Màn hình 8: Form Xuất Vải (Issue Fabric Form)**

  - **Mục đích:** Tạo phiếu yêu cầu và xuất vải cho bộ phận cắt.
  - **Đáp ứng yêu cầu:** `Issue fabric form`
  - **Chức năng chính:** Form để chọn mã vải, số lượng, cây vải, ghi nhận mục đích xuất.

- **Màn hình 9: Form Xuất Phụ liệu (Issue Accessories Form)**

  - **Mục đích:** Tạo phiếu yêu cầu và xuất các loại phụ liệu (nút, chỉ, khóa kéo...).
  - **Đáp ứng yêu cầu:** `Issue accessories form`
  - **Chức năng chính:** Form để chọn mã phụ liệu, số lượng, đơn vị tính.

- **Màn hình 10: Form Xuất Thẻ bài & Phụ liệu Đóng gói (Issue Tags & Packaging Form)**

  - **Mục đích:** Tạo phiếu yêu cầu và xuất các vật tư cho công đoạn đóng gói.
  - **Đáp ứng yêu cầu:** `Issuing tags and packaging components form`
  - **Chức năng chính:** Form để chọn thẻ bài, bao bì, nhãn mác... theo mã hàng.

- **Màn hình 11: Báo cáo Giao dịch Xuất Kho (Issue Transaction Reports)**
  - **Mục đích:** Xem lại lịch sử và chi tiết các lần xuất kho.
  - **Đáp ứng yêu cầu:**
    - `Relax & issue fabrics report`
    - `Issued hangtags and packaging components reports + temp WH record details`
    - `Issued accessories report + temp WH detail records`
  - **Chức năng chính:** Một màn hình danh sách tất cả các giao dịch xuất kho. Người dùng có thể **lọc theo loại vật tư** (vải, phụ liệu, đóng gói), theo ngày tháng, theo người nhận để xem báo cáo tương ứng. Click vào một dòng sẽ xem được chi tiết phiếu xuất.

---

#### Bảng tổng kết

| STT | Tên Màn Hình                 | Mô tả / Chức năng chính                                                      |
| :-: | :--------------------------- | :--------------------------------------------------------------------------- |
|  1  | Dashboard Hàng Nhập          | Theo dõi tổng quan các lô hàng sắp về (ETD, ETA).                            |
|  2  | Quản lý Tồn Kho              | Xem toàn bộ tồn kho, lọc theo kho (vải, phụ liệu, đóng gói) và xuất báo cáo. |
|  3  | Bảng Kanban                  | Trực quan hóa luồng công việc, có thể lọc theo từng quy trình (cắt, may...). |
|  4  | Form Nhập Kho                | Nhập thông tin chi tiết từ Packing List để tạo phiếu nhập.                   |
|  5  | In Tem & Mã QR               | Tạo và in tem nhãn có mã QR cho hàng hóa mới nhập.                           |
|  6  | Quản lý Vị trí Kho           | Thiết lập và quản lý sơ đồ vị trí trong kho (kệ, ô).                         |
|  7  | Giao diện Quét Mã QR         | Màn hình đơn giản trên thiết bị di động để quét và thực hiện thao tác nhanh. |
|  8  | Form Xuất Vải                | Tạo phiếu yêu cầu và xuất kho vải cho sản xuất.                              |
|  9  | Form Xuất Phụ liệu           | Tạo phiếu yêu cầu và xuất kho phụ liệu cho sản xuất.                         |
| 10  | Form Xuất Thẻ bài & Đóng gói | Tạo phiếu yêu cầu và xuất kho vật tư đóng gói.                               |
| 11  | Báo cáo Giao dịch Xuất Kho   | Xem lịch sử các lần xuất kho, lọc theo loại vật tư và in báo cáo chi tiết.   |

**Kết luận:** Với cách tiếp cận này, bạn cần xây dựng **ít nhất 11 màn hình chính** để đáp ứng toàn bộ nghiệp vụ một cách hiệu quả và có hệ thống. Số lượng màn hình thực tế có thể tăng lên một chút tùy thuộc vào thiết kế UI/UX chi tiết (ví dụ: màn hình chi tiết, màn hình chỉnh sửa có tách riêng hay không).

---

Tuyệt vời! Dưới đây là phân tích chi tiết cho 3 màn hình thuộc nhóm **Kanban Board & Planning**, tuân thủ đầy đủ các yêu cầu bạn đã đưa ra.

---

### Màn hình 1: Dashboard Hàng Nhập (Inbound Dashboard)

#### 1. Mục tiêu và chức năng chính

- **Mục tiêu:** Cung cấp cho người quản lý kho và bộ phận kế hoạch một cái nhìn tổng quan, nhanh chóng và trực quan về tất cả các lô hàng (vật tư, nguyên phụ liệu) đang trên đường về kho. Giúp họ chủ động lên kế hoạch tiếp nhận, bố trí nhân sự và không gian lưu trữ.
- **Use Case:**
  - "Là một trưởng kho, tôi muốn biết trong tuần tới có bao nhiêu lô hàng sẽ về, từ nhà cung cấp nào, dự kiến ngày nào đến (ETA) để sắp xếp nhân viên bốc dỡ và chuẩn bị vị trí kệ."
  - "Là một nhân viên kế hoạch, tôi muốn theo dõi xem lô vải A đã được gửi đi (ETD) chưa và có bị trễ so với kế hoạch không để thông báo cho bộ phận sản xuất."
- **Hành động của người dùng:** Xem danh sách, tìm kiếm (theo số Packing List, tên NCC), lọc (theo trạng thái, khoảng thời gian ETD/ETA), sắp xếp dữ liệu. Họ có thể click vào một lô hàng để xem chi tiết (điều hướng đến màn hình chi tiết Packing List).
- **Luồng dữ liệu:**
  - **Nhận dữ liệu từ:** Hệ thống sau khi người dùng tạo/import một "Phiếu Packing List" mới (`Import Packing List Form`).
  - **Gửi dữ liệu đi:** Không gửi trực tiếp, nhưng hành động click trên một dòng dữ liệu sẽ điều hướng người dùng sang màn hình khác với ID của lô hàng đó.

#### 2. Bố cục và cấu trúc (Layout Structure)

- **Header / Navbar:**
  - Tiêu đề màn hình: "Dashboard Hàng Nhập".
  - Breadcrumb: `Trang chủ / Kế hoạch / Dashboard Hàng Nhập`.
  - Thanh tìm kiếm chung: Tìm kiếm nhanh theo Số PO, Số Packing List, Tên nhà cung cấp.
  - Nút hành động chính: "+ Nhập Packing List" (điều hướng đến form nhập liệu).
- **Main Content Area:**
  - **Khu vực tổng quan (Summary Cards):** 4 thẻ số liệu lớn ở trên cùng:
    1.  **Đang vận chuyển:** Tổng số lô hàng đang trên đường.
    2.  **Sắp đến trong 7 ngày:** Tổng số lô hàng có ETA trong 7 ngày tới.
    3.  **Bị trễ:** Tổng số lô hàng đã qua ngày ETA nhưng chưa cập nhật trạng thái "Đã đến".
    4.  **Chờ gửi:** Tổng số lô hàng đã có thông tin nhưng chưa có ETD.
  - **Bảng dữ liệu (Data Table):** Hiển thị danh sách chi tiết các lô hàng.
- **Sidebar (bên trái hoặc bộ lọc phía trên bảng):**
  - Bộ lọc theo Trạng thái: (Tất cả, Chờ gửi, Đang vận chuyển, Đã đến, Bị trễ, Đã hủy).
  - Bộ lọc theo Ngày dự kiến đi (ETD): Chọn khoảng ngày.
  - Bộ lọc theo Ngày dự kiến đến (ETA): Chọn khoảng ngày.
  - Bộ lọc theo Nhà cung cấp.
- **Footer:** Thông tin bản quyền, phiên bản ứng dụng.

#### 3. Thành phần giao diện (UI Components)

- `Cards`: Cho khu vực tổng quan.
- `Input Field` với icon kính lúp: Cho thanh tìm kiếm.
- `Button`: Nút "+ Nhập Packing List".
- `Data Table`: Bảng dữ liệu với các cột: Số PO, Số Packing List, Nhà cung cấp, Ngày dự kiến đi (ETD), Ngày dự kiến đến (ETA), Trạng thái, Người tạo.
- `Tags / Badges`: Để hiển thị trạng thái một cách trực quan (VD: màu xanh cho "Đang vận chuyển", màu cam cho "Sắp đến", màu đỏ cho "Bị trễ").
- `Date Range Picker`: Cho bộ lọc ngày tháng.
- `Dropdown / Select`: Cho các bộ lọc còn lại.
- `Pagination`: Để phân trang cho bảng dữ liệu.

#### 4. Trải nghiệm người dùng (UX Considerations)

- **Dễ hiểu:** Các lô hàng bị trễ hoặc sắp đến hạn cần được làm nổi bật bằng màu sắc để thu hút sự chú ý ngay lập tức.
- **Giảm thao tác:** Mặc định hiển thị các lô hàng có ETA trong 30 ngày tới. Thanh tìm kiếm cho phép gõ và tìm ngay lập tức mà không cần bấm nút.
- **Phản hồi rõ ràng:** Khi lọc hoặc tìm kiếm, bảng dữ liệu hiển thị trạng thái loading (skeleton-table) trước khi hiển thị kết quả.
- **Responsive:** Trên mobile, bảng dữ liệu có thể cuộn ngang hoặc chuyển đổi thành dạng danh sách thẻ (card list) để dễ đọc hơn.
- **Accessibility:** Đảm bảo độ tương phản màu sắc của các `Tags` trạng thái đủ cao. Các cột trong bảng có thể sắp xếp được.

#### 5. Luồng dữ liệu và trạng thái (Data & States)

- **Dữ liệu đầu vào:** Danh sách các Packing List chưa hoàn thành việc nhập kho.
- **Dữ liệu đầu ra:** Không có, chỉ hiển thị thông tin.
- **Các trạng thái chính:**
  - **Loading:** Khi màn hình được tải lần đầu hoặc khi áp dụng bộ lọc. Hiển thị skeleton UI.
  - **Empty state:** Khi không có lô hàng nào phù hợp với bộ lọc. Hiển thị thông báo "Không tìm thấy lô hàng nào" cùng với hình ảnh minh họa và nút "Nhập Packing List mới".
  - **Error state:** Khi API lỗi. Hiển thị thông báo "Đã có lỗi xảy ra. Vui lòng thử lại" và nút "Tải lại".
  - **Success state:** Hiển thị đầy đủ khu vực tổng quan và bảng dữ liệu.
- **API Endpoint:**
  - `GET /api/v1/inbound-shipments`: Lấy danh sách lô hàng.
  - **Params:** `?search=PL123&status=delayed&eta_from=...&eta_to=...`
  - **Response:** `{"data": [{"id": 1, "packing_list_no": "PL-001", "supplier": "...", "etd": "...", "eta": "...", "status": "delayed"}, ...], "meta": {"total": 100, "page": 1, "per_page": 20}}`

#### 6. Thông tin phụ trợ

- **Tên màn hình:** `SCR-01_InboundDashboard`
- **Liên kết với màn hình khác:**
  - Từ `Menu chính` -> `SCR-01_InboundDashboard`
  - Click nút "+ Nhập Packing List" -> `SCR-04_ImportPackingListForm`
  - Click vào một dòng trong bảng -> `SCR-04_PackingListDetail` (view-only mode)
- **Role/Permission:** `Quản lý kho`, `Nhân viên kế hoạch`, `Admin` (được xem).
- **Quy tắc nghiệp vụ:** Trạng thái "Bị trễ" (Delayed) được hệ thống tự động cập nhật nếu `hôm nay > ETA` và trạng thái lô hàng chưa phải là "Đã đến" (Arrived).

---

### Màn hình 2: Quản lý Tồn Kho (Inventory List)

#### 1. Mục tiêu và chức năng chính

- **Mục tiêu:** Là màn hình trung tâm (single source of truth) để tra cứu mọi thông tin chi tiết về hàng tồn kho. Cung cấp một công cụ mạnh mẽ để kiểm tra số lượng, vị trí, trạng thái của từng mã hàng. Hỗ trợ xuất báo cáo tồn kho định kỳ.
- **Use Case:**
  - "Là một nhân viên kho, tôi cần tìm mã vải 'FVN-102' để xem nó đang nằm ở kệ nào và còn lại bao nhiêu mét."
  - "Là một quản lý, tôi muốn xuất file Excel báo cáo tồn kho của tất cả phụ liệu (Accessories) vào cuối tháng."
- **Hành động của người dùng:** Tìm kiếm, lọc chuyên sâu (theo kho, loại vật tư, vị trí, nhà cung cấp), xem chi tiết, xuất dữ liệu ra file (Excel, PDF).
- **Luồng dữ liệu:**
  - **Nhận dữ liệu từ:** Cơ sở dữ liệu tồn kho. Dữ liệu này được cập nhật khi có giao dịch nhập kho (`Receipt`) hoặc xuất kho (`Delivery transaction`).
  - **Gửi dữ liệu đi:** Yêu cầu xuất báo cáo sẽ được gửi tới backend để xử lý và tạo file.

#### 2. Bố cục và cấu trúc (Layout Structure)

- **Header / Navbar:**
  - Tiêu đề màn hình: "Quản lý Tồn Kho".
  - Breadcrumb: `Trang chủ / Tồn kho / Danh sách tồn kho`.
  - Thanh tìm kiếm chung: Tìm kiếm theo Mã vật tư (SKU), Tên vật tư.
  - Nút hành động: "Xuất Báo cáo", "Kiểm kê".
- **Main Content Area:**
  - **Bảng dữ liệu (Data Table):** Cực kỳ chi tiết, là thành phần chính của màn hình.
- **Sidebar (bên trái, luôn hiển thị):**
  - Bộ lọc theo Kho: `Fabric WH`, `Accessory WH`, `Packing WH`.
  - Bộ lọc theo Loại vật tư (sẽ thay đổi tùy theo kho được chọn).
  - Bộ lọc theo Vị trí: Dạng cây thư mục (Tree select) thể hiện `Khu -> Dãy -> Kệ -> Tầng`.
  - Bộ lọc theo Nhà cung cấp.
  - Bộ lọc theo Trạng thái tồn kho: (Tất cả, Dưới mức tối thiểu, Vượt mức tối đa).
- **Footer:** Thông tin bản quyền.

#### 3. Thành phần giao diện (UI Components)

- `Advanced Data Table`: Bảng dữ liệu có khả năng sắp xếp, thay đổi độ rộng cột, ẩn/hiện cột. Các cột chính: Mã VT (SKU), Tên vật tư, Đơn vị tính, Kho, Vị trí, Số lượng tồn, Số lượng khả dụng, Trạng thái.
- `Tree Select`: Cho bộ lọc vị trí.
- `Multi-select Dropdown`: Cho bộ lọc loại vật tư, nhà cung cấp.
- `Button with Icon`: Nút "Xuất Báo cáo" (icon Excel), "Kiểm kê" (icon clipboard).
- `Modal / Dialog`: Hiển thị khi người dùng click vào một dòng để xem chi tiết lịch sử giao dịch của mã hàng đó.
- `Tooltip`: Khi di chuột qua mã vị trí, hiển thị đầy đủ đường dẫn `Khu A > Dãy 01 > Kệ 03`.

#### 4. Trải nghiệm người dùng (UX Considerations)

- **Hiệu năng:** Màn hình này có thể tải hàng ngàn dòng dữ liệu. Bắt buộc phải dùng pagination hoặc virtual scrolling để đảm bảo hiệu năng.
- **Giảm thao tác:** Bộ lọc phải cho phép áp dụng nhiều tiêu chí cùng lúc. Khi người dùng chọn một bộ lọc, kết quả phải được cập nhật ngay (live update).
- **Phản hồi rõ ràng:** Khi nhấn "Xuất Báo cáo", hiển thị thông báo "Đang xử lý yêu cầu..." và sau đó là link tải file hoặc thông báo thành công.
- **Responsive:** Trên mobile, các bộ lọc có thể được ẩn trong một nút "Lọc" và hiển thị dưới dạng bottom sheet. Bảng dữ liệu cần được tối ưu để không bị vỡ layout.

#### 5. Luồng dữ liệu và trạng thái (Data & States)

- **Dữ liệu đầu vào:** Toàn bộ dữ liệu vật tư trong kho.
- **Dữ liệu đầu ra:** File báo cáo (Excel/PDF).
- **Các trạng thái chính:** Tương tự màn hình Dashboard (Loading, Empty, Error, Success). Trạng thái Empty đặc biệt quan trọng: "Không có vật tư nào trong kho" hoặc "Không tìm thấy kết quả phù hợp với bộ lọc".
- **API Endpoint:**
  - `GET /api/v1/inventory-items`: Lấy danh sách vật tư tồn kho.
  - **Params:** `?warehouse_id=1&category=fabric&location_id=123&search=...`
  - **Response:** Dữ liệu JSON được phân trang.
  - `POST /api/v1/inventory-reports`: Yêu cầu xuất báo cáo.
  - **Body:** `{"format": "xlsx", "filters": {"warehouse_id": 1, ...}}`

#### 6. Thông tin phụ trợ

- **Tên màn hình:** `SCR-02_InventoryList`
- **Liên kết với màn hình khác:**
  - Click vào lịch sử giao dịch của một vật tư -> `SCR-XX_TransactionHistory`
  - Click nút "Kiểm kê" -> `SCR-XX_StockTakeModule`
- **Role/Permission:**
  - `Nhân viên kho`: Được xem, tìm kiếm.
  - `Quản lý kho`: Được xem, tìm kiếm, xuất báo cáo, khởi tạo kiểm kê.
  - `Admin`: Full quyền.
- **Quy tắc nghiệp vụ:** Số lượng khả dụng = Số lượng tồn - Số lượng đã được giữ cho các lệnh xuất kho chưa hoàn thành.

---

### Màn hình 3: Bảng Kanban (Kanban Board)

#### 1. Mục tiêu và chức năng chính

- **Mục tiêu:** Trực quan hóa luồng yêu cầu và luân chuyển vật tư giữa các bộ phận (từ kho đến cắt, từ may đến kho phụ liệu). Giúp đội ngũ kho quản lý công việc một cách hiệu quả, xác định các điểm nghẽn và ưu tiên các yêu cầu khẩn cấp.
- **Use Case:**
  - "Là một tổ trưởng kho vải, tôi nhìn vào cột 'Yêu cầu mới' để biết bộ phận cắt đang cần những loại vải nào, sau đó tôi kéo thẻ công việc đó sang cột 'Đang chuẩn bị' và giao cho một nhân viên thực hiện."
  - "Là nhân viên kho, tôi chỉ cần nhìn vào cột 'Đang chuẩn bị' có tên tôi được gán vào để biết công việc của mình hôm nay là gì."
- **Hành động của người dùng:** Kéo-thả (drag-and-drop) các thẻ công việc qua các cột trạng thái, lọc bảng Kanban, click vào thẻ để xem chi tiết yêu cầu, gán người thực hiện.
- **Luồng dữ liệu:**
  - **Nhận dữ liệu từ:** Các form yêu cầu vật tư (`Issue fabric form`, `Issue accessories form`...). Mỗi yêu cầu mới sẽ tạo ra một thẻ (card) trên cột đầu tiên của bảng Kanban tương ứng.
  - **Gửi dữ liệu đi:** Khi một thẻ được di chuyển, hệ thống sẽ cập nhật trạng thái của yêu cầu tương ứng trong cơ sở dữ liệu. Khi thẻ được kéo vào cột cuối cùng ("Đã giao"), hệ thống có thể kích hoạt nghiệp vụ trừ tồn kho.

#### 2. Bố cục và cấu trúc (Layout Structure)

- **Header / Navbar:**
  - Tiêu đề màn hình: "Bảng Công Việc Kanban".
  - Breadcrumb: `Trang chủ / Kế hoạch / Bảng Kanban`.
  - Bộ lọc/Tabs chính ở trên cùng: `Kho Vải -> Cắt`, `May -> Kho Phụ Liệu`, `Trang trí -> Kho Phụ Liệu`. Giúp người dùng chuyển đổi giữa các bảng Kanban khác nhau.
- **Main Content Area:**
  - **Khu vực bảng Kanban:** Chia thành các cột dọc.
    - **Cột (Columns):** Tên cột thể hiện trạng thái công việc. VD: `Yêu cầu mới` (To Do), `Đang chuẩn bị` (In Progress), `Sẵn sàng giao` (Ready for Pickup), `Đã giao` (Done).
    - **Thẻ (Cards):** Mỗi thẻ là một yêu cầu vật tư, hiển thị các thông tin tóm tắt.
- **Sidebar (có thể ẩn/hiện):**
  - Bộ lọc thẻ: Lọc theo người được gán, mức độ ưu tiên, ngày tạo yêu cầu.
  - Hiển thị thành viên trong team kho.

#### 3. Thành phần giao diện (UI Components)

- `Kanban Board container`: Vùng chứa toàn bộ bảng.
- `Column`: Các cột trạng thái.
- `Draggable Card`: Các thẻ công việc có thể kéo thả. Trên thẻ hiển thị:
  - Mã yêu cầu (VD: RF-0123).
  - Tên vật tư chính và số lượng.
  - Bộ phận yêu cầu.
  - Avatar của người được gán.
  - Tags/Labels cho mức độ ưu tiên (VD: Khẩn cấp, Cao, Thường).
- `Tabs`: Để chuyển đổi giữa các bảng Kanban.
- `Avatar / Avatar Group`: Hiển thị người được gán.
- `Modal`: Hiển thị khi click vào một thẻ để xem toàn bộ chi tiết của yêu cầu, thêm bình luận, đính kèm file.

#### 4. Trải nghiệm người dùng (UX Considerations)

- **Tương tác mượt mà:** Hiệu ứng kéo-thả phải nhanh, mượt và có chỉ báo trực quan rõ ràng (vùng có thể thả vào được highlight).
- **Cập nhật thời gian thực:** Nếu người dùng A di chuyển một thẻ, người dùng B đang xem cùng bảng đó cũng phải thấy sự thay đổi ngay lập tức (sử dụng WebSockets).
- **Thông tin rõ ràng:** Thông tin trên thẻ phải đủ để nhận biết công việc nhưng không quá dày đặc. Sử dụng icon và màu sắc để truyền tải thông tin nhanh hơn.
- **Tùy biến:** Cho phép quản lý tạo hoặc tùy chỉnh các cột trong bảng Kanban để phù hợp với quy trình thực tế của họ.

#### 5. Luồng dữ liệu và trạng thái (Data & States)

- **Dữ liệu đầu vào:** Danh sách các yêu cầu vật tư và trạng thái của chúng.
- **Dữ liệu đầu ra:** Cập nhật trạng thái của yêu cầu khi thẻ được di chuyển.
- **Các trạng thái chính:** Loading, Empty (chưa có yêu cầu nào), Error, Success. Trạng thái Empty của một cột cũng cần được thể hiện rõ ràng.
- **API Endpoint:**
  - `GET /api/v1/kanban/boards/{board_name}`: Lấy toàn bộ cấu trúc cột và thẻ của một bảng cụ thể (VD: `fabric-to-cutting`).
  - `PATCH /api/v1/kanban/cards/{card_id}`: Cập nhật thông tin của một thẻ (di chuyển cột, gán người, thay đổi ưu tiên).
  - **Body:** `{"column_id": "done", "assignee_id": 5}`.
  - **WebSocket:** Kênh `kanban-board:{board_name}` để lắng nghe các sự kiện thay đổi và cập nhật giao diện.

#### 6. Thông tin phụ trợ

- **Tên màn hình:** `SCR-03_KanbanBoard`
- **Liên kết với màn hình khác:**
  - Click vào chi tiết thẻ có thể liên kết đến `Form Yêu cầu Vật tư` gốc.
- **Role/Permission:**
  - `Nhân viên kho`: Kéo thả các thẻ được gán cho mình hoặc trong các cột được phép.
  - `Quản lý kho / Tổ trưởng`: Kéo thả tất cả các thẻ, gán công việc, cấu hình bảng.
  - `Bộ phận sản xuất`: Chỉ được xem (read-only) để theo dõi tiến độ.
- **Quy tắc nghiệp vụ:** Một thẻ không thể bị kéo ngược từ cột "Đã giao" về các cột trước đó, trừ khi có quyền của quản lý. Khi một thẻ được kéo vào cột "Đang chuẩn bị", hệ thống có thể tự động giữ (reserve) số lượng vật tư tương ứng trong kho.

---

Chắc chắn rồi! Dưới đây là phân tích chi tiết cho 2 màn hình thuộc nhóm **2. Receipt - Nhập kho**, tuân thủ theo cấu trúc 6 yêu cầu bạn đã đề ra.

---

### Màn hình 4: Form Nhập Kho (Import Packing List Form)

#### 1. Mục tiêu và chức năng chính

- **Mục tiêu:** Là điểm khởi đầu của quy trình nhập kho. Màn hình này cho phép người dùng nhập dữ liệu từ một Packing List (dù là file mềm hay chứng từ giấy) vào hệ thống một cách chính xác và hiệu quả, tạo ra một "phiếu nhập kho điện tử" (Inbound Shipment Record).
- **Use Case:**
  - "Là một nhân viên kho, tôi nhận được file Excel Packing List từ nhà cung cấp qua email. Tôi muốn tải file này lên hệ thống để tạo phiếu nhập kho nhanh chóng thay vì gõ tay từng dòng."
  - "Là một nhân viên chứng từ, tôi có một bản cứng Packing List. Tôi cần nhập tay thông tin chung và chi tiết các mặt hàng vào hệ thống để ghi nhận lô hàng sắp về."
- **Hành động của người dùng:** Điền thông tin vào form, tải lên file, thêm/xóa các dòng chi tiết hàng hóa, lưu nháp, hoặc hoàn tất để tạo phiếu nhập.
- **Luồng dữ liệu:**
  - **Nhận dữ liệu từ:**
    1.  Người dùng nhập trực tiếp vào các trường (input fields).
    2.  File (Excel, CSV) do người dùng tải lên.
    3.  Dữ liệu gợi ý từ hệ thống (VD: danh sách nhà cung cấp, danh sách mã vật tư).
  - **Gửi dữ liệu đi:** Gửi một đối tượng JSON chứa toàn bộ thông tin của phiếu nhập kho (thông tin chung + danh sách chi tiết hàng hóa) đến server để lưu vào cơ sở dữ liệu.

#### 2. Bố cục và cấu trúc (Layout Structure)

- **Header / Navbar:**
  - Tiêu đề màn hình: "Tạo Phiếu Nhập Kho Mới".
  - Breadcrumb: `Trang chủ / Nhập kho / Tạo phiếu mới`.
  - Nút "Hủy bỏ".
- **Main Content Area:**
  - **Khu vực 1: Thông tin chung (Shipment Header)**
    - Các trường để nhập: Nhà cung cấp (autocomplete), Số PO, Số Packing List, Ngày dự kiến đi (ETD), Ngày dự kiến đến (ETA), Ghi chú.
  - **Khu vực 2: Chi tiết hàng hóa (Shipment Lines)**
    - **Tabs lựa chọn phương thức nhập:**
      1.  **Tab 1: Nhập liệu thủ công:** Hiển thị một bảng (table) trống với các cột: Mã VT (SKU), Tên vật tư, Số lượng, Đơn vị tính, Số Lô/Batch (nếu có). Có nút "+ Thêm dòng" để thêm hàng hóa.
      2.  **Tab 2: Tải lên từ file:** Hiển thị một vùng kéo-thả file (drag-and-drop zone), nút "Chọn file", và một link quan trọng: "**Tải về file mẫu**" để người dùng biết đúng định dạng cần tải lên.
  - **Khu vực 3: Thanh hành động (Action Bar)** - Thường nằm ở cuối trang hoặc dính (sticky) ở cuối màn hình.
    - Nút "Lưu nháp".
    - Nút "Hoàn tất & Tạo phiếu".
- **Footer:** Thông tin bản quyền.

#### 3. Thành phần giao diện (UI Components)

- `Input Field`: Cho các trường text như Số PO, Số Packing List.
- `Autocomplete / Typeahead`: Cho trường "Nhà cung cấp", "Mã VT" để gợi ý và giảm sai sót.
- `Date Picker`: Cho ETD, ETA.
- `Textarea`: Cho trường "Ghi chú".
- `Tabs`: Để chuyển đổi giữa "Nhập tay" và "Tải file".
- `File Uploader / Dropzone`: Cho chức năng tải file.
- `Editable Data Table`: Bảng cho phép thêm/sửa/xóa dòng trực tiếp.
- `Button`: Các nút hành động (Lưu, Hoàn tất, Hủy, Thêm dòng).
- `Tooltip`: Hướng dẫn định dạng cho các trường phức tạp.

#### 4. Trải nghiệm người dùng (UX Considerations)

- **Hiệu quả:** Chức năng tải file là tối quan trọng để tiết kiệm thời gian cho người dùng với các lô hàng lớn. File mẫu phải rõ ràng, dễ hiểu.
- **Chống lỗi:**
  - Validate dữ liệu ngay khi người dùng nhập (inline validation). VD: báo lỗi nếu nhập chữ vào ô số lượng.
  - Khi nhập mã VT, hệ thống tự động điền "Tên vật tư" và "Đơn vị tính" tương ứng.
  - Sau khi tải file lên, hệ thống cần validate file và hiển thị một bản xem trước (preview) các dữ liệu hợp lệ và danh sách các lỗi (VD: "Dòng 5: Mã VT 'ABC' không tồn tại").
- **Linh hoạt:** Chức năng "Lưu nháp" cho phép người dùng lưu lại công việc dở dang và quay lại sau.
- **Responsive:** Form cần co dãn hợp lý trên các kích thước màn hình khác nhau.

#### 5. Luồng dữ liệu và trạng thái (Data & States)

- **Dữ liệu đầu vào:** Thông tin người dùng nhập hoặc dữ liệu từ file.
- **Dữ liệu đầu ra:** ID của phiếu nhập kho vừa được tạo thành công.
- **Các trạng thái chính:**
  - **Pristine / Default:** Form trống, sẵn sàng để nhập liệu.
  - **Validating:** Khi người dùng tải file lên, hiển thị trạng thái "Đang kiểm tra dữ liệu...".
  - **Submitting:** Khi người dùng nhấn "Hoàn tất", các nút bị vô hiệu hóa và hiển thị loading spinner để tránh double-click.
  - **Success:** Hiển thị thông báo thành công ("Đã tạo phiếu nhập kho PL-123 thành công!") và tự động chuyển hướng đến màn hình chi tiết lô hàng (Màn hình 5).
  - **Error (Validation):** Hiển thị thông báo lỗi cụ thể bên dưới các trường không hợp lệ.
  - **Error (API):** Hiển thị một thông báo lỗi chung ở đầu form ("Có lỗi xảy ra, không thể tạo phiếu. Vui lòng thử lại.").
- **API Endpoint:**
  - `POST /api/v1/shipments`: Tạo một phiếu nhập kho mới.
  - **Request Body (JSON):**
    ```json
    {
      "supplier_id": 1,
      "po_number": "PO-001",
      "packing_list_no": "PL-123",
      "etd": "2023-10-27",
      "eta": "2023-11-15",
      "items": [
        { "sku": "FAB-001", "quantity": 1000, "uom": "M" },
        { "sku": "ACC-002", "quantity": 5000, "uom": "PCS" }
      ]
    }
    ```

#### 6. Thông tin phụ trợ

- **Tên màn hình:** `SCR-04_ImportPackingListForm`
- **Liên kết với màn hình khác:**
  - Được truy cập từ nút "+ Nhập Packing List" trên `SCR-01_InboundDashboard`.
  - Sau khi tạo thành công, tự động chuyển đến `SCR-05_ShipmentDetailAndPrint`.
- **Role/Permission:** `Nhân viên kho`, `Nhân viên chứng từ`, `Quản lý kho`.
- **Quy tắc nghiệp vụ:** Số Packing List phải là duy nhất cho mỗi nhà cung cấp. Tất cả Mã VT (SKU) phải tồn tại trong danh mục vật tư của hệ thống.

---

### Màn hình 5: Chi tiết Lô hàng & In Tem QR (Shipment Detail & QR Printing)

#### 1. Mục tiêu và chức năng chính

- **Mục tiêu:** Cung cấp một trang xác nhận thông tin chi tiết về lô hàng vừa tạo hoặc một lô hàng cũ. Quan trọng hơn, đây là nơi thực hiện hành động nghiệp vụ tiếp theo: in tem nhãn và mã QR cho từng đơn vị hàng hóa để chuẩn bị cho việc xếp vào kho.
- **Use Case:**
  - "Sau khi tạo xong phiếu nhập, tôi cần vào màn hình này để kiểm tra lại lần cuối và bấm nút in tất cả tem cho lô hàng này."
  - "Một tem bị rách, tôi cần tìm lại lô hàng này, chọn đúng mặt hàng đó và chỉ in lại 1 tem duy nhất."
- **Hành động của người dùng:** Xem lại thông tin, chọn một/nhiều/tất cả các mặt hàng, và nhấn nút để in tem QR.
- **Luồng dữ liệu:**
  - **Nhận dữ liệu từ:** Lấy thông tin chi tiết của một lô hàng cụ thể từ server dựa vào ID của lô hàng (thường lấy từ URL).
  - **Gửi dữ liệu đi:** Gửi yêu cầu in (danh sách ID các mặt hàng cần in, số lượng tem) đến server. Server sẽ xử lý và trả về một file PDF để in hoặc gửi lệnh trực tiếp đến máy in (tùy kiến trúc).

#### 2. Bố cục và cấu trúc (Layout Structure)

- **Header / Navbar:**
  - Tiêu đề màn hình: "Chi tiết Lô hàng: [PL-123]". Tên động theo mã Packing List.
  - Breadcrumb: `Trang chủ / Nhập kho / Chi tiết [PL-123]`.
  - Nút hành động cấp cao: "Sửa" (nếu được phép), "Xóa", "Quay lại danh sách".
- **Main Content Area:**
  - **Khu vực 1: Thông tin tóm tắt (Summary View)**
    - Hiển thị các thông tin chung của lô hàng dưới dạng read-only: Số PL, Số PO, Nhà cung cấp, ETD, ETA, Trạng thái hiện tại (VD: Mới tạo, Đã nhập kho một phần...).
  - **Khu vực 2: Bảng chi tiết hàng hóa và hành động in**
    - **Thanh công cụ của bảng:**
      - Nút "In tem đã chọn".
      - Nút "In tất cả".
      - Dropdown/Select để chọn mẫu tem (VD: Tem vải, Tem phụ liệu, khổ A4, khổ cuộn...).
    - **Bảng dữ liệu (Data Table):**
      - Cột đầu tiên là `Checkbox` để chọn dòng.
      - Các cột thông tin: Mã VT, Tên vật tư, Số lượng, ĐVT.
      - Cột trạng thái: "Trạng thái in tem" (Chưa in, Đã in).
      - Cột hành động trên từng dòng: Nút "In" riêng cho chỉ dòng đó.
- **Footer:** Thông tin bản quyền.

#### 3. Thành phần giao diện (UI Components)

- `Description List` hoặc `Card`: Để hiển thị thông tin tóm tắt.
- `Data Table` với `Checkboxes`.
- `Button` với Icon: Nút "In tem" (icon máy in).
- `Tag / Badge`: Để hiển thị trạng thái "Đã in" / "Chưa in" một cách trực quan.
- `Dropdown`: Chọn mẫu tem.
- `Modal`: Có thể dùng để hiển thị bản xem trước (print preview) trước khi in.
- `Spinner / Loading Indicator`: Hiển thị khi hệ thống đang tạo file PDF để in.

#### 4. Trải nghiệm người dùng (UX Considerations)

- **Rõ ràng:** Hệ thống phải chỉ rõ mặt hàng nào đã được in tem để tránh in trùng lặp không cần thiết.
- **Linh hoạt:** Cung cấp đầy đủ các tùy chọn in: in tất cả, in đã chọn, in riêng lẻ.
- **Phản hồi tức thì:** Khi nhấn nút "In", phải có phản hồi ngay lập tức (VD: "Đang chuẩn bị file in...") và sau đó tự động mở cửa sổ in của trình duyệt hoặc tải file về.
- **Tối ưu luồng làm việc:** Màn hình này là bước tự nhiên ngay sau khi tạo phiếu nhập, giúp luồng công việc liền mạch.

#### 5. Luồng dữ liệu và trạng thái (Data & States)

- **Dữ liệu đầu vào:** ID của lô hàng (ví dụ: `/shipments/123`).
- **Dữ liệu đầu ra:** File PDF hoặc lệnh in.
- **Các trạng thái chính:**
  - **Loading:** Khi trang đang tải dữ liệu của lô hàng. Hiển thị skeleton UI.
  - **Not Found:** Khi ID lô hàng không tồn tại. Hiển thị thông báo "Không tìm thấy lô hàng".
  - **Success (Idle):** Hiển thị đầy đủ thông tin chi tiết.
  - **Processing Print:** Khi người dùng nhấn nút "In". Nút bấm sẽ có trạng thái loading và bị vô hiệu hóa tạm thời.
  - **Error:** Khi không thể tải được thông tin lô hàng hoặc có lỗi khi tạo file in.
- **API Endpoint:**
  - `GET /api/v1/shipments/{id}`: Lấy thông tin chi tiết của một lô hàng.
  - `POST /api/v1/labels/generate-pdf`: Gửi yêu cầu tạo file PDF để in.
  - **Request Body (JSON):**
    ```json
    {
      "shipment_id": 123,
      "item_ids": [101, 102], // Danh sách ID của các dòng hàng hóa cần in
      "template_id": "large_label"
    }
    ```

#### 6. Thông tin phụ trợ

- **Tên màn hình:** `SCR-05_ShipmentDetailAndPrint`
- **Liên kết với màn hình khác:**
  - Là đích đến sau khi tạo thành công từ `SCR-04_ImportPackingListForm`.
  - Có thể được truy cập bằng cách click vào một dòng trên `SCR-01_InboundDashboard`.
- **Role/Permission:** `Nhân viên kho`, `Quản lý kho`. Chỉ `Quản lý kho` mới có thể "Sửa" hoặc "Xóa" lô hàng.
- **Quy tắc nghiệp vụ:** Sau khi một tem được in thành công, hệ thống phải cập nhật trạng thái "Đã in" cho mặt hàng tương ứng để theo dõi. Không cho phép sửa thông tin lô hàng sau khi đã bắt đầu nhập hàng vào vị trí trong kho.

---

Ok, chúng ta sẽ tiếp tục với phân tích chi tiết cho 2 màn hình thuộc nhóm **3. Inventory Tracking - Theo dõi tồn kho**. Nhóm này tập trung vào việc quản lý "chỗ ở" của hàng hóa và sử dụng công nghệ để theo dõi chúng.

---

### Màn hình 6: Quản lý Vị trí Kho (Location Management)

#### 1. Mục tiêu và chức năng chính

- **Mục tiêu:** Cung cấp cho quản lý kho một công cụ trực quan để thiết lập, quản lý và xem xét sơ đồ logic của toàn bộ kho hàng. Màn hình này là nền tảng để hệ thống biết "ở đâu" có thể chứa hàng và quản lý sức chứa của từng vị trí.
- **Use Case:**
  - "Là một quản lý kho, chúng tôi mới mở rộng thêm một dãy kệ mới. Tôi cần vào đây để tạo thêm Dãy 'F' và các ô kệ con bên trong nó vào hệ thống."
  - "Một kệ hàng bị hỏng và cần sửa chữa, tôi cần tạm thời vô hiệu hóa (disable) vị trí đó để nhân viên không xếp hàng vào."
  - "Tôi muốn xem nhanh tất cả các vị trí trong 'Khu A' đang còn trống để lên kế hoạch nhận lô hàng mới."
- **Hành động của người dùng:** Xem cấu trúc kho dạng cây, tạo mới (Thêm khu, dãy, kệ, ô), chỉnh sửa (Đổi tên, thay đổi thuộc tính như sức chứa, loại hàng cho phép), vô hiệu hóa/kích hoạt lại vị trí, và xóa vị trí (chỉ khi vị trí đó trống).
- **Luồng dữ liệu:**
  - **Nhận dữ liệu từ:** Lấy toàn bộ cấu trúc vị trí kho từ cơ sở dữ liệu.
  - **Gửi dữ liệu đi:** Gửi các lệnh tạo, sửa, xóa (CRUD - Create, Read, Update, Delete) thông tin vị trí đến server.

#### 2. Bố cục và cấu trúc (Layout Structure)

- **Header / Navbar:**
  - Tiêu đề màn hình: "Quản lý Vị trí Kho".
  - Breadcrumb: `Trang chủ / Cấu hình / Quản lý Vị trí Kho`.
  - Nút hành động chính: "+ Thêm Vị trí Mới" (mở modal/form).
- **Main Content Area (chia làm 2 phần):**
  - **Panel bên trái (Tree View):**
    - Hiển thị toàn bộ cấu trúc kho dưới dạng cây thư mục có thể mở rộng/thu gọn (collapsible tree).
    - Ví dụ:
      - `KHO VẢI (FBWH)`
        - `KHU A`
          - `DÃY 01`
            - `KỆ 01-A` (Tầng 1)
            - `KỆ 01-B` (Tầng 2)
    - Khi người dùng click vào một node trên cây, thông tin chi tiết sẽ hiển thị ở panel bên phải.
  - **Panel bên phải (Detail View):**
    - Hiển thị thông tin chi tiết của vị trí được chọn bên trái.
    - Khi chưa chọn vị trí nào, có thể hiển thị thông tin tóm tắt toàn kho (tổng số vị trí, % đã lấp đầy).
    - Khi chọn một vị trí, hiển thị các trường:
      - Mã vị trí (VD: FBWH-A-01-A)
      - Tên vị trí (có thể chỉnh sửa)
      - Loại vị trí (Khu, Dãy, Kệ, Ô)
      - Trạng thái (Đang hoạt động / Tạm khóa)
      - Sức chứa tối đa (nếu có)
      - % đã sử dụng
      - Danh sách các mặt hàng đang được lưu tại vị trí đó (dạng bảng tóm tắt).
    - Các nút hành động cho vị trí đang chọn: "Sửa", "Vô hiệu hóa", "Xóa".
- **Footer:** Thông tin bản quyền.

#### 3. Thành phần giao diện (UI Components)

- `Tree`: Thành phần chính để hiển thị cấu trúc kho.
- `Card` hoặc `Description List`: Để hiển thị thông tin chi tiết ở panel bên phải.
- `Button` với Icon: Cho các hành động thêm, sửa, xóa.
- `Modal / Dialog`: Dùng để hiển thị form khi "Thêm" hoặc "Sửa" một vị trí. Form này sẽ có các trường như: Tên vị trí, Vị trí cha, Sức chứa...
- `Toggle Switch`: Để thay đổi trạng thái "Hoạt động" / "Tạm khóa".
- `Progress Bar`: Để hiển thị % đã sử dụng của một vị trí.
- `Context Menu` (menu chuột phải): Người dùng có thể chuột phải vào một node trên cây để thực hiện nhanh các hành động (Thêm vị trí con, Sửa, Xóa).

#### 4. Trải nghiệm người dùng (UX Considerations)

- **Trực quan:** Cấu trúc cây là cách tốt nhất để hình dung mối quan hệ cha-con của các vị trí.
- **Thao tác nhanh:** Thay vì phải vào trang sửa, nhiều thông tin có thể được chỉnh sửa tại chỗ (inline editing). Menu chuột phải giúp giảm số lần click.
- **An toàn:** Hành động "Xóa" cần có một bước xác nhận (confirmation dialog) để tránh xóa nhầm. Hệ thống không cho phép xóa một vị trí nếu nó vẫn còn chứa hàng.
- **Phản hồi:** Sau mỗi hành động (tạo, sửa, xóa), cây cấu trúc phải tự động cập nhật và có thông báo thành công cho người dùng.

#### 5. Luồng dữ liệu và trạng thái (Data & States)

- **Dữ liệu đầu vào:** Toàn bộ cây cấu trúc vị trí kho.
- **Dữ liệu đầu ra:** Các lệnh thay đổi cấu trúc kho.
- **Các trạng thái chính:**
  - **Loading:** Khi tải cây cấu trúc lần đầu. Hiển thị skeleton UI cho cả 2 panel.
  - **Empty:** Khi hệ thống chưa có vị trí nào được thiết lập. Hiển thị thông báo hướng dẫn "Chưa có vị trí nào. Hãy bắt đầu bằng việc tạo một kho mới" và nút "+ Thêm Vị trí Mới".
  - **Success (Idle):** Cây cấu trúc và thông tin chi tiết được hiển thị đầy đủ.
  - **Error:** Khi không thể tải được cây cấu trúc.
- **API Endpoint:**
  - `GET /api/v1/locations/tree`: Lấy toàn bộ cấu trúc vị trí kho dưới dạng cây.
  - `POST /api/v1/locations`: Tạo một vị trí mới.
    - **Body:** `{"name": "KỆ 01-C", "parent_id": 12, "type": "shelf", "capacity": 100}`
  - `PUT /api/v1/locations/{id}`: Cập nhật thông tin một vị trí.
  - `DELETE /api/v1/locations/{id}`: Xóa một vị trí.

#### 6. Thông tin phụ trợ

- **Tên màn hình:** `SCR-06_LocationManagement`
- **Liên kết với màn hình khác:**
  - Dữ liệu từ màn hình này (danh sách vị trí) sẽ được sử dụng trong nhiều màn hình khác như `Inventory List`, `QR Scan Interface`...
- **Role/Permission:** Chỉ `Quản lý kho` và `Admin` mới có quyền truy cập và chỉnh sửa trên màn hình này.
- **Quy tắc nghiệp vụ:** Mã vị trí có thể được hệ thống tự động sinh ra dựa trên vị trí cha để đảm bảo tính nhất quán (VD: Cha là `FBWH-A-01`, con sẽ có mã bắt đầu bằng `FBWH-A-01-...`).

---

### Màn hình 7: Giao diện Quét Mã QR (QR Scan Interface)

#### 1. Mục tiêu và chức năng chính

- **Mục tiêu:** Cung cấp cho nhân viên kho một công cụ di động, nhanh gọn để tương tác với hàng hóa vật lý thông qua mã QR. Màn hình này tối ưu cho các thiết bị cầm tay (handheld scanner, smartphone) và tập trung vào các nghiệp vụ cốt lõi tại hiện trường: nhập hàng vào kệ, chuyển kho, kiểm tra thông tin.
- **Use Case:**
  - "Tôi vừa nhận một thùng hàng phụ liệu đã dán tem QR. Tôi cần quét mã QR trên thùng hàng, sau đó quét mã QR trên ô kệ trống để hệ thống ghi nhận thùng hàng đó đã được đặt vào vị trí." (Nghiệp vụ **Cất hàng - Put Away**).
  - "Tôi cần chuyển một cây vải từ kệ này sang kệ khác. Tôi quét mã cây vải, chọn hành động 'Chuyển vị trí', rồi quét mã QR của vị trí mới." (Nghiệp vụ **Chuyển kho - Transfer**).
  - "Tôi thấy một thùng hàng bị rách. Tôi cần quét mã QR để xem nhanh đây là hàng gì, của lô nào để báo cáo." (Nghiệp vụ **Kiểm tra - Check Info**).
- **Hành động của người dùng:** Quét mã QR, chọn hành động từ một danh sách rút gọn, và quét mã QR tiếp theo (nếu cần).
- **Luồng dữ liệu:**
  - **Nhận dữ liệu từ:** Camera của thiết bị (để đọc mã QR).
  - **Gửi dữ liệu đi:** Gửi mã QR đã quét và hành động được chọn đến server để xử lý nghiệp vụ tương ứng (cập nhật vị trí tồn kho, ghi nhận lịch sử giao dịch...).

#### 2. Bố cục và cấu trúc (Layout Structure)

- **Thiết kế Mobile-First:** Giao diện phải cực kỳ đơn giản và dễ sử dụng bằng một tay.
- **Header / Navbar:**
  - Tiêu đề đơn giản: "Quét Mã QR".
  - Có thể có icon thể hiện trạng thái kết nối mạng.
- **Main Content Area (Giao diện theo từng bước - Wizard-like Interface):**
  - **Bước 1: Giao diện Quét chính**
    - Một vùng camera view lớn chiếm phần lớn màn hình.
    - Một dòng chữ hướng dẫn rõ ràng: "**Vui lòng quét mã QR trên sản phẩm/thùng hàng**".
    - Có thể có nút để bật/tắt đèn flash.
  - **Bước 2: Giao diện sau khi quét thành công**
    - Camera view ẩn đi hoặc thu nhỏ lại.
    - Hiển thị thông tin tóm tắt của đối tượng vừa quét (Tên VT, Mã VT, Số lượng, Vị trí hiện tại).
    - Hiển thị một danh sách các **Nút hành động** lớn, rõ ràng:
      1.  `Cất Hàng (Put Away)`
      2.  `Chuyển Vị Trí (Transfer)`
      3.  `Kiểm Tra Tồn (Stock Count)`
      4.  `Thêm vào Phiếu xuất`
      5.  `Xem Chi Tiết`
      6.  `Quét mã khác` (để hủy thao tác hiện tại).
  - **Bước 3: Giao diện thực hiện hành động**
    - Nếu người dùng chọn "Cất hàng" hoặc "Chuyển vị trí", màn hình sẽ quay lại giao diện quét với hướng dẫn mới: "**Vui lòng quét mã QR của vị trí đích**".
- **Footer:** Có thể không có hoặc chỉ hiển thị thông tin người dùng đang đăng nhập.

#### 3. Thành phần giao diện (UI Components)

- `Camera View`: Tích hợp thư viện quét mã QR (VD: ZXing, QuaggaJS).
- `Large Buttons`: Các nút hành động phải to, dễ bấm.
- `Toast / Snackbar`: Dùng để hiển thị các thông báo nhanh (VD: "Quét thành công!", "Mã QR không hợp lệ", "Đã cập nhật vị trí thành công").
- `Simple Card`: Để hiển thị thông tin tóm tắt sau khi quét.
- `Loading Overlay`: Hiển thị khi đang gửi yêu cầu lên server.

#### 4. Trải nghiệm người dùng (UX Considerations)

- **Tốc độ:** Tốc độ nhận diện mã QR và phản hồi của hệ thống là yếu tố quyết định. Phải tối ưu để giảm độ trễ xuống mức tối thiểu.
- **Đơn giản:** Giao diện không được có các yếu tố thừa. Mỗi màn hình chỉ tập trung vào một nhiệm vụ duy nhất (quét hoặc chọn hành động).
- **Phản hồi vật lý:** Sử dụng âm thanh "bíp" và rung (vibration) sau mỗi lần quét thành công để người dùng biết thao tác đã được ghi nhận mà không cần nhìn vào màn hình.
- **Xử lý ngoại lệ:** Phải xử lý tốt các trường hợp: mã QR mờ, không hợp lệ, không có trong hệ thống, quét nhầm mã vị trí thay vì mã sản phẩm... và đưa ra thông báo lỗi rõ ràng.
- **Offline Mode:** Cân nhắc khả năng hoạt động offline. Thiết bị có thể lưu lại các giao dịch quét và đồng bộ lên server khi có kết nối mạng trở lại.

#### 5. Luồng dữ liệu và trạng thái (Data & States)

- **Dữ liệu đầu vào:** Chuỗi ký tự từ mã QR.
- **Dữ liệu đầu ra:** Yêu cầu nghiệp vụ (VD: chuyển vị trí của item A đến location B).
- **Các trạng thái chính (State Machine):**
  - `IDLE`: Chờ quét mã sản phẩm.
  - `PRODUCT_SCANNED`: Đã quét xong sản phẩm, chờ người dùng chọn hành động.
  - `WAITING_FOR_LOCATION`: Đã chọn hành động (Put Away/Transfer), chờ quét mã vị trí.
  - `PROCESSING`: Đang gửi yêu cầu lên server.
  - `SUCCESS`: Giao dịch thành công, quay về trạng thái `IDLE`.
  - `ERROR`: Có lỗi xảy ra, hiển thị thông báo và cho phép thử lại.
- **API Endpoint:**
  - `GET /api/v1/qr/{qr_code}`: Lấy thông tin của một đối tượng (sản phẩm/vị trí) từ mã QR của nó.
  - `POST /api/v1/inventory/put-away`: Thực hiện nghiệp vụ cất hàng.
    - **Body:** `{"item_qr": "...", "location_qr": "..."}`
  - `POST /api/v1/inventory/transfer`: Thực hiện nghiệp vụ chuyển kho.
    - **Body:** `{"item_qr": "...", "destination_location_qr": "..."}`

#### 6. Thông tin phụ trợ

- **Tên màn hình:** `SCR-07_QRScanInterface`
- **Liên kết với màn hình khác:** Đây là một màn hình chuyên dụng, thường không điều hướng sang các màn hình desktop khác, nhưng có thể mở một web view đơn giản để xem chi tiết thông tin sản phẩm.
- **Role/Permission:** Chỉ `Nhân viên kho` mới có quyền sử dụng chức năng này. Các hành động họ có thể thực hiện có thể được giới hạn bởi quyền.
- **Quy tắc nghiệp vụ:** Hệ thống phải kiểm tra logic nghiệp vụ trước khi thực hiện. Ví dụ: không cho phép cất một pallet vải vào một ô kệ chỉ dành cho phụ liệu; không cho phép chuyển hàng vào một vị trí đã bị khóa.

---

Chắc chắn rồi! Nhóm này tập trung vào việc tạo các phiếu xuất kho cho các mục đích khác nhau. Mặc dù đều là "xuất kho", nhưng mỗi loại vật tư (vải, phụ liệu, đóng gói) thường có quy trình và các trường thông tin đặc thù, do đó việc tách thành các màn hình riêng biệt là hợp lý.

Dưới đây là phân tích chi tiết cho 4 màn hình thuộc nhóm **4. Delivery transaction - Giao dịch xuất kho**.

---

### Màn hình 8: Form Xuất Vải (Issue Fabric Form)

#### 1. Mục tiêu và chức năng chính

- **Mục tiêu:** Cung cấp một giao diện chuyên biệt cho bộ phận cắt (Cutting office) hoặc bộ phận kế hoạch tạo yêu cầu xuất vải từ kho. Màn hình này cần xử lý các đặc thù của việc quản lý vải như: xuất theo cây vải (roll), số mét, và ghi nhận thông tin khổ vải, màu sắc.
- **Use Case:**
  - "Là một nhân viên phòng cắt, tôi cần tạo một phiếu yêu cầu xuất 5 cây vải thuộc mã 'FVN-102-BLUE', khổ 1.5m cho đơn hàng sản xuất 'PO-456'."
  - "Là nhân viên kho, tôi nhận được yêu cầu xuất vải. Tôi cần tìm đúng các cây vải được yêu cầu, ghi nhận số mét thực tế xuất ra từ mỗi cây và hoàn tất phiếu."
- **Hành động của người dùng:** Chọn mã hàng sản xuất (Style/PO), chọn mã vải, chọn cụ thể cây vải nào cần xuất, nhập số lượng (mét) cần xuất, lưu và gửi yêu cầu.
- **Luồng dữ liệu:**
  - **Nhận dữ liệu từ:**
    1.  Danh mục vật tư (chỉ lọc ra vải).
    2.  Dữ liệu tồn kho chi tiết đến từng cây vải (inventory by roll/batch).
    3.  Danh sách đơn hàng sản xuất (để liên kết yêu cầu).
  - **Gửi dữ liệu đi:** Gửi thông tin của phiếu yêu cầu xuất kho đến server. Phiếu này sau đó sẽ xuất hiện trên `Kanban Board` (Màn hình 3) để kho xử lý.

#### 2. Bố cục và cấu trúc (Layout Structure)

- **Header / Navbar:**
  - Tiêu đề màn hình: "Tạo Phiếu Xuất Vải".
  - Breadcrumb: `Trang chủ / Xuất kho / Yêu cầu xuất vải`.
- **Main Content Area:**
  - **Khu vực 1: Thông tin chung (Header Info)**
    - Người yêu cầu (tự động điền theo user đăng nhập).
    - Bộ phận yêu cầu (VD: Phòng Cắt).
    - Tham chiếu đến Lệnh Sản Xuất / Mã hàng.
    - Ngày cần hàng (Required Date).
    - Ghi chú chung.
  - **Khu vực 2: Chi tiết vật tư yêu cầu (Item Details)**
    - Một bảng (table) hoặc danh sách động cho phép thêm nhiều loại vải.
    - **Mỗi dòng yêu cầu sẽ có:**
      1.  Nút "+ Thêm Vải".
      2.  **Dòng 1: Chọn mã vải (SKU):**
          - Một trường `Autocomplete` để tìm kiếm mã vải.
          - Khi chọn xong, hệ thống tự động hiển thị: Tên vải, màu sắc, khổ vải, đơn vị tính (mét), và số lượng tồn kho khả dụng.
      3.  **Dòng 2: Chọn cây vải cụ thể (Roll Selection):**
          - Sau khi chọn mã vải, một nút "Chọn cây vải" sẽ hiện ra.
          - Click vào nút này sẽ mở ra một `Modal` hiển thị danh sách các cây vải của mã đó đang có trong kho, cùng với thông tin: Mã cây vải, Vị trí, Số mét còn lại.
          - Người dùng tick chọn các cây vải muốn xuất và nhập số mét cần lấy từ mỗi cây.
  - **Khu vực 3: Thanh hành động (Action Bar)**
    - Nút "Gửi Yêu cầu".
    - Nút "Lưu nháp".

#### 3. Thành phần giao diện (UI Components)

- `Autocomplete`: Tìm kiếm mã hàng, mã vải.
- `Date Picker`: Chọn ngày cần hàng.
- `Modal`: Hiển thị danh sách cây vải để lựa chọn.
- `Data Table` (trong Modal): Liệt kê các cây vải.
- `Input Number`: Nhập số mét cần xuất.
- `Button`: Gửi yêu cầu, lưu nháp.
- `Read-only fields`: Hiển thị thông tin tự động điền (tên vải, tồn kho...).

#### 4. Trải nghiệm người dùng (UX Considerations)

- **Luồng làm việc hợp lý:** Việc chọn mã vải trước, sau đó mới chọn cây vải cụ thể giúp người dùng không bị quá tải thông tin.
- **Cung cấp thông tin ngữ cảnh:** Hiển thị ngay lập tức số lượng tồn kho khả dụng của mã vải và số mét còn lại của từng cây vải giúp người yêu cầu ra quyết định chính xác.
- **Chống lỗi:** Không cho phép yêu cầu xuất nhiều hơn số mét còn lại trong một cây vải. Hệ thống cảnh báo nếu tổng số lượng yêu cầu vượt quá tồn kho khả dụng.
- **Tự động hóa:** Tự điền các thông tin liên quan (tên, đơn vị tính) để giảm thiểu việc nhập liệu.

#### 5. Luồng dữ liệu và trạng thái (Data & States)

- **Dữ liệu đầu vào:** Dữ liệu tồn kho vải theo từng cây.
- **Dữ liệu đầu ra:** Một phiếu yêu cầu xuất kho vải.
- **Trạng thái:** Tương tự các form khác (Idle, Submitting, Success, Error). Trạng thái Success sẽ hiển thị thông báo "Đã gửi yêu cầu [mã yêu cầu] thành công!" và có thể điều hướng người dùng đến màn hình Kanban để xem yêu cầu của mình.
- **API Endpoint:**
  - `GET /api/v1/inventory/fabric-rolls?sku=...`: Lấy danh sách cây vải tồn kho theo mã vải.
  - `POST /api/v1/issues/fabric`: Tạo một phiếu yêu cầu xuất vải mới.
  - **Body:** `{"production_order_id": 1, "required_date": "...", "items": [{"sku": "FAB-001", "details": [{"roll_id": 101, "quantity": 150}, {"roll_id": 102, "quantity": 80}]}]}`

#### 6. Thông tin phụ trợ

- **Tên màn hình:** `SCR-08_IssueFabricForm`
- **Liên kết với màn hình khác:**
  - Sau khi tạo, yêu cầu sẽ xuất hiện dưới dạng một `Card` trên `SCR-03_KanbanBoard`.
- **Role/Permission:** `Nhân viên Kế hoạch`, `Nhân viên phòng Cắt` (tạo yêu cầu). `Nhân viên kho` (xem và xử lý yêu cầu).
- **Quy tắc nghiệp vụ:** Hệ thống có thể đề xuất các cây vải nên xuất dựa trên quy tắc FIFO/FEFO (Nhập trước/Hết hạn trước xuất trước).

---

### Màn hình 9 & 10: Form Xuất Phụ liệu / Form Xuất Thẻ bài & Đóng gói

_Do hai màn hình này có chức năng và cấu trúc rất tương đồng (cùng là xuất các mặt hàng có thể đếm được theo đơn vị cái, bộ, chiếc), chúng ta sẽ phân tích gộp và chỉ ra các điểm khác biệt._

#### 1. Mục tiêu và chức năng chính

- **Mục tiêu:**
  - **Form Xuất Phụ liệu (Accessories):** Cho phép chuyền may (sewing lines) hoặc bộ phận chuẩn bị sản xuất yêu cầu các loại phụ liệu như nút, chỉ, khóa kéo, nhãn...
  - **Form Xuất Thẻ bài & Đóng gói (Tags & Packaging):** Cho phép bộ phận hoàn thiện/đóng gói yêu cầu các vật tư như thẻ bài (hangtag), túi poly, thùng carton...
- **Use Case:**
  - "Tổ trưởng chuyền A cần 5,000 nút mã 'BTN-02' và 20 cuộn chỉ 'THR-05-BLK' cho mã hàng XYZ."
  - "Nhân viên đóng gói cần 1,200 thẻ bài và 1,200 túi poly cho đơn hàng 'PO-456'."
- **Hành động của người dùng:** Chọn mã hàng/lệnh sản xuất, tìm và thêm các mã vật tư cần thiết vào danh sách, nhập số lượng, và gửi yêu cầu.
- **Luồng dữ liệu:**
  - **Nhận dữ liệu từ:** Danh mục vật tư (phụ liệu/đóng gói), dữ liệu tồn kho, danh sách lệnh sản xuất.
  - **Gửi dữ liệu đi:** Tạo một phiếu yêu cầu xuất kho tương ứng.

#### 2. Bố cục và cấu trúc (Layout Structure)

- **Layout chung rất giống với Form Xuất Vải, nhưng đơn giản hơn ở phần chi tiết vật tư.**
- **Header / Navbar:**
  - Tiêu đề: "Tạo Phiếu Xuất Phụ liệu" / "Tạo Phiếu Xuất Đóng gói".
- **Main Content Area:**
  - **Khu vực 1: Thông tin chung:** Tương tự Form Xuất Vải (Người yêu cầu, Bộ phận, Lệnh sản xuất, Ngày cần...).
  - **Khu vực 2: Chi tiết vật tư yêu cầu:**
    - Một bảng (table) cho phép thêm nhiều dòng.
    - **Điểm khác biệt chính so với Form Vải:** Không cần chọn theo lô/cây cụ thể.
    - Quy trình thêm một dòng:
      1.  Click nút "+ Thêm vật tư".
      2.  Người dùng tìm mã vật tư (SKU) bằng `Autocomplete`.
      3.  Hệ thống tự điền: Tên vật tư, Đơn vị tính, hiển thị Số lượng tồn kho.
      4.  Người dùng nhập **Số lượng** cần xuất.
      5.  Hệ thống có thể hiển thị vị trí lưu kho gợi ý.
- **Khu vực 3: Thanh hành động:** "Gửi Yêu cầu", "Lưu nháp".

#### 3. Thành phần giao diện (UI Components)

- Các thành phần tương tự Form Xuất Vải: `Autocomplete`, `Date Picker`, `Data Table` (dạng editable), `Input Number`, `Button`.
- Không cần `Modal` để chọn lô/cây như form vải, giúp giao diện gọn gàng hơn.

#### 4. Trải nghiệm người dùng (UX Considerations)

- **Tốc độ và sự đơn giản:** Vì số lượng mã phụ liệu có thể rất nhiều trong một yêu cầu, thao tác tìm kiếm và thêm mới phải cực kỳ nhanh.
- **BOM Tự động:** Một cải tiến UX quan trọng là: sau khi người dùng chọn Lệnh Sản Xuất, hệ thống có thể **tự động đề xuất danh sách các phụ liệu/vật tư đóng gói** theo Định mức Nguyên vật liệu (BOM - Bill of Materials) của sản phẩm đó. Người dùng chỉ cần kiểm tra và chỉnh sửa số lượng.
- **Cảnh báo tồn kho:** Cảnh báo ngay lập tức nếu số lượng yêu cầu vượt quá tồn kho khả dụng.

#### 5. Luồng dữ liệu và trạng thái (Data & States)

- **API Endpoint:**
  - `POST /api/v1/issues/accessory`
  - `POST /api/v1/issues/packaging`
  - **Body (cấu trúc tương tự nhau):**
    ```json
    {
      "production_order_id": 1,
      "requestor_id": 10,
      "items": [
        { "sku": "BTN-02", "quantity": 5000 },
        { "sku": "THR-05-BLK", "quantity": 20 }
      ]
    }
    ```

#### 6. Thông tin phụ trợ

- **Tên màn hình:**
  - `SCR-09_IssueAccessoryForm`
  - `SCR-10_IssuePackagingForm`
- **Liên kết với màn hình khác:** Yêu cầu được tạo ra cũng sẽ hiển thị trên `SCR-03_KanbanBoard` tương ứng.
- **Role/Permission:** `Tổ trưởng chuyền`, `Nhân viên chuẩn bị sản xuất`, `Nhân viên đóng gói`.
- **Quy tắc nghiệp vụ:** Khi kho xuất hàng, hệ thống sẽ tự động trừ tồn kho theo quy tắc FIFO.

---

### Màn hình 11: Báo cáo Giao dịch Xuất Kho (Issue Transaction Reports)

#### 1. Mục tiêu và chức năng chính

- **Mục tiêu:** Cung cấp một giao diện tổng hợp để tra cứu, xem lại lịch sử và in các báo cáo liên quan đến tất cả các giao dịch xuất kho đã thực hiện. Màn hình này phục vụ cho mục đích quản lý, đối soát và phân tích.
- **Use Case:**
  - "Là quản lý kho, tôi muốn xem tất cả các phiếu xuất vải trong tháng này để kiểm tra xem có phiếu nào bất thường không."
  - "Kế toán cần in chi tiết một phiếu xuất phụ liệu số 'IA-555' để làm chứng từ."
  - "Tôi muốn xem chi tiết lịch sử xuất kho của mã hàng 'PO-456', bao gồm cả vải, phụ liệu, đóng gói."
- **Hành động của người dùng:** Lọc, tìm kiếm, xem danh sách, xem chi tiết một giao dịch, và xuất báo cáo (in/export ra Excel).
- **Luồng dữ liệu:**
  - **Nhận dữ liệu từ:** Lấy danh sách tất cả các phiếu xuất kho đã được ghi nhận trong hệ thống.
  - **Gửi dữ liệu đi:** Yêu cầu xuất file báo cáo.

#### 2. Bố cục và cấu trúc (Layout Structure)

- **Layout rất giống với Màn hình 2 - Quản lý tồn kho, tập trung vào việc hiển thị dữ liệu dạng bảng.**
- **Header / Navbar:**
  - Tiêu đề: "Báo cáo Xuất Kho".
  - Breadcrumb: `Trang chủ / Báo cáo / Báo cáo Xuất Kho`.
- **Main Content Area:**
  - **Khu vực bộ lọc (Filter Area):** Nằm phía trên bảng dữ liệu.
    - Lọc theo Loại phiếu: (Tất cả, Xuất vải, Xuất phụ liệu, Xuất đóng gói).
    - Lọc theo Ngày xuất: Chọn khoảng ngày.
    - Lọc theo Lệnh sản xuất / Mã hàng.
    - Lọc theo Trạng thái: (Mới yêu cầu, Đang xử lý, Đã hoàn tất, Đã hủy).
  - **Bảng dữ liệu (Data Table):**
    - Hiển thị danh sách các phiếu xuất kho.
    - Các cột: Mã phiếu, Loại phiếu, Ngày tạo, Người yêu cầu, Lệnh SX, Trạng thái.
    - Mỗi dòng có một nút "Xem chi tiết".
  - **Nút hành động chung:** "Xuất Excel".
- **Footer:** Thông tin bản quyền.

#### 3. Thành phần giao diện (UI Components)

- `Data Table` với pagination và sorting.
- `Date Range Picker`, `Dropdown`, `Input Field` cho bộ lọc.
- `Tag / Badge` cho cột trạng thái.
- `Button` (Xem chi tiết, Xuất Excel).
- `Modal` hoặc **trang riêng**: Để hiển thị chi tiết một phiếu xuất khi người dùng click vào "Xem chi tiết". Trang chi tiết này sẽ liệt kê tất cả các mặt hàng đã được xuất trong phiếu đó, số lượng, người xuất, ngày xuất... và có nút "In Phiếu".

#### 4. Trải nghiệm người dùng (UX Considerations)

- **Khả năng truy vấn mạnh mẽ:** Bộ lọc phải linh hoạt, cho phép người dùng kết hợp nhiều điều kiện để tìm chính xác thông tin họ cần.
- **Dễ dàng truy xuất:** Từ danh sách tổng quan, người dùng phải dễ dàng đi đến được màn hình chi tiết chỉ bằng một cú click.
- **Định dạng báo cáo rõ ràng:** File Excel xuất ra hoặc trang in phải có định dạng chuyên nghiệp, đầy đủ thông tin cần thiết (header, footer, thông tin công ty, chữ ký...).

#### 5. Luồng dữ liệu và trạng thái (Data & States)

- **API Endpoint:**
  - `GET /api/v1/issues`: Lấy danh sách các phiếu xuất kho.
  - **Params:** `?type=fabric&status=completed&date_from=...&date_to=...`
  - `GET /api/v1/issues/{id}`: Lấy thông tin chi tiết của một phiếu.

#### 6. Thông tin phụ trợ

- **Tên màn hình:** `SCR-11_IssueTransactionReports`
- **Liên kết với màn hình khác:**
  - Click "Xem chi tiết" sẽ mở ra một trang chi tiết (`SCR-11_Detail`) của phiếu xuất đó.
- **Role/Permission:** `Quản lý kho`, `Kế toán kho`, `Quản lý sản xuất`, `Admin` đều có quyền xem báo cáo.
- **Quy tắc nghiệp vụ:** Báo cáo cần phân biệt rõ giữa "Số lượng yêu cầu" và "Số lượng thực xuất" vì có thể có chênh lệch. Dữ liệu trong báo cáo này là "chốt sổ", không thể thay đổi sau khi phiếu đã ở trạng thái "Hoàn tất".
