
### **Tổng quan giải pháp**

Giải pháp sẽ tập trung vào việc số hóa và tối ưu hóa hai luồng công việc chính của kho: **Nhập kho (Storing)** và **Xuất kho (Issuing)**. Mục tiêu là giảm thiểu thao tác thủ công, tăng cường độ chính xác thông qua việc sử dụng QR code, và cung cấp dữ liệu tồn kho real-time, tích hợp với hệ thống T-PRO tổng thể.

---

### **Phân tích Quy trình 1: Nhập kho Nguyên vật liệu/Phụ liệu/Đóng gói (Storing)**

Quy trình này tập trung vào việc nhận hàng từ nhà cung cấp, ghi nhận thông tin, dán nhãn QR code và lưu trữ vào đúng vị trí trong kho.

#### **A. Các Chức năng Cần thiết (Required Functions)**

Dựa trên sơ đồ và mô tả, chúng ta cần xây dựng các chức năng sau:

1.  **Dashboard Nhập kho (Inbound Dashboard):**
    *   **Mục đích:** Là màn hình trung tâm cho nhân viên văn phòng kho.
    *   **Chi tiết:** Hiển thị danh sách các Đơn đặt hàng (PO) dự kiến sẽ về kho. Thông tin này được lấy từ hệ thống ERP (trong tương lai) hoặc được import thủ công (giai đoạn đầu).
    *   **Tính năng:**
        *   Liệt kê các PO với các thông tin cơ bản: Mã PO, Nhà cung cấp, Ngày dự kiến nhận, Trạng thái (Chờ nhận, Đã nhận một phần, Đã nhận đủ).
        *   Cho phép tìm kiếm, lọc PO.
        *   Cung cấp lối vào để xem chi tiết từng PO.

2.  **Quản lý Packing List & In QR Code:**
    *   **Mục đích:** Ghi nhận thông tin chi tiết của lô hàng và tạo mã định danh duy nhất (QR code) cho từng đơn vị sản phẩm (cuộn vải, thùng phụ liệu).
    *   **Chi tiết:**
        *   **Giai đoạn đầu:** Chức năng cho phép nhân viên **import file Excel Packing List** từ nhà cung cấp theo một template có sẵn. Hệ thống sẽ tự động đọc và map dữ liệu vào PO tương ứng.
        *   **Giai đoạn sau (tích hợp API):** Chức năng này sẽ được tự động hóa, dữ liệu Packing List sẽ được đẩy từ ERP qua API.
        *   Sau khi có thông tin chi tiết (số cuộn vải, số lượng phụ liệu), hệ thống cho phép người dùng **chọn PO và in QR code** hàng loạt cho tất cả các mặt hàng trong lô. Mỗi QR code là duy nhất và chứa thông tin như: Mã PO, Mã sản phẩm, số thứ tự (vd: cuộn 1/100),...

3.  **Quản lý Vị trí Kho (Location Management):**
    *   **Mục đích:** Xây dựng cơ sở dữ liệu (master data) về sơ đồ kho.
    *   **Chi tiết:** Đây là chức năng nền tảng, cho phép người quản lý kho định nghĩa cấu trúc của kho: Khu vực (Zone), Kệ (Shelves), Pallet.
    *   **Tính năng:**
        *   Tạo/Sửa/Xóa các vị trí trong kho.
        *   In QR code cho từng vị trí (kệ, pallet) để phục vụ cho việc quét sau này.

