import {
  Home,
  LogIn,
  LogOut,
  PlusCircleIcon,
  Search,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type SidebarItem = {
  title: string;
  url: string;
  icon: React.ComponentType;
};

function AppSidebar() {
  const { user } = useAuth();

  const items: SidebarItem[] = [];

  if (user) {
    items.push({
      title: "Logout",
      url: "/logout",
      icon: LogOut,
    });
  } else {
    items.push({
      title: "Login",
      url: "/login",
      icon: LogIn,
    });
  }

  items.push(
    ...[
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Add Property",
        url: "/property/add",
        icon: PlusCircleIcon,
      },
      {
        title: "Search",
        url: "#",
        icon: Search,
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
    </Sidebar>
  );
}

export default AppSidebar;
