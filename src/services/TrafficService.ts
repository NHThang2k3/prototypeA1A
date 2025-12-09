// src/services/TrafficService.ts
import { ref, set, onValue, onDisconnect, remove } from 'firebase/database';
import { db } from './firebase';
import type { DetailedUserInfo, GeoLocation } from './IPService';

export interface LiveVisitor extends DetailedUserInfo {
  id: string;
  isCurrentUser: boolean;
  status: 'active' | 'idle';
  lastActive: string;
}

const sanitizeIP = (ip: string) => ip.replace(/\./g, '_');

// Dữ liệu location an toàn để fallback
const SAFE_LOCATION: GeoLocation = {
  country: 'Unknown', countryCode: 'UN', region: '', regionName: '',
  city: 'Hidden', zip: '', lat: 0, lon: 0, timezone: '', isp: '', org: '', as: ''
};

export async function registerPresence(userInfo: DetailedUserInfo) {
  if (!userInfo.ip) return;

  const safeIP = sanitizeIP(userInfo.ip);
  const userRef = ref(db, `visitors/${safeIP}`);

  // QUAN TRỌNG: Đảm bảo location không bao giờ là undefined
  // Nếu userInfo.location bị lỗi/null -> Dùng SAFE_LOCATION
  const locationToSave = userInfo.location || SAFE_LOCATION;

  const visitorData: LiveVisitor = {
    ip: userInfo.ip,
    username: userInfo.username,
    accessTime: userInfo.accessTime,
    location: locationToSave, // Dùng biến đã đảm bảo an toàn
    id: safeIP,
    isCurrentUser: false,
    status: 'active',
    lastActive: new Date().toISOString()
  };

  try {
    // Bây giờ visitorData đảm bảo sạch, không có field undefined
    await set(userRef, visitorData);
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

  const unsubscribe = onValue(visitorsRef, (snapshot) => {
    const data = snapshot.val();
    const visitorList: LiveVisitor[] = [];

    if (data) {
      Object.keys(data).forEach((key) => {
        const visitor = data[key];
        // Chỉ thêm vào list nếu visitor hợp lệ
        if (visitor && visitor.ip) {
          visitor.isCurrentUser = (visitor.ip === currentUserInfo.ip);

          // Fix lỗi hiển thị thời gian nếu thiếu
          const lastActive = visitor.lastActive || new Date().toISOString();
          visitor.accessTime = new Date(lastActive).toLocaleTimeString('vi-VN');

          // Fix lỗi location khi đọc về nếu thiếu
          if (!visitor.location) visitor.location = SAFE_LOCATION;

          visitorList.push(visitor);
        }
      });
    }

    callback(visitorList);
  });

  return unsubscribe;
}

export async function goOffline(ip: string) {
  if (!ip) return;
  const safeIP = sanitizeIP(ip);
  await remove(ref(db, `visitors/${safeIP}`));
}