4.  **Ghi nhận Nhập kho bằng Quét QR (QR Scan for Receiving):**
    *   **Mục đích:** Chức năng cốt lõi cho nhân viên kho (worker) thực hiện thao tác tại hiện trường, đảm bảo dữ liệu chính xác và tức thời. Chức năng này nên được phát triển trên **thiết bị di động hoặc máy quét cầm tay (handheld scanner)**.
    *   **Chi tiết:** Quy trình quét được tối ưu hóa:
        1.  Nhân viên quét QR code của **vị trí** (kệ/pallet) để xác định nơi sẽ cất hàng.
        2.  Nhân viên quét QR code của **sản phẩm** (cuộn vải/thùng phụ liệu đã được dán nhãn ở bước 2).
        3.  Hệ thống tự động ghi nhận: sản phẩm A đã được lưu tại vị trí B vào thời điểm C.
    *   Quy trình này xử lý cả 2 luồng "Manual WH" và "Auto WH" (ví dụ kho Kardex). Với "Auto WH", hệ thống có thể cần tích hợp thêm để gửi lệnh cất hàng tới hệ thống kho tự động.

5.  **Báo cáo & Truy vấn Tồn kho (Inventory Tracking & Reports):**
    *   **Mục đích:** Cung cấp cái nhìn tổng quan và chi tiết về tình hình tồn kho.
    *   **Chi tiết:**
        *   Hiển thị thông tin tồn kho theo thời gian thực.
        *   Cho phép truy vấn lịch sử nhập/xuất/tồn của một mặt hàng cụ thể.
        *   Cung cấp các báo cáo chi tiết về tồn kho theo từng loại: Báo cáo kho Vải (Fabric WH), kho Phụ liệu (Accessory WH), kho Đóng gói (Packing WH), kết hợp thông tin giao dịch và vị trí lưu trữ.

#### **B. Số lượng Màn hình Tối thiểu để Triển khai**

Để đáp ứng các chức năng trên, chúng ta cần tối thiểu **5 màn hình** chính:

1.  **Màn hình Dashboard Nhập kho:** Dành cho nhân viên văn phòng. Hiển thị danh sách PO và là điểm khởi đầu cho các tác vụ.
2.  **Màn hình Chi tiết PO / Packing List:** Truy cập từ Dashboard. Hiển thị chi tiết các mặt hàng trong PO, chứa chức năng import Excel và nút "In QR Code".
3.  **Màn hình Quản lý Vị trí kho (Master Data):** Dành cho cấp quản lý để thiết lập và in QR code cho các vị trí trong kho.
4.  **Màn hình Giao diện Quét QR (Trên thiết bị di động/Handheld):** Giao diện đơn giản hóa cho nhân viên kho, chỉ tập trung vào các thao tác quét (quét vị trí, quét hàng hóa).
5.  **Màn hình Báo cáo Tồn kho:** Giao diện mạnh mẽ với các bộ lọc (theo mã hàng, vị trí, PO, ngày tháng...) để xem và xuất dữ liệu tồn kho.

---

### **Phân tích Quy trình 2: Xuất kho Vải/Phụ liệu/Đóng gói (Issuing)**

Quy trình này xử lý việc soạn và cấp phát nguyên vật liệu cho các bộ phận sản xuất (Cắt, May, Trang trí) dựa trên các yêu cầu (Kanban).

#### **A. Các Chức năng Cần thiết (Required Functions)**

1.  **Bảng Kanban Kỹ thuật số (Digital Kanban Board):**
    *   **Mục đích:** Trung tâm tiếp nhận và quản lý các yêu cầu xuất kho từ sản xuất.
    *   **Chi tiết:** Thay thế bảng Kanban vật lý. Hiển thị các "thẻ" yêu cầu từ các bộ phận:
        *   Yêu cầu Vải từ bộ phận Cắt.
        *   Yêu cầu Phụ liệu, Đóng gói từ chuyền May.
        *   Yêu cầu Phụ liệu từ bộ phận Trang trí.
    *   **Tính năng:**
        *   Phân loại Kanban theo kho phụ trách (Kho Vải, Kho Phụ liệu...).
        *   Hiển thị trạng thái của Kanban (Mới, Đang xử lý, Hoàn thành).
        *   Cho phép nhân viên kho "nhận" một Kanban để bắt đầu xử lý.

