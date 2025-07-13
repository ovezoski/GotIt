import {
  Home,
  HousePlus,
  LogIn,
  LogOut,
  LucideList,
  Settings,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
type SidebarItem = {
  title: string;
  url: string;
  icon: React.ComponentType;
  onClick?: () => void;
};

function AppSidebar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out.");
    navigate("/login");
  };

  const items: SidebarItem[] = [];

  items.push(
    ...[
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "My Properties",
        url: "/my-properties",
        icon: LucideList,
      },
      {
        title: "Add Property",
        url: "/property/add",
        icon: HousePlus,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
      },
    ]
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <h1 className="bold text-center font-extrabold tracking-tight text-balance">
              Property App
            </h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? (
              <SidebarMenuButton asChild>
                <Link
                  onClick={handleLogout}
                  data-testid="logout-nav-link"
                  to="#"
                >
                  <LogOut />
                  <span>Log Out</span>
                </Link>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton asChild>
                <Link to="/login" data-testid="login-nav-link">
                  <LogIn />
                  <span>Log In</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
