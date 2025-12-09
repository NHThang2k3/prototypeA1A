// src/services/IPService.ts
//
const IP_USERNAME_MAP: Record<string, string> = {
  '127.0.0.1': 'Admin Local',
};

const DEFAULT_USERNAME = '客户';
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
    country: '未知位置',
    countryCode: 'UN',
    region: '',
    regionName: '',
    city: '隐藏位置',
    zip: '',
    lat: 0,
    lon: 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isp: '未知 ISP',
    org: '',
    as: '',
  };
}

// 获取单个 IP 的函数
export async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('IP API failed');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn("IPify 失败，回退到本地 IP");
    return '127.0.0.1';
  }
}

// 使用回退 + 备份 API 逻辑获取位置的函数
export async function getGeoLocation(ip: string): Promise<GeoLocation> {
  // 1. 优先：ipapi.co (最详细，但容易受限 429)
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    // 如果遇到 429 错误 (Too Many Requests)，抛出错误以便立即使用方法 2
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

  // 2. 备份：ipwho.is (免费，无需密钥，支持 HTTPS，无混合内容错误)
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

  // 3. 兜底：返回伪数据以防应用崩溃
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

// --- 核心修复：添加 SESSION STORAGE 缓存 ---
export async function getDetailedUserInfo(forceRefresh = false): Promise<DetailedUserInfo> {
  // 1. 先检查缓存
  if (!forceRefresh) {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        // 更新最新的访问时间以用于实时 UI
        parsed.accessTime = new Date().toLocaleString('vi-VN');
        console.log("从缓存读取 ✅");
        return parsed;
      } catch (e) {
        sessionStorage.removeItem(CACHE_KEY);
      }
    }
  }

  console.log("从 API 获取最新数据 🌍...");

  // 2. 如果没有缓存，则调用 API
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

  // 3. 保存到缓存
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));

  return result;
}

export function clearCache(): void {
  sessionStorage.removeItem(CACHE_KEY);
  console.log("缓存已清除 🗑️");
}