2.  **Xử lý Yêu cầu Xuất kho (Issue Request Fulfillment):**
    *   **Mục đích:** Hướng dẫn nhân viên kho soạn đúng và đủ số lượng hàng hóa theo yêu cầu.
    *   **Chi tiết:** Khi nhân viên kho chọn một Kanban, hệ thống sẽ hiển thị một "phiếu soạn hàng" (picking list) điện tử.
    *   **Tính năng (có sự khác biệt giữa các kho):**
        *   **Đối với Kho Vải:**
            *   Hiển thị thông tin về tình trạng QC, trạng thái "relax" (nghỉ) của vải.
            *   Hệ thống có thể gợi ý các cuộn vải phù hợp để xuất dựa trên yêu cầu (ví dụ: ưu tiên xuất các cuộn lẻ, cuộn về trước).
            *   Cho phép **nhập Job List** để tự động tải các yêu cầu vải cho một mã hàng.
            *   Cho phép nhân viên **cấu hình và trừ số mét (yards)** chính xác được cắt ra từ một cuộn vải.
        *   **Đối với Kho Phụ liệu/Đóng gói:**
            *   Quy trình đơn giản hơn, nhân viên chọn và nhập số lượng vật tư cần xuất dựa trên thông tin tồn kho và vị trí được hệ thống gợi ý.

3.  **Ghi nhận Xuất kho bằng Quét QR (QR Scan for Issuing):**
    *   **Mục đích:** Ghi nhận chính xác hàng hóa đã được xuất ra khỏi kho, cập nhật tồn kho ngay lập tức. Chức năng này cũng được thực hiện trên **thiết bị di động/máy quét cầm tay**.
    *   **Chi tiết:**
        1.  Nhân viên chọn Kanban/Phiếu yêu cầu trên thiết bị.
        2.  Quét QR code của từng mặt hàng (cuộn vải, thùng phụ liệu) khi lấy ra khỏi kệ.
        3.  Nhập số lượng xuất (đối với phụ liệu) hoặc số mét (đối với vải).
        4.  Hệ thống xác nhận thao tác, tự động trừ tồn kho và cập nhật trạng thái Kanban.

4.  **Báo cáo Xuất kho (Issuing Reports):**
    *   **Mục đích:** Theo dõi và phân tích hoạt động xuất kho.
    *   **Chi tiết:** Các báo cáo này có thể được tích hợp vào chức năng báo cáo tồn kho chung.
    *   **Tính năng:**
        *   Báo cáo xuất vải hàng ngày (Daily fabrics issue report).
        *   Báo cáo xuất phụ liệu/đóng gói hàng ngày.
        *   Lịch sử xuất kho chi tiết cho từng Kanban/Job.

#### **B. Số lượng Màn hình Tối thiểu để Triển khai**

Để đáp ứng các chức năng này, chúng ta cần tối thiểu **3 màn hình mới** và có thể **tái sử dụng 2 màn hình** từ quy trình Nhập kho:

1.  **Màn hình Bảng Kanban:** Giao diện trực quan hiển thị các yêu cầu đang chờ xử lý, dành cho tất cả nhân viên kho.
2.  **Màn hình Chi tiết Yêu cầu Xuất kho (Picking List):** Truy cập từ Kanban. Đây là màn hình làm việc chính của nhân viên kho, liệt kê các mặt hàng cần lấy, vị trí, và các trường nhập liệu số lượng/số mét.
3.  **Màn hình Giao diện Quét QR (Trên thiết bị di động/Handheld):** **(Tái sử dụng)**. Màn hình này có thể được thiết kế theo dạng module, có chế độ "Nhập kho" và "Xuất kho" để nhân viên lựa chọn.
4.  **Màn hình Báo cáo Tồn kho & Giao dịch:** **(Tái sử dụng)**. Màn hình báo cáo chung sẽ được bổ sung thêm các bộ lọc và dạng xem để hiển thị dữ liệu xuất kho.

### **Tổng kết và Đề xuất**

