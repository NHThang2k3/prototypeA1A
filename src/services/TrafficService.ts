// src/services/TrafficService.ts
import { ref, set, onValue, onDisconnect, remove, runTransaction } from 'firebase/database';
import { db } from './firebase';
import type { DetailedUserInfo, GeoLocation } from './IPService';

export interface LiveVisitor extends DetailedUserInfo {
  id: string;
  isCurrentUser: boolean;
  status: 'active' | 'idle';
  lastActive: string;
}

const sanitizeIP = (ip: string) => ip.replace(/\./g, '_');

const SAFE_LOCATION: GeoLocation = {
  country: 'Unknown', countryCode: 'UN', region: '', regionName: '',
  city: 'Hidden', zip: '', lat: 0, lon: 0, timezone: '', isp: '', org: '', as: ''
};

/**
 * Tạo hoặc lấy Session ID duy nhất cho phiên làm việc hiện tại của trình duyệt.
 * Giúp phân biệt các thiết bị/tab khác nhau dù có cùng Public IP.
 */
const getSessionId = () => {
  const STORAGE_KEY = 'visitor_session_id';
  let sessionId = sessionStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    // Tạo ID ngẫu nhiên: timestamp + random string
    sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
};

// --- LOGIC MỚI: LIVE USER (FIX LỖI TRÙNG IP) ---
export async function registerPresence(userInfo: DetailedUserInfo) {
  if (!userInfo.ip) return;

  const safeIP = sanitizeIP(userInfo.ip);
  const sessionId = getSessionId();

  // Key kết hợp IP và SessionID để tránh xung đột khi dùng chung mạng
  const uniqueVisitorKey = `${safeIP}_${sessionId}`;

  const userRef = ref(db, `visitors/${uniqueVisitorKey}`);
  const locationToSave = userInfo.location || SAFE_LOCATION;

  const visitorData: LiveVisitor = {
    ip: userInfo.ip,
    username: userInfo.username,
    accessTime: userInfo.accessTime,
    location: locationToSave,
    id: uniqueVisitorKey, // ID unique
    isCurrentUser: false, // Client sẽ tự check lại khi subscribe
    status: 'active',
    lastActive: new Date().toISOString()
  };

  try {
    // Ghi dữ liệu người dùng
    await set(userRef, visitorData);

    // Tự động xóa khi mất kết nối (đóng tab/tắt mạng)
    await onDisconnect(userRef).remove();
  } catch (error) {
    console.error("Lỗi Firebase:", error);
  }
}

export function subscribeToVisitors(
  callback: (visitors: LiveVisitor[]) => void
) {
  const visitorsRef = ref(db, 'visitors');
  const currentSessionId = getSessionId(); // Lấy session ID của chính mình

  return onValue(visitorsRef, (snapshot) => {
    const data = snapshot.val();
    const visitorList: LiveVisitor[] = [];

    if (data) {
      Object.keys(data).forEach((key) => {
        const visitor = data[key];
        if (visitor && visitor.ip) {
          // Kiểm tra xem visitor này có phải là mình không dựa trên SessionID có trong Key
          visitor.isCurrentUser = key.includes(currentSessionId);

          const lastActive = visitor.lastActive || new Date().toISOString();
          visitor.accessTime = new Date(lastActive).toLocaleTimeString('vi-VN');

          if (!visitor.location) visitor.location = SAFE_LOCATION;

          visitorList.push(visitor);
        }
      });
    }
    callback(visitorList);
  });
}

export async function goOffline(ip: string) {
  if (!ip) return;
  const safeIP = sanitizeIP(ip);
  const sessionId = getSessionId();

  // Xóa đúng key của session hiện tại
  const uniqueVisitorKey = `${safeIP}_${sessionId}`;
  await remove(ref(db, `visitors/${uniqueVisitorKey}`));
}


// --- LOGIC THỐNG KÊ (DAILY STATS) ---
// Helper: Lấy key ngày hôm nay (YYYY-MM-DD)
const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Lấy giờ hiện tại (0-23)
const getCurrentHourKey = () => {
  return new Date().getHours().toString();
};

/**
 * Tăng bộ đếm lượt truy cập cho giờ hiện tại.
 * Sử dụng Session Storage để tránh spam đếm khi F5 trang.
 */
export async function incrementVisitCount() {
  // Kiểm tra xem session này đã được tính chưa
  const hasRecorded = sessionStorage.getItem('has_recorded_visit_v2');
  if (hasRecorded) return; // Nếu đã tính rồi thì thôi

  const dateKey = getTodayKey();
  const hourKey = getCurrentHourKey();

  // Đường dẫn: daily_stats/2023-10-27/14 (Ví dụ ngày 27, lúc 14h)
  const statsRef = ref(db, `daily_stats/${dateKey}/${hourKey}`);

  try {
    // Transaction giúp tăng số an toàn khi nhiều người cùng vào
    await runTransaction(statsRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });

    // Đánh dấu là đã tính cho phiên này
    sessionStorage.setItem('has_recorded_visit_v2', 'true');
    console.log("Recorded visit for daily stats 📈");
  } catch (error) {
    console.error("Failed to update daily stats:", error);
  }
}

/**
 * Lắng nghe thay đổi dữ liệu biểu đồ realtime
 */
export function subscribeToDailyStats(
  callback: (hourlyData: number[], total: number) => void
) {
  const dateKey = getTodayKey();
  const statsRef = ref(db, `daily_stats/${dateKey}`);

  return onValue(statsRef, (snapshot) => {
    const data = snapshot.val() || {};

    // Tạo mảng 24 số 0
    const hourlyData = new Array(24).fill(0);
    let total = 0;

    // Fill dữ liệu từ Firebase vào mảng
    Object.keys(data).forEach((hourKey) => {
      const count = data[hourKey];
      const hourIndex = parseInt(hourKey, 10);
      if (hourIndex >= 0 && hourIndex < 24) {
        hourlyData[hourIndex] = count;
        total += count;
      }
    });

    callback(hourlyData, total);
  });
}