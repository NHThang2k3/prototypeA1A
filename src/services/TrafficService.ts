// src/services/TrafficService.ts
import { ref, set, onValue, onDisconnect, remove, runTransaction } from 'firebase/database';
import { db } from './firebase';
import type { DetailedUserInfo, GeoLocation } from './IPService';

// --- 1. 接口 (更新设备信息) ---
export interface DeviceInfo {
  os: string;
  browser: string;
  type: 'mobile' | 'desktop' | 'tablet';
}

export interface LiveVisitor extends DetailedUserInfo {
  id: string;              // Firebase 上的 Key (IP + DeviceID)
  isCurrentUser: boolean;  // 确认是否为本机
  status: 'active' | 'idle';
  lastActive: string;
  deviceId?: string;       // 设备唯一 ID
  deviceInfo?: DeviceInfo; // 操作系统/浏览器信息
}

// --- 2. CONSTANTS & HELPERS ---
const sanitizeIP = (ip: string) => ip.replace(/\./g, '_');

const SAFE_LOCATION: GeoLocation = {
  country: '未知', countryCode: 'UN', region: '', regionName: '',
  city: '隐藏', zip: '', lat: 0, lon: 0, timezone: '', isp: '', org: '', as: ''
};

/**
 * 创建或获取唯一设备 ID。
 * 保存到 localStorage 以长期标识用户（即使关闭浏览器）。
 */
const getDeviceId = (): string => {
  const STORAGE_KEY = 'unique_device_id';
  try {
    let deviceId = localStorage.getItem(STORAGE_KEY);
    if (!deviceId) {
      // 创建 ID: 前缀 + 时间戳 + 随机字符串
      deviceId = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(STORAGE_KEY, deviceId);
    }
    return deviceId;
  } catch (e) {
    return 'unknown_' + Date.now();
  }
};

/**
 * 解析 UserAgent 以获取设备信息
 */
const getSystemInfo = (): DeviceInfo => {
  const ua = navigator.userAgent;
  let os = '未知操作系统';
  let browser = '未知浏览器';
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

// --- 3. 核心逻辑：实时流量监控 ---

export async function registerPresence(userInfo: DetailedUserInfo) {
  if (!userInfo.ip) return;

  const safeIP = sanitizeIP(userInfo.ip);
  const deviceId = getDeviceId();

  // 创建组合 KEY：帮助区分同一 IP 网络上的多个设备
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
    deviceInfo: systemInfo, // 保存设备信息
    isCurrentUser: false,   // Client 订阅时会自动重检
    status: 'active',
    lastActive: new Date().toISOString()
  };

  try {
    // 覆盖最新数据
    await set(userRef, visitorData);

    // 断开连接时自动从 Firebase 删除（关闭标签页/断网）
    await onDisconnect(userRef).remove();
  } catch (error) {
    console.error("Firebase 错误:", error);
  }
}

export function subscribeToVisitors(
  callback: (visitors: LiveVisitor[]) => void
) {
  const visitorsRef = ref(db, 'visitors');
  const currentDeviceId = getDeviceId(); // 获取运行此代码的机器 ID

  return onValue(visitorsRef, (snapshot) => {
    const data = snapshot.val();
    const visitorList: LiveVisitor[] = [];

    if (data) {
      Object.keys(data).forEach((key) => {
        const visitor = data[key];

        if (visitor && visitor.ip) {
          // 逻辑检查当前用户：
          // 比较 DB 上的 key 是否包含此机器的 DeviceID
          visitor.isCurrentUser = key.includes(currentDeviceId);

          // 格式化显示时间
          const lastActive = visitor.lastActive || new Date().toISOString();
          visitor.accessTime = new Date(lastActive).toLocaleTimeString('vi-VN');

          if (!visitor.location) visitor.location = SAFE_LOCATION;

          // Fallback 如果缺少设备信息（旧数据）
          if (!visitor.deviceInfo) {
            visitor.deviceInfo = { os: '未知', browser: '未知', type: 'desktop' };
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

  // 仅删除此设备的 Key
  const uniqueVisitorKey = `${safeIP}_${deviceId}`;

  try {
    await remove(ref(db, `visitors/${uniqueVisitorKey}`));
  } catch (error) {
    console.error("下线错误:", error);
  }
}


// --- 4. 统计逻辑 (每日统计图表) ---

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
 * 增加访问计数。
 * 使用 SessionStorage 确保每个会话（打开浏览器）只计算一次。
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
    console.log("记录每日统计访问 📈");
  } catch (error) {
    console.error("更新每日统计失败:", error);
  }
}

/**
 * 监听图表数据
 */
export function subscribeToDailyStats(
  callback: (hourlyData: number[], total: number) => void
) {
  const dateKey = getTodayKey();
  const statsRef = ref(db, `daily_stats/${dateKey}`);

  return onValue(statsRef, (snapshot) => {
    const data = snapshot.val() || {};

    // 创建 24 小时数组 (0-23)
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