*   **Tổng số chức năng chính cần phát triển:** Khoảng 9 chức năng (5 cho Nhập kho, 4 cho Xuất kho).
*   **Tổng số màn hình tối thiểu cần xây dựng:** **6 màn hình**.
    1.  Dashboard Nhập kho (PO List)
    2.  Chi tiết PO / Packing List (để in QR)
    3.  Quản lý Vị trí kho (Master Data)
    4.  Bảng Kanban Xuất kho
    5.  Chi tiết Yêu cầu Xuất kho (Picking List)
    6.  Báo cáo Tổng hợp (Nhập - Xuất - Tồn)
*   **Ứng dụng Di động (cho máy quét):** Cần một ứng dụng di động với giao diện quét QR, có thể chuyển đổi giữa các chế độ (Nhập kho, Xuất kho, Kiểm kê...).

Giải pháp này đảm bảo tính toàn vẹn của dữ liệu, giảm sai sót, tăng tốc độ vận hành và cung cấp nền tảng vững chắc để tích hợp sâu hơn với các module khác của T-PRO và hệ thống ERP trong tương lai.

---

### **Phân Tích Lỗ Hổng Theo Quy Trình**

#### **I. Quy trình 1: Nhập kho (Storing)**

Quy trình này hiện đang bị **đứt gãy ở bước quan trọng nhất**: liên kết giữa việc tạo Packing List, in tem QR, và hành động quét QR để cất hàng.

**1. Chức năng: Dashboard Nhập kho (`inbound-dashboard`)**
*   **Hiện tại có:** Một dashboard rất tốt để theo dõi các lô hàng *đang trên đường vận chuyển* (shipping, delayed, arriving_soon).
*   **Còn thiếu/Cần cải thiện:**
    *   **Sai mục đích nghiệp vụ:** Dashboard này đang phục vụ việc theo dõi logistics hơn là nghiệp vụ kho. Nhân viên kho cần một danh sách các lô hàng/PO **đã về đến cổng** và **"Chờ nhập kho" (Pending Receipt)**. Trạng thái nên là: `Chờ nhận`, `Đã nhận một phần`, `Đã nhận đủ`.
    *   Thiếu liên kết trực tiếp từ một lô hàng trên dashboard đến hành động "Xác nhận nhận hàng" hoặc "Bắt đầu quy trình nhập kho".

**2. Chức năng: Quản lý Packing List & In QR Code (`import-packing-list` & `shipment-detail`)**
*   **Hiện tại có:** Giao diện tạo/nhập thông tin Packing List và màn hình chi tiết để xem lại các mặt hàng. Chức năng "In tem" đã có trên giao diện.
*   **Lỗ hổng nghiệp vụ CỰC LỚN:**
    *   **Phân rã số lượng thành các đơn vị có mã QR duy nhất:** Đây là điểm thiếu sót nghiêm trọng nhất.
        *   **Ví dụ:** Packing List ghi "1500 mét Vải Cotton". Khi in tem, hệ thống phải biết 1500m này được chia thành **10 cuộn vải** (mỗi cuộn có số mét khác nhau) và phải sinh ra **10 mã QR code duy nhất** cho 10 cuộn đó.
        *   Tương tự, "10,000 cái nút" phải được chia thành **2 thùng**, và hệ thống phải sinh ra **2 mã QR code** cho 2 thùng này.
    *   **Giải pháp đề xuất:** Màn hình `shipment-detail` (Chi tiết lô hàng) cần thêm một bước gọi là **"Phân rã Lô hàng" (Breakdown Shipment)** trước khi in tem. Tại bước này, người dùng sẽ nhập chi tiết số lượng cho từng đơn vị (vd: Cuộn 1: 150m, Cuộn 2: 148.5m,...). Sau đó hệ thống mới sinh ra các mã QR tương ứng.

