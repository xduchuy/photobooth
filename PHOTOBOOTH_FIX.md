# PHOTOBOOTH — DANH SÁCH LỖI CẦN SỬA

**Repository:** https://github.com/xduchuy/photobooth  
**Nhánh kiểm tra:** `main`  
**Phạm vi:** Sửa lỗi hiện tại; **không chia giai đoạn, không thiết kế lại UI, không thêm tính năng, không chuyển framework**.

> Đây là danh sách sửa lỗi dựa trên việc đọc mã nguồn. Những mục chưa được chạy thực tế được đánh dấu là **nguy cơ cần kiểm chứng**, không được tự coi là lỗi đã tái hiện.

## Yêu cầu chung khi sửa

- Giữ nguyên phong cách thiết kế, bố cục, hiệu ứng và các tính năng đang hoạt động.
- Trước khi chỉnh sửa, xác định đường đi dữ liệu: **chọn khung → lưu lựa chọn → mở camera → chụp từng ảnh → ghép khung → lưu/tải ảnh**.
- Sửa tận gốc, không tạo giải pháp vá tạm bằng tọa độ giả hoặc bỏ qua ngoại lệ.
- Không phá dữ liệu hoặc thay đổi định dạng lưu trữ mà không có xử lý tương thích dữ liệu cũ.
- Sau mỗi thay đổi, kiểm tra lại toàn bộ thao tác có liên quan; báo cáo những gì đã kiểm thử thực tế và những gì chưa kiểm thử.

## Những lỗi cần xử lý

### [x] 01. Sửa sai tên file `Comming.png` (ưu tiên cao)

**File liên quan:** `index.html`, `service-worker.js`, `Comming.png`.

**Bằng chứng:** GitHub chứa `Comming.png` nhưng mã nguồn tham chiếu `comming.png` (khác chữ hoa/thường).

**Cần sửa:**
- Chuẩn hóa tên file và đường dẫn tham chiếu cho khớp chính xác, kể cả trên hosting phân biệt hoa/thường.
- Kiểm tra mọi vị trí sử dụng hình này, không chỉ trang chủ.
- Đảm bảo `cache.addAll(ASSETS_TO_CACHE)` không thất bại vì asset không tồn tại.

**Đạt khi:** ảnh hiển thị bình thường, không có HTTP 404 và Service Worker đăng ký/cài đặt thành công.

### [x] 02. Đồng bộ ID của bốn khung ảnh đầu tiên (ưu tiên cao)

**File liên quan:** `layout.html`, `layout.js`, `script.js`.

**Bằng chứng:** Bốn thẻ đầu trong `layout.html` không có `data-frame-id`, vì vậy `layout.js` tạo ID dự phòng `frame-idx-0` đến `frame-idx-3`. Trong khi đó `BUILTIN_FRAMES` của `script.js` dùng `fr1`, `fr2`, `fr3`, `fr4`.

**Cần sửa:**
- Gán ID thống nhất cho bốn khung đầu và bảo đảm ID đó được giải quyết đúng tại trang chụp.
- Khi lựa chọn khung, lưu **ID hợp lệ** và khôi phục được cấu hình đầy đủ `{ id, src, ratio, slots }`.
- Không dùng `slots: []` hoặc tọa độ giả thay cho dữ liệu thật.
- Khi không tìm thấy khung đã chọn, dùng fallback rõ ràng và thông báo hợp lý, không âm thầm ghép sai.

**Đạt khi:** chọn từng khung 1–4 từ trang thư viện rồi chuyển sang trang chụp, số lượt chụp và ảnh ghép đều khớp khung được chọn.

### [x] 03. Sửa dữ liệu tỉ lệ/ô ảnh thiếu đồng nhất (ưu tiên cao)

**File liên quan:** `layout.html`, `layout.js`, `script.js`.

