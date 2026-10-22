# Hanoi Roadster Rocket 3D

Game lái Tesla Roadster (gói SpaceX) qua Hà Nội: 10 km, 15 phút, ngã tư, trạm Supercharger, bay, lộn né, bám tường.

Chạy tại: https://toilalode.github.io/teslaroadstertest/

## Cấu trúc

| Tệp | Vai trò |
| --- | --- |
| `index.html` | Khung trang, nạp Three.js r128 từ cdnjs và các module trong `js/` theo thứ tự |
| `style.css` | Giao diện HUD, popup, nút cảm ứng |
| `js/config.js` | Hằng số tuyến đường, hàm tiện ích, cài đặt mặc định |
| `js/scene.js` | Renderer, cảnh, ánh sáng, hàm dựng khối |
| `js/vehicles.js` | Xe giao thông và mô hình Tesla Roadster SpaceX |
| `js/city.js` | Đường, nhà, ngã tư, trạm sạc, công trường, công ty |
| `js/state.js` | Trạng thái, sinh xe, va chạm, cảnh sát, kỹ năng |
| `js/autopilot.js` | Tự lái (bật/tắt, phím T): giữ làn, né xe, dừng đèn đỏ, tự sạc mỗi 2000 m, tự rẽ vào công ty |
| `js/physics.js` | Vật lý, va chạm, giao thông |
| `js/hud.js` | Camera, HUD, bản đồ nhỏ |
| `js/screens.js` | Menu, Settings, màn kết thúc |
| `js/input.js` | Bàn phím, cảm ứng, chuột |
| `js/main.js` | Vòng lặp chính |
| `sw.js`, `manifest.json`, `icon.svg` | PWA, chạy offline |
| `.github/workflows/pages.yml` | Triển khai GitHub Pages |

## Bật GitHub Pages

Settings > Pages > Build and deployment > Source: **GitHub Actions**, rồi chạy lại workflow.
