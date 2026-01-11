import { Search, MessageCircle, Bell, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [notificationCount] = useState(3);
  const [userName, setUserName] = useState("Member");
  const { user, profile } = useAuth();

  useEffect(() => {
    // Fetch current user name from API
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setUserName("Member");
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data?.name) {
            setUserName(data.data.name.split(" ")[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName("Member");
      }
    };

    if (user) {
      fetchUserName();
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors active:scale-95">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-lg font-semibold text-foreground">Hi, {userName}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2.5 rounded-xl hover:bg-muted transition-colors active:scale-95">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-muted transition-colors active:scale-95">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="relative p-2.5 rounded-xl hover:bg-muted transition-colors active:scale-95">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-primary-foreground bg-primary rounded-full px-1">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
