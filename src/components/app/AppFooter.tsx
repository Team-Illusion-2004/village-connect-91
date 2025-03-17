
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, MessageSquare, PlusCircle, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const AppFooter = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: MessageSquare,
      label: "Chat",
      path: "/chat",
    },
    {
      icon: PlusCircle,
      label: "Report",
      path: "/report",
    },
    {
      icon: UserCircle,
      label: "Profile",
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-3 rounded-md",
              currentPath === item.path
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon size={20} className="mb-0.5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