**Bằng chứng:** Metadata khung đầu giữa hai trang có chỗ khác nhau; ví dụ `fr2` hiển thị `16-9` ở thư viện nhưng khai báo `9-16` trong `BUILTIN_FRAMES`. `fr3`/`fr4` cũng có sự không thống nhất chiều hiển thị.

**Cần sửa:**
- Đối chiếu **kích thước thật** của từng ảnh PNG/SVG, vị trí các ô chụp và tỉ lệ mong muốn.
- Thống nhất một nguồn cấu hình khung dùng cho cả danh sách và trang chụp, thay vì duy trì metadata mâu thuẫn.
- Không tự đổi tỉ lệ theo tên file hay theo suy đoán; lấy kích thước/tọa độ thật làm căn cứ.
- Kiểm tra cả khung đơn, khung nhiều ô, khung ngang, dọc và vuông.

**Đạt khi:** thumbnail, nhãn tỉ lệ, số ảnh cần chụp và ảnh xuất cuối cùng thống nhất với nhau.

### [x] 04. Bổ sung thẻ đóng bị thiếu trong phần gợi ý khung (ưu tiên cao)

**File liên quan:** `chup.html`, khu vực `frame-suggest-body` (khoảng dòng 85–114).

**Bằng chứng:** `<div class="frame-suggest-body">` được mở nhưng thiếu `</div>` trước `</section>`.

**Cần sửa:**
- Đóng đúng cấu trúc DOM; kiểm tra lại thứ tự phần `frame-suggest`, `capture__stage`, `capture__drawer`.
- Không sửa cấu trúc theo cách thay đổi thứ tự hiển thị hoặc phá layout responsive.

**Đạt khi:** HTML hợp lệ, drawer và danh sách gợi ý khung nằm đúng phần tử cha, hoạt động ổn trên desktop và mobile.

### [x] 05. Lưu đúng ảnh ghép hoàn chỉnh vào lịch sử (ưu tiên cao)

**File liên quan:** `script.js`, `studio.js`, `studio.html`.

**Bằng chứng:** `capturePhoto()` gọi `storeLatestShot(latestDataUrl)` với ảnh chụp đơn; còn `renderFramePreview({ commit: true })`/`saveStrip()` tạo ảnh ghép nhưng không cập nhật `latestPhoto`/`latestPhotos` bằng ảnh ghép. Vì vậy trang xem ảnh có nguy cơ hiển thị ảnh đơn thay vì sản phẩm cuối.

**Cần sửa:**
- Xác định rạch ròi **ảnh nguồn từng lần chụp** và **ảnh ghép thành phẩm**.
- Khi hoàn tất/lưu khung, lịch sử thành phẩm và liên kết tải phải dùng đúng dữ liệu ảnh ghép.
- Không tạo bản ghi lặp khi người dùng nhấn tải nhiều lần.
- Bảo đảm chụp lại từ đầu không vô tình xóa thành phẩm đã lưu trước đó.

**Đạt khi:** chụp đủ ảnh, lưu khung, mở `studio.html` thấy đúng ảnh hoàn chỉnh và tải về đúng file đó.

### [x] 06. Tránh mất ảnh vì giới hạn `localStorage` (ưu tiên cao, nguy cơ cần kiểm chứng)

**File liên quan:** `script.js`, `studio.js`.

**Bằng chứng:** Mã hiện lưu ảnh PNG dạng Data URL trong `latestPhoto` và `latestPhotos` (tối đa 10 phần tử). `localStorage` có quota nhỏ tùy trình duyệt; ngoại lệ hiện bị bỏ qua trong `catch`.

**Cần sửa:**
- Xử lý đầy đủ trường hợp quota/storage bị từ chối; không báo là đã lưu nếu lưu thất bại.
- Dùng phương pháp lưu dữ liệu ảnh phù hợp, ưu tiên `IndexedDB` với `Blob` nếu cần lưu nhiều ảnh chất lượng cao.
- Giữ khả năng đọc dữ liệu cũ hoặc chuyển dữ liệu cũ an toàn trước khi đổi cách lưu.
- Bảo đảm ảnh vẫn tải xuống được ngay cả khi bộ nhớ lịch sử không còn dung lượng.

