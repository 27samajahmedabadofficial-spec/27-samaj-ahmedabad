import Header from "@/components/layout/Header";
import Banner from "@/components/home/Banner";
import FeatureGrid from "@/components/home/FeatureGrid";
import CommunityFooter from "@/components/home/CommunityFooter";
import BottomNav from "@/components/layout/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="animate-fade-in">
        <Banner />
        <FeatureGrid />
        <CommunityFooter />
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
