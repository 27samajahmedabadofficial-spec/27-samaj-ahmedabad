import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

const posts = [
  {
    id: 1,
    author: "Community Admin",
    time: "2 hours ago",
    content: "Welcome to our community wall! Share your thoughts, updates, and stay connected with fellow members.",
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    author: "Rahul Patel",
    time: "5 hours ago",
    content: "Excited to announce the upcoming annual gathering! Looking forward to meeting everyone. 🎉",
    likes: 45,
    comments: 12,
  },
  {
    id: 3,
    author: "Priya Patel",
    time: "1 day ago",
    content: "Thank you to everyone who participated in the charity drive. Together we raised significant funds for education!",
    likes: 89,
    comments: 23,
  },
];

const Wall = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="px-4 py-4 animate-fade-in">
        <h2 className="text-xl font-semibold text-foreground mb-4">Community Wall</h2>
        
        <div className="space-y-4">
          {posts.map((post, index) => (
            <article 
              key={post.id}
              className="bg-card rounded-2xl p-4 border border-border shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                </div>
                <button className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              <p className="text-foreground mb-4">{post.content}</p>
              
              <div className="flex items-center gap-6 pt-3 border-t border-border">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ml-auto">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Wall;
