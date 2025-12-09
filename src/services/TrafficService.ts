// src/services/TrafficService.ts
import { ref, set, onValue, onDisconnect, remove, runTransaction } from 'firebase/database';
import { db } from './firebase';
import type { DetailedUserInfo, GeoLocation } from './IPService';

// --- 1. INTERFACES (Cập nhật thêm thông tin thiết bị) ---
export interface DeviceInfo {
  os: string;
  browser: string;
  type: 'mobile' | 'desktop' | 'tablet';
}

export interface LiveVisitor extends DetailedUserInfo {
  id: string;              // Key trên Firebase (IP + DeviceID)
  isCurrentUser: boolean;  // Xác định xem có phải là máy mình không
  status: 'active' | 'idle';
  lastActive: string;
  deviceId?: string;       // ID riêng của thiết bị
  deviceInfo?: DeviceInfo; // Thông tin OS/Browser
}

// --- 2. CONSTANTS & HELPERS ---
const sanitizeIP = (ip: string) => ip.replace(/\./g, '_');

const SAFE_LOCATION: GeoLocation = {
  country: 'Unknown', countryCode: 'UN', region: '', regionName: '',
  city: 'Hidden', zip: '', lat: 0, lon: 0, timezone: '', isp: '', org: '', as: ''
};

/**
 * Tạo hoặc lấy Device ID duy nhất.
 * Lưu vào localStorage để định danh người dùng lâu dài (kể cả khi tắt trình duyệt).
 */
const getDeviceId = (): string => {
  const STORAGE_KEY = 'unique_device_id';
  try {
    let deviceId = localStorage.getItem(STORAGE_KEY);
    if (!deviceId) {
      // Tạo ID: prefix + timestamp + random string
      deviceId = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(STORAGE_KEY, deviceId);
    }
    return deviceId;
  } catch (e) {
    return 'unknown_' + Date.now();
  }
};

/**
 * Phân tích UserAgent để lấy thông tin thiết bị
 */
const getSystemInfo = (): DeviceInfo => {
  const ua = navigator.userAgent;
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';
  let type: 'mobile' | 'desktop' | 'tablet' = 'desktop';

  // Detect OS
  if (ua.indexOf('Win') !== -1) os = 'Windows';
  else if (ua.indexOf('Mac') !== -1) os = 'macOS';
  else if (ua.indexOf('Linux') !== -1) os = 'Linux';
  else if (ua.indexOf('Android') !== -1) os = 'Android';
  else if (ua.indexOf('like Mac') !== -1) os = 'iOS';

  // Detect Browser
  if (ua.indexOf('Chrome') !== -1) browser = 'Chrome';
  else if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
  else if (ua.indexOf('Safari') !== -1) browser = 'Safari';
  else if (ua.indexOf('Edge') !== -1) browser = 'Edge';

  // Detect Mobile Type
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    type = 'mobile';
  }

  return { os, browser, type };
};

// --- 3. CORE LOGIC: LIVE TRAFFIC MONITOR ---

export async function registerPresence(userInfo: DetailedUserInfo) {
  if (!userInfo.ip) return;

  const safeIP = sanitizeIP(userInfo.ip);
  const deviceId = getDeviceId();

  // TẠO KEY KẾT HỢP: Giúp phân biệt nhiều thiết bị trên cùng 1 IP mạng
  const uniqueVisitorKey = `${safeIP}_${deviceId}`;

  const userRef = ref(db, `visitors/${uniqueVisitorKey}`);
  const locationToSave = userInfo.location || SAFE_LOCATION;
  const systemInfo = getSystemInfo();

  const visitorData: LiveVisitor = {
    ip: userInfo.ip,
    username: userInfo.username,
    accessTime: userInfo.accessTime,
    location: locationToSave,
    id: uniqueVisitorKey,
    deviceId: deviceId,
    deviceInfo: systemInfo, // Lưu thông tin thiết bị
    isCurrentUser: false,   // Client sẽ tự check lại khi subscribe
    status: 'active',
    lastActive: new Date().toISOString()
  };

  try {
    // Ghi đè dữ liệu mới nhất
    await set(userRef, visitorData);

    // Tự động xóa khỏi Firebase khi mất kết nối (đóng tab/tắt mạng)
    await onDisconnect(userRef).remove();
  } catch (error) {
    console.error("Lỗi Firebase:", error);
  }
}

export function subscribeToVisitors(
  currentUserInfo: DetailedUserInfo,
  callback: (visitors: LiveVisitor[]) => void
) {
  const visitorsRef = ref(db, 'visitors');
  const currentDeviceId = getDeviceId(); // Lấy ID của máy đang chạy code này

  return onValue(visitorsRef, (snapshot) => {
    const data = snapshot.val();
    const visitorList: LiveVisitor[] = [];

    if (data) {
      Object.keys(data).forEach((key) => {
        const visitor = data[key];

        if (visitor && visitor.ip) {
          // LOGIC CHECK NGƯỜI DÙNG HIỆN TẠI:
          // So sánh xem key trên DB có chứa DeviceID của máy này không
          visitor.isCurrentUser = key.includes(currentDeviceId);

          // Format thời gian hiển thị
          const lastActive = visitor.lastActive || new Date().toISOString();
          visitor.accessTime = new Date(lastActive).toLocaleTimeString('vi-VN');

          if (!visitor.location) visitor.location = SAFE_LOCATION;

          // Fallback nếu thiếu thông tin thiết bị (dữ liệu cũ)
          if (!visitor.deviceInfo) {
            visitor.deviceInfo = { os: 'Unknown', browser: 'Unknown', type: 'desktop' };
          }

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
  const deviceId = getDeviceId();

  // Chỉ xóa đúng key của thiết bị này
  const uniqueVisitorKey = `${safeIP}_${deviceId}`;

  try {
    await remove(ref(db, `visitors/${uniqueVisitorKey}`));
  } catch (error) {
    console.error("Error going offline:", error);
  }
}


// --- 4. LOGIC THỐNG KÊ (DAILY STATS CHART) ---

const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentHourKey = () => {
  return new Date().getHours().toString();
};

/**
 * Tăng bộ đếm lượt truy cập.
 * Dùng SessionStorage để mỗi phiên làm việc (mở trình duyệt) chỉ tính 1 lần.
 */
export async function incrementVisitCount() {
  const SESSION_KEY = 'has_recorded_visit_v2';
  const hasRecorded = sessionStorage.getItem(SESSION_KEY);

  if (hasRecorded) return;

  const dateKey = getTodayKey();
  const hourKey = getCurrentHourKey();
  const statsRef = ref(db, `daily_stats/${dateKey}/${hourKey}`);

  try {
    await runTransaction(statsRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });

    sessionStorage.setItem(SESSION_KEY, 'true');
    console.log("Recorded visit for daily stats 📈");
  } catch (error) {
    console.error("Failed to update daily stats:", error);
  }
}

/**
 * Lắng nghe dữ liệu biểu đồ
 */
export function subscribeToDailyStats(
  callback: (hourlyData: number[], total: number) => void
) {
  const dateKey = getTodayKey();
  const statsRef = ref(db, `daily_stats/${dateKey}`);

  return onValue(statsRef, (snapshot) => {
    const data = snapshot.val() || {};

    // Tạo mảng 24 giờ (0-23)
    const hourlyData = new Array(24).fill(0);
    let total = 0;

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