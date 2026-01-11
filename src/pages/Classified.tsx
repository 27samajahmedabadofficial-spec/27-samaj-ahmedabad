import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { MapPin, Clock, Tag } from "lucide-react";

const listings = [
  {
    id: 1,
    title: "2 BHK Apartment for Rent",
    category: "Real Estate",
    location: "Ahmedabad",
    price: "₹15,000/month",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Toyota Innova 2020 - Low KM",
    category: "Vehicles",
    location: "Ahmedabad",
    price: "₹12,50,000",
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "iPhone 14 Pro Max - Like New",
    category: "Electronics",
    location: "Gota Ahmedabad",
    price: "₹85,000",
    time: "1 day ago",
  },
  {
    id: 4,
    title: "Office Space Available",
    category: "Real Estate",
    location: "Satellite Ahmedabad",
    price: "₹25,000/month",
    time: "2 days ago",
  },
];

const Classified = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="px-4 py-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Classifieds</h2>
          <button className="px-4 py-2 gradient-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity active:scale-95">
            + Post Ad
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          {["All", "Real Estate", "Vehicles", "Electronics", "Jobs", "Services"].map((cat, index) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
                index === 0 
                  ? "gradient-primary text-primary-foreground" 
                  : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="space-y-3">
          {listings.map((listing, index) => (
            <div 
              key={listing.id}
              className="bg-card rounded-2xl p-4 border border-border shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Tag className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-1">{listing.title}</h3>
                  <span className="inline-block px-2 py-0.5 bg-accent text-accent-foreground rounded-md text-xs font-medium mt-1">
                    {listing.category}
                  </span>
                  <p className="text-lg font-bold text-primary mt-1">{listing.price}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {listing.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {listing.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Classified;
