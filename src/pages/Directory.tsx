import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Search, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Member {
  id: number;
  name: string;
  occupation: string;
  city: string;
  phone: string;
  familySize?: number;
}

const Directory = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_URL}/directory/members`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const data = await response.json();
        setMembers(data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load members. Please try again.");
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="px-4 py-4 animate-fade-in">
        <h2 className="text-xl font-semibold text-foreground mb-4">Member Directory</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading members...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive mb-4">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && members.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No members found</p>
          </div>
        )}

        {/* Members List */}
        {!loading && !error && filteredMembers.length > 0 && (
          <div className="space-y-3">
            {filteredMembers.map((member, index) => (
              <div 
                key={member.id}
                className="bg-card rounded-2xl p-4 border border-border shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-lg shrink-0">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.occupation}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{member.city}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-9 h-9 rounded-xl bg-icon border border-icon-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 rounded-xl bg-icon border border-icon-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all active:scale-95">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && members.length > 0 && filteredMembers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No members match your search</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Directory;
