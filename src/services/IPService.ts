// src/services/IPService.ts

const IP_USERNAME_MAP: Record<string, string> = {
  '127.0.0.1': 'Admin Local',
  '113.161.44.119': 'Thang Nguyen'
};

const DEFAULT_USERNAME = 'Khách';
const CACHE_KEY = 'user_detailed_info_v1';

export interface GeoLocation {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

export interface DetailedUserInfo {
  ip: string;
  username: string;
  location?: GeoLocation;
  accessTime: string;
}

function getFallbackLocation(): GeoLocation {
  return {
    country: 'Unknown Location',
    countryCode: 'UN',
    region: '',
    regionName: '',
    city: 'Hidden Location',
    zip: '',
    lat: 0,
    lon: 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Lấy timezone từ trình duyệt
    isp: 'Unknown ISP',
    org: '',
    as: '',
  };
}

// Hàm lấy IP riêng lẻ
export async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('IP API failed');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn("IPify failed, falling back to local IP");
    return '127.0.0.1';
  }
}

// Hàm lấy Location với logic Fallback + Backup API tốt hơn
export async function getGeoLocation(ip: string): Promise<GeoLocation> {
  // 1. Ưu tiên: ipapi.co (Chi tiết nhất, nhưng hay bị limit 429)
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    // Nếu bị lỗi 429 (Too Many Requests), ném lỗi để nhảy sang cách 2 ngay
    if (response.status === 429) throw new Error('Rate Limited');

    if (response.ok) {
      const data = await response.json();
      if (!data.error) {
        return {
          country: data.country_name || 'Unknown',
          countryCode: data.country_code || 'UN',
          region: data.region_code || '',
          regionName: data.region || '',
          city: data.city || 'Unknown',
          zip: data.postal || '',
          lat: data.latitude || 0,
          lon: data.longitude || 0,
          timezone: data.timezone || '',
          isp: data.org || '',
          org: data.org || '',
          as: data.asn || '',
        };
      }
    }
  } catch (e) {
    console.warn("Primary API (ipapi.co) failed or limited:", e);
  }

  // 2. Backup: ipwho.is (Miễn phí, không cần key, hỗ trợ HTTPS, không bị lỗi Mixed Content)
  try {
    const response = await fetch(`https://ipwho.is/${ip}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return {
          country: data.country,
          countryCode: data.country_code,
          region: data.region_code,
          regionName: data.region,
          city: data.city,
          zip: data.postal,
          lat: data.latitude,
          lon: data.longitude,
          timezone: data.timezone.id,
          isp: data.connection?.isp || '',
          org: data.connection?.org || '',
          as: data.connection?.asn ? `AS${data.connection.asn}` : '',
        };
      }
    }
  } catch (e) {
    console.warn("Secondary API (ipwho.is) failed:", e);
  }

  // 3. Đường cùng: Trả về dữ liệu giả để app không crash
  return getFallbackLocation();
}

export function getUsernameFromIP(ip: string): string {
  return IP_USERNAME_MAP[ip] || DEFAULT_USERNAME;
}

export async function getUserInfo(): Promise<{ ip: string; username: string }> {
  const ip = await getUserIP();
  const username = getUsernameFromIP(ip);
  return { ip, username };
}

// --- CORE FIX: THÊM CACHING VÀO SESSION STORAGE ---
export async function getDetailedUserInfo(forceRefresh = false): Promise<DetailedUserInfo> {
  // 1. Kiểm tra Cache trước
  if (!forceRefresh) {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        // Cập nhật lại thời gian truy cập mới nhất cho UI realtime
        parsed.accessTime = new Date().toLocaleString('vi-VN');
        console.log("Serving from Cache ✅");
        return parsed;
      } catch (e) {
        sessionStorage.removeItem(CACHE_KEY);
      }
    }
  }

  console.log("Fetching fresh data from APIs 🌍...");

  // 2. Nếu không có cache, mới gọi API
  const ip = await getUserIP();
  const username = getUsernameFromIP(ip);
  const location = await getGeoLocation(ip);
  const accessTime = new Date().toLocaleString('vi-VN');

  const result: DetailedUserInfo = {
    ip,
    username,
    location,
    accessTime,
  };

  // 3. Lưu vào Cache
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));

  return result;
}

export function clearCache(): void {
  sessionStorage.removeItem(CACHE_KEY);
  console.log("Cache cleared 🗑️");
}