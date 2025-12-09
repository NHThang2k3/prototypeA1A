import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, User, Globe, ChevronDown, ArrowLeft } from "lucide-react";
import { getDetailedUserInfo, type DetailedUserInfo } from '../services/IPService';


// interface UserInfo {
//   ip: string;
//   username: string;
// }

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [selectedLang, setSelectedLang] = useState<"en" | "vi">("en");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<DetailedUserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Hook 1: Fetch User Info
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        setLoading(true);
        // Use getDetailedUserInfo to match IPTrackingDashboardPage logic
        const info = await getDetailedUserInfo();
        setUserInfo(info);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, []);

  // Hook 2: Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium hidden sm:block">Select Module</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Language Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium uppercase">
              {selectedLang}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button
                onClick={() => {
                  setSelectedLang("en");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  selectedLang === "en"
                    ? "bg-gray-100 text-gray-900 font-semibold"
                    : "text-gray-700"
                } hover:bg-gray-100`}
              >
                English
              </button>
              <button
                onClick={() => {
                  setSelectedLang("vi");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  selectedLang === "vi"
                    ? "bg-gray-100 text-gray-900 font-semibold"
                    : "text-gray-700"
                } hover:bg-gray-100`}
              >
                Vietnamese
              </button>
            </div>
          )}
        </div>

        <button className="text-gray-500 hover:text-gray-700">
          <Bell className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
          <User className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 p-1" />
          <span className="text-sm font-medium text-gray-700">
            {loading ? (
                <span className="animate-pulse">Loading...</span>
            ) : (
                userInfo?.ip || "Non-IP"
            )}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
