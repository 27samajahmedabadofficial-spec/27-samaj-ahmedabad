import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Heart,
  Bookmark,
  FileText,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: User, label: "Edit Profile", description: "Update your information" },
  { icon: Bell, label: "Notifications", description: "Manage notifications" },
  { icon: Bookmark, label: "Saved Items", description: "Your bookmarks" },
  { icon: Heart, label: "Favorites", description: "Your favorites" },
  { icon: FileText, label: "My Posts", description: "Posts you've created" },
  { icon: Shield, label: "Privacy", description: "Privacy settings" },
  { icon: HelpCircle, label: "Help & Support", description: "Get help" },
  { icon: Settings, label: "Settings", description: "App settings" },
];

interface Profile {
  id?: number;
  name?: string;
  full_name?: string;
  mobile_no?: string;
  city?: string | null;
  phone?: string | null;
  created_at: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user details from backend API
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLoading(false);
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
          if (data.data) {
            setProfile({
              id: data.data.id,
              name: data.data.name,
              full_name: data.data.full_name || data.data.name,
              mobile_no: data.data.mobile_no,
              city: data.data.city || null,
              phone: data.data.mobile_no,
              created_at: data.data.created_at,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
  };

  const getMemberSince = () => {
    if (profile?.created_at) {
      return new Date(profile.created_at).getFullYear().toString();
    }
    return new Date().getFullYear().toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="px-4 py-4 animate-fade-in">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card mb-6 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {profile?.full_name?.charAt(0) || profile?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {profile?.full_name || profile?.name || "Community Member"}
              </h2>
              {profile?.mobile_no && (
                <p className="text-muted-foreground">{profile.mobile_no}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">Member since {getMemberSince()}</p>
            </div>
          </div>
          <button className="w-full mt-4 py-3 border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-primary-foreground transition-all active:scale-[0.98]">
            View Full Profile
          </button>
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors active:bg-muted/80 animate-slide-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-icon border border-icon-border flex items-center justify-center">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button 
          onClick={handleSignOut}
          className="w-full mt-4 flex items-center justify-center gap-2 py-4 text-destructive hover:bg-destructive/10 rounded-2xl transition-colors active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