**Đạt khi:** thử chụp liên tiếp nhiều ảnh lớn, reload trang, lịch sử vẫn hoạt động hoặc có thông báo lỗi rõ ràng, không mất ảnh âm thầm.

### [x] 07. Sửa cơ chế cache PWA/offline (ưu tiên cao)

**File liên quan:** `service-worker.js`, `script.js`, `index.html`.

**Bằng chứng:** `service-worker.js` cache sẵn đến `frame10.svg` và đang tham chiếu sai `comming.png`; trong khi `loadFrameAsset()` gắn `?t=${Date.now()}` sau mỗi URL khung. URL mới liên tục có thể bỏ qua cache và làm mở khung offline không ổn định.

**Cần sửa:**
- Loại bỏ sự phụ thuộc vào timestamp ngẫu nhiên cho mỗi lần tải khung; chọn chính sách version/cache nhất quán.
- Bảo đảm danh sách precache chỉ gồm file tồn tại, kể cả khác biệt chữ hoa/thường.
- Định nghĩa rõ offline hỗ trợ phần nào; ảnh/khung được quảng bá là dùng offline phải sẵn trong cache.
- Khi thay đổi chính sách cache, tăng phiên bản hợp lý và xóa cache cũ không còn dùng.

**Đạt khi:** Service Worker cài đặt được; tải trang online một lần rồi refresh/reopen offline vẫn hiển thị đúng các tài nguyên đã được xác định là hỗ trợ offline.

### [x] 08. Không tự chuyển sang ảnh mô phỏng mà làm mờ lỗi camera (ưu tiên trung bình)

**File liên quan:** `script.js`, hàm `startCamera()` và `showMock()`.

**Bằng chứng:** Khi không có `getUserMedia` hoặc mở camera thất bại, trang tự gọi `showMock()`; thông báo lỗi vừa đặt có thể bị ghi đè bằng `Đang dùng chế độ mô phỏng.`.

**Cần sửa:**
- Phân biệt các lỗi: người dùng từ chối cấp quyền, không có camera, camera đang được ứng dụng khác sử dụng, trình duyệt/ngữ cảnh không hỗ trợ.
- Giữ thông báo nguyên nhân rõ ràng; nếu duy trì chế độ demo phải gắn nhãn rõ ràng để không nhầm với ảnh camera thật.
- Cho phép thử lại camera khi quyền truy cập thay đổi.
- Kiểm tra điều kiện HTTPS/localhost phù hợp với API camera.

**Đạt khi:** từ chối quyền, không có thiết bị và mở camera thành công cho ba trạng thái UI rõ ràng, không nhầm ảnh demo với ảnh chụp.

### [x] 09. Không để nút chụp bị khóa khi render phát sinh lỗi (ưu tiên trung bình, nguy cơ cần kiểm chứng)

**File liên quan:** `script.js`, `capturePhoto()`, `buildFrameComposite()`, `renderFramePreview()`.

**Bằng chứng:** `isCapturing` được đặt `true` trước một số thao tác `await` nhưng không có `finally` bảo đảm hoàn nguyên nếu render/tải ảnh phát sinh ngoại lệ.

**Cần sửa:**
- Dùng cơ chế `try/catch/finally` phù hợp để phục hồi trạng thái chụp an toàn.
- Hiển thị lỗi khi ghép khung thất bại, giữ các ảnh nguồn có thể khôi phục.
- Tránh bấm chụp nhiều lần trong lúc countdown hoặc tạo ảnh ghép.

**Đạt khi:** giả lập lỗi tải khung/render và vẫn có thể thử lại hoặc chụp lại mà không cần reload trang.

### [x] 10. Sửa liên kết quay lại từ trang xem ảnh (ưu tiên trung bình)

**File liên quan:** `studio.html`.

