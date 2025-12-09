// src/components/GlobalTrafficTracker.tsx

import { useEffect } from 'react';
import { getDetailedUserInfo } from '../services/IPService';
import { registerPresence, goOffline } from '../services/TrafficService';

function GlobalTrafficTracker() {
  useEffect(() => {
    let currentIp: string | null = null;

    const initTracking = async () => {
      try {
        // 1. Lấy thông tin người dùng (Hàm này đã có Cache từ bước sửa trước nên rất nhanh)
        const userInfo = await getDetailedUserInfo();
        currentIp = userInfo.ip;

        // 2. Gửi thông tin lên Firebase ngay lập tức
        console.log("📍 Đang báo danh người dùng:", userInfo.ip);
        await registerPresence(userInfo);
      } catch (error) {
        console.error("Lỗi tracking:", error);
      }
    };

    initTracking();

    // 3. Cleanup: Khi người dùng tắt tab hoặc đóng trình duyệt -> Báo Offline
    return () => {
      if (currentIp) {
        goOffline(currentIp);
      }
    };
  }, []);

  // Component này không có giao diện
  return null;
}

export default GlobalTrafficTracker;