**3. Chức năng: Ghi nhận Nhập kho bằng Quét QR (`qr-scan`)**
*   **Hiện tại có:** Giao diện quét QR với logic "quét vật tư -> chọn hành động -> quét vị trí".
*   **Còn thiếu/Cần cải thiện:**
    *   **Không có sự liên kết dữ liệu:** Dữ liệu QR code trong màn hình này (`MOCK_DB`) là dữ liệu giả, hoàn toàn độc lập với dữ liệu từ màn hình "In tem".
    *   **Luồng đúng phải là:**
        1.  Tại màn hình `shipment-detail`, hệ thống sinh ra mã QR `QR-UNIQUE-ROLL-001` cho cuộn vải đầu tiên của Packing List `PL-123`.
        2.  Nhân viên kho dùng màn hình `qr-scan` quét mã `QR-UNIQUE-ROLL-001`.
        3.  Hệ thống phải nhận diện được đây là cuộn vải thuộc `PL-123`, SKU `FVN-102-BLUE`, số mét `150m`.
        4.  Nhân viên quét vị trí `LOC-A-01-B`.
        5.  Hệ thống cập nhật: `QR-UNIQUE-ROLL-001` đã được cất vào `LOC-A-01-B`, đồng thời cập nhật trạng thái của `PL-123` là "Đã nhận 1 phần".

#### **II. Quy trình 2: Xuất kho (Issuing)**

Quy trình này đã xây dựng được các màn hình tạo yêu cầu và Kanban rất tốt, nhưng thiếu sự liên kết giữa chúng và thiếu các logic nghiệp vụ đặc thù.

**1. Chức năng: Tạo Yêu cầu Xuất kho (`issue-fabric/accessory/packaging-form`)**
*   **Hiện tại có:** 3 màn hình riêng biệt để tạo yêu cầu xuất cho Vải, Phụ liệu, Đóng gói. Các chức năng như chọn cây vải, tự động điền BOM theo PO rất tốt.
*   **Còn thiếu/Cần cải thiện:**
    *   **Logic QC và 'nghỉ' cho vải:** Đây là nghiệp vụ bắt buộc trong ngành may. Hệ thống phải biết cuộn vải nào đã qua QC, cuộn nào đang trong thời gian "nghỉ" (relax) và **không cho phép/cảnh báo** khi người dùng chọn các cuộn chưa đạt chuẩn để xuất kho.
    *   **Tích hợp Job List:** Tài liệu có đề cập "nhập Job List để tự động tải yêu cầu vải", chức năng này chưa có.
    *   **Mối liên hệ với Kanban:** Hiện tại, việc tạo các phiếu yêu cầu này dường như là một hành động độc lập. Luồng đúng phải là: **Tạo một phiếu yêu cầu sẽ sinh ra một thẻ (card) trên Bảng Kanban tương ứng**. Sự liên kết này chưa tồn tại.

**2. Chức năng: Bảng Kanban Kỹ thuật số (`kanban-board`)**
*   **Hiện tại có:** Giao diện Kanban tuyệt vời, hỗ trợ kéo thả.
*   **Còn thiếu/Cần cải thiện:**
    *   **Nguồn dữ liệu:** Như đã nói ở trên, các thẻ Kanban đang dùng dữ liệu giả (`mockBoards`). Chúng cần được tạo ra tự động từ các màn hình "Tạo Phiếu Yêu Cầu".
    *   **Thiếu màn hình "Phiếu Soạn Hàng" (Picking List):** Khi nhân viên kho click vào một thẻ Kanban, hệ thống nên hiển thị một màn hình chi tiết (Picking List) để hướng dẫn họ đi lấy hàng. Màn hình này sẽ liệt kê:
        *   Tên, SKU, số lượng cần lấy.
        *   **Vị trí gợi ý (quan trọng):** Hệ thống phải gợi ý chính xác vị trí đang chứa mặt hàng đó (ví dụ: `A-01-B`).
        *   Đây là điểm trung gian giữa Kanban và hành động quét QR xuất kho.