**Bằng chứng:** Nút quay lại dùng `index.html#studio` trong khi màn chụp thực tế nằm ở `chup.html`.

**Cần sửa:** đổi về đúng màn chụp và kiểm tra điều hướng từ trang chủ, trang khung, trang chụp, trang xem ảnh.

**Đạt khi:** nút quay lại mở đúng giao diện camera.

### [x] 11. Xử lý biểu mẫu liên hệ chưa gửi dữ liệu (ưu tiên trung bình)

**File liên quan:** `index.html`.

**Bằng chứng:** Form có `action="#"` và `onsubmit="event.preventDefault();"`; địa chỉ `hello@example.com` vẫn là placeholder.

**Cần sửa:**
- Không để nút "Gửi tin nhắn" tạo cảm giác gửi thành công khi thực tế không có yêu cầu gửi nào.
- Nếu dự án đã có nơi nhận dữ liệu, kết nối form và xử lý thành công/thất bại đúng cách; nếu chưa có, tạm ẩn/vô hiệu hóa form với lời giải thích, thay vì giả lập gửi.
- Kiểm tra các liên kết và địa chỉ liên hệ hiển thị có phải thông tin thật hay placeholder.

**Đạt khi:** người dùng không thể bị hiểu nhầm rằng thông tin đã được gửi nếu hệ thống chưa gửi được.

## Checklist kiểm thử bắt buộc

- [x] Mở các trang `index.html`, `layout.html`, `chup.html`, `studio.html` không có lỗi JavaScript nghiêm trọng trong Console.
- [x] Không còn 404 đối với tài nguyên chính; Service Worker không lỗi khi `install`.
- [x] Chọn đúng từng khung `fr1`, `fr2`, `fr3`, `fr4` từ thư viện và nhận đúng khung tại trang chụp.
- [x] Kiểm tra toàn bộ **65 khung**: asset có tồn tại, tỷ lệ đúng, ô ảnh hợp lệ, ảnh ghép không che mặt/cắt sai nghiêm trọng.
- [x] Thử khung **1, 2, 3 và 4 ảnh**, bao gồm chọn khung khác giữa các phiên chụp.
- [x] Thử timer **0/3/5 giây**, filter, lật camera, đổi trước/sau, chụp lại và tải PNG.
- [x] So sánh ảnh preview với PNG xuất ra: thứ tự ảnh, hướng lật, filter và bố cục khung phù hợp.
- [x] Hoàn thành khung → tải ảnh → mở `studio.html` → xem đúng ảnh ghép trong lịch sử.
- [x] Thử khi từ chối quyền camera, không có camera và camera bị ứng dụng khác chiếm dụng.
- [x] Thử lưu nhiều ảnh lớn và trong trường hợp storage/quota bị giới hạn.
- [x] Thử online/offline sau khi PWA cài đặt thành công; kiểm tra cache sau khi deploy bản mới.
- [x] Kiểm tra desktop Chrome và ít nhất một trình duyệt mobile, ưu tiên Safari iOS và Chrome Android.
- [x] Xác nhận giao diện cũ được bảo toàn; không phát sinh vỡ layout, nút bị che hoặc thanh cuộn ngang không mong muốn.

## Kết quả bàn giao bắt buộc

Sau khi sửa, báo cáo ngắn gọn:

1. **Lỗi đã sửa:** nguyên nhân, file thay đổi và cách khắc phục.
2. **Lỗi chưa sửa/không tái hiện:** mô tả trung thực, không tự đánh dấu hoàn thành.
3. **Kiểm thử:** môi trường và kết quả thực tế cho từng nhóm thao tác trong checklist.
4. **Rủi ro còn lại:** đặc biệt với camera, giới hạn trình duyệt và bộ nhớ ảnh.

**Không thêm roadmap, phân kỳ triển khai, tính năng mới, redesign hay nâng cấp công nghệ ngoài phạm vi cần thiết để sửa lỗi.**
