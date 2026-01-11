import { 
  Info, 
  Users, 
  BookOpen, 
  Calendar, 
  Tag, 
  Users2, 
  CalendarCheck, 
  Newspaper, 
  MessageSquare, 
  Briefcase,
  Handshake,
  Heart,
  Wallet,
  HeartHandshake,
  Shield,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Info, label: "About", path: "/about", color: "from-orange-400 to-amber-500" },
  { icon: Users, label: "My Family", path: "/family", color: "from-blue-400 to-blue-600" },
  { icon: BookOpen, label: "Directory", path: "/directory", color: "from-purple-400 to-purple-600" },
  { icon: Calendar, label: "Event", path: "/events", color: "from-green-400 to-emerald-500" },
  { icon: Tag, label: "Classified", path: "/classified", color: "from-pink-400 to-rose-500" },
  { icon: Users2, label: "Community", path: "/community", color: "from-cyan-400 to-teal-500" },
  { icon: CalendarCheck, label: "Booking", path: "/booking", color: "from-indigo-400 to-indigo-600" },
  { icon: Newspaper, label: "Updates", path: "/updates", color: "from-yellow-400 to-orange-500" },
  { icon: MessageSquare, label: "Wall", path: "/wall", color: "from-sky-400 to-blue-500" },
  { icon: Briefcase, label: "Job", path: "/jobs", color: "from-slate-400 to-slate-600" },
  { icon: Handshake, label: "Buy/Sell", path: "/marketplace", color: "from-lime-400 to-green-500" },
  { icon: Heart, label: "Donation", path: "/donation", color: "from-red-400 to-rose-500" },
  { icon: Wallet, label: "Balance", path: "/balance", color: "from-emerald-400 to-teal-500" },
  { icon: HeartHandshake, label: "Matrimony", path: "/matrimony", color: "from-pink-400 to-pink-600" },
  { icon: Shield, label: "Committee", path: "/committee", color: "from-amber-400 to-orange-500" },
  { icon: ChevronRight, label: "More", path: "/more", color: "from-gray-400 to-gray-500" },
];

const FeatureGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.path}
              onClick={() => navigate(feature.path)}
              className="group flex flex-col items-center gap-2 animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-icon border border-icon-border flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-active:scale-95 group-hover:shadow-card overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-secondary transition-transform group-hover:scale-110" />
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-foreground text-center leading-tight">
                {feature.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureGrid;