**3. Chức năng: Ghi nhận Xuất kho bằng Quét QR (`qr-scan`)**
*   **Hiện tại có:** Giao diện quét QR.
*   **Còn thiếu/Cần cải thiện:**
    *   **Hoàn toàn thiếu chế độ "Xuất kho":** Màn hình quét QR hiện chỉ hỗ trợ nghiệp vụ nhập kho (Cất hàng, Chuyển vị trí).
    *   **Luồng đúng phải là:**
        1.  Nhân viên kho chọn một thẻ Kanban trên thiết bị di động.
        2.  Ứng dụng hiển thị Picking List.
        3.  Nhân viên đến vị trí `A-01-B`, quét QR của cuộn vải.
        4.  Ứng dụng xác nhận đúng mặt hàng, nhân viên nhập số mét cắt ra (nếu là vải).
        5.  Hệ thống trừ tồn kho của cuộn vải đó, cập nhật tồn kho tổng, và chuyển trạng thái thẻ Kanban sang "Hoàn thành".

### **Vấn đề Cốt lõi & Tổng thể: Dữ liệu bị Phân mảnh**

Vấn đề lớn nhất của toàn bộ dự án hiện tại là **sự thiếu kết nối về mặt dữ liệu giữa các module**. Mỗi tính năng (Nhập kho, Kanban, Quét QR, Báo cáo) đang hoạt động như một hòn đảo riêng lẻ với bộ dữ liệu giả (`mock data`) của riêng nó.

*   `import-packing-list` tạo ra `ShipmentItem`.
*   `qr-scan` dùng một `MOCK_DB` khác.
*   `inventory-list` dùng `DUMMY_DATA` khác.
*   `kanban-board` dùng `mockBoards` khác.
*   `issue-transaction-reports` dùng `mockTransactions` khác.

**Để hệ thống vận hành được, cần xây dựng một "Single Source of Truth" (Nguồn dữ liệu thật duy nhất) và đảm bảo các luồng sau:**

1.  **Nhập kho:** `Tạo Packing List` -> `Phân rã & Sinh mã QR duy nhất` -> `Quét QR cất hàng` -> `Cập nhật Báo cáo Tồn kho`.
2.  **Xuất kho:** `Tạo Yêu cầu Xuất` -> `Sinh thẻ Kanban` -> `Xem Picking List (kèm vị trí)` -> `Quét QR xuất hàng` -> `Cập nhật Báo cáo Tồn kho` & `Cập nhật Báo cáo Xuất kho`.

### **Tổng kết và Đề xuất Lộ trình**

Hệ thống đã có bộ khung giao diện rất vững chắc. Giờ là lúc tập trung vào việc **kết nối các nghiệp vụ và luồng dữ liệu**.

**Ưu tiên hàng đầu:**

1.  **Thiết kế lại Data Model:** Xây dựng một cấu trúc dữ liệu trung tâm, đặc biệt là bảng `InventoryItems` phải chứa các bản ghi cho **từng mã QR duy nhất**, có trường `location_id`, `quantity`, `status` (QC, relax), etc.
2.  **Hoàn thiện luồng Nhập kho:**
    *   Bổ sung chức năng "Phân rã lô hàng" trong màn hình `shipment-detail`.
    *   Kết nối việc in tem với việc tạo các bản ghi `InventoryItems` mới trong DB.
    *   Kết nối màn hình `qr-scan` để đọc được các mã QR này và cập nhật vị trí cho chúng.
3.  **Hoàn thiện luồng Xuất kho:**
    *   Liên kết form "Tạo yêu cầu xuất" với "Bảng Kanban" để tự động tạo thẻ.
    *   Xây dựng màn hình "Picking List" chi tiết từ Kanban, có gợi ý vị trí.
    *   Phát triển chế độ "Xuất kho" cho màn hình `qr-scan`.
    *   Bổ sung logic nghiệp vụ quan trọng (check QC, relax status) vào module xuất vải.

Sau khi hoàn thành các kết nối này, hệ thống sẽ từ một bộ giao diện demo trở thành một giải pháp phần mềm có thể triển khai và vận hành trong thực tế.
