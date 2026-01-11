import { Handshake } from "lucide-react";

const CommunityFooter = () => {
  return (
    <div className="px-4 py-6 mt-2">
      <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border shadow-card">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
          <Handshake className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Our Community</h3>
          <p className="text-sm text-muted-foreground">Together we grow stronger</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityFooter;
