# Thiệp mời tốt nghiệp — bản điều chỉnh

## Chạy thử
Mở index.html hoặc đưa toàn bộ các file trong thư mục này lên GitHub Pages. Có 3 màn hình: nhập tên → thiệp mời và RSVP → cảm ơn và lời chúc. Ảnh mở đầu là ảnh khách cung cấp. Tên đặc biệt khớp theo họ tên đầy đủ, không phân biệt dấu, chữ hoa và khoảng trắng.

## Lưu RSVP và lời chúc tập trung (bắt buộc cấu hình trước khi gửi khách)
1. Tạo một Google Sheet riêng. Mở Extensions → Apps Script.
2. Dán nội dung google-apps-script/Code.gs, lưu lại.
3. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone. Cấp quyền khi Google yêu cầu.
4. Copy URL kết thúc bằng /exec vào appsScriptUrl trong config.js.
5. Nếu cập nhật script của bản cũ: Deploy → Manage deployments → Edit → New version → Deploy.
6. Test trên GitHub Pages: nhập tên, chọn YES/NO, kiểm tra dòng xuất hiện trong tab RSVP; nhập lời chúc và gửi, kiểm tra lời chúc được cập nhật trên cùng dòng.
7. Trong Google Sheet: File → Download → Microsoft Excel (.xlsx) để tải file Excel gồm thời gian, tên, YES/NO, lời chúc và mã phản hồi.

Website tự gửi RSVP ngay khi chọn YES/NO, nên vẫn lưu câu trả lời nếu khách không gửi lời chúc. Lời chúc gửi sau cập nhật cùng mã phản hồi. Tải lại trang trên cùng thiết bị giữ mã; thiết bị khác có thể tạo dòng riêng. Không nhận diện người dùng bằng tên vì nhiều người có thể trùng tên. Chỉ báo đã lưu sau khi server xác nhận. Khi chưa có URL, chỉ lưu thử trên trình duyệt, KHÔNG thu thập tập trung.

## Nhạc
Feedback yêu cầu “You’re on Your Own, Kid — Taylor Swift”. Chưa có file audio trong tài liệu. Thêm file âm thanh được phép sử dụng tại assets/youre-on-your-own-kid.mp3 và đặt musicUrl: 'assets/youre-on-your-own-kid.mp3' trong config.js. Đã bỏ hoàn toàn tiếng chuông nền. Cấu hình trỏ tới assets/youre-on-your-own-kid.mp3; cần bổ sung file MP3 thực tế, nếu thiếu file thì nút hiện Music unavailable. Nhạc bắt đầu sau tương tác đầu tiên và chạy xuyên suốt ba màn hình; nút Music cho phép tắt/mở. Trình duyệt chặn tự phát âm thanh trước tương tác.

## Cá nhân hóa
- Nguyễn Khắc Nam Thi → The bestie of my life → friend-5.png
- Lê Minh Thư → My Day – one bestie → chưa có ảnh trong Word, đang dùng khung kỷ niệm. Thêm ảnh vào assets và điền tên file vào phần friends của app.js.
- Lê Hoàng Yến Nhi → The lifelong bestie → friend-6.png
- Nguyễn Minh Hằng → My baby kuu → friend-7.png
- Trần Ngọc Anh Thư → The lốp of my life → friend-8.png
- Châu Thụy Cát Tường → Best mama of ages → friend-9.jpeg

Tên đặc biệt nằm trên note của thiệp, tên khách nhập nằm ngay dưới; ảnh kỷ niệm hiện ở màn hình kết thúc theo mô tả mới nhất. Ngày giờ và địa điểm giữ theo thiệp gốc, không lặp lại ở phần thư. Các ảnh giữ nguyên từ file khách cung cấp. Link Canva tham khảo trong Word: https://canva.link/17h44bd676bsxbz . Bản này dùng thiệp có sẵn trong source, chưa lấy được sáu thiệp riêng từ Canva.

## Cập nhật mới
Màn hình 2 dùng invitation-screen-2.png. Chữ tên hiển thị không dấu, dữ liệu nhập gốc vẫn được lưu. Khách thường có subtitle đúng chuỗi yêu cầu: Espcecially for you. Sáu người đặc biệt nhận subtitle riêng (không dấu). Note giữ nguyên hình trong ảnh, chỉ chồng chữ lên vùng trống.

## Nhạc đã được bổ sung
File MP3 khách cung cấp đã được gắn tại assets/youre-on-your-own-kid.mp3. Không cần thêm link nhạc online. Nhạc bắt đầu sau tương tác đầu tiên, lặp lại xuyên suốt ba màn hình; nút Music tắt/mở mà không chạy lại từ đầu.

## Bản mới nhất
Thiệp màn hình 2 dùng template mới, tên khách không dấu nằm giữa ảnh theo mẫu; subtitle cá nhân hóa nằm phía trên tên. Ảnh Yến Nhi đã thay bằng ảnh mới khách gửi. Nhạc mặc định bật và thử phát khi tải trang; nếu trình duyệt chặn, tự thử lại khi chạm hoặc gõ phím. Tắt nhạc sẽ giữ trạng thái tắt khi chuyển màn hình.
