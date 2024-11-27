import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  Settings,
  User2,
  Moon,
  Sun,
  LogOut,
  
} from "lucide-react";
import Logo from "@/assets/logo.jpeg";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { themeState, tokenState, userState } from "@/atoms/Atom";
import { Role, User } from "@/types/user.types";
import { useTokenManagement } from "@/api/axios";

// Define user roles and their corresponding menu items
const menuItemsByRole: Record<
  Role,
  Array<{ title: string; url: string; icon: any; roles: Array<Role> }>
> = {
  admin: [
    {
      title: "Home",
      url: "/admin",
      icon: Home,
      roles: ["admin"],
    },
    {
      title: "Manage Users",
      url: "/admin/manage-users",
      icon: Inbox,
      roles: ["admin"],
    },
    {
      title: "Manage Roles",
      url: "/admin/manage-roles",
      icon: Calendar,
      roles: ["admin"],
    },
    {
      title: "api testing",
      url: "/admin/api-testing",
      icon: Settings,
      roles: ["admin"],
    },
  ],
  manager: [
    {
      title: "Home",
      url: "/manager",
      icon: Home,
      roles: ["manager"],
    },
  ],
  user: [
    {
      title: "Home",
      url: "/users",
      icon: Home,
      roles: ["user"],
    },
  ],
};

export function AppSidebar() {
  const user: User = useRecoilValue(userState);

  const { setToken } = useTokenManagement(tokenState);
  const [theme, setTheme] = useRecoilState(themeState);

  // Get menu items based on user role
  const menuItems = menuItemsByRole[user.role.name] || [];

  const handleSignOut = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);

    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <Sidebar
      className={`border-r text-base border-r-gray-400 dark:border-gray-600 dark:text-gray-50 ${
        theme === "dark"
          ? "dark bg-gray-900 text-white"
          : "bg-gray-300 text-black"
      }`}
      side="left"
    >
      <SidebarHeader className="flex flex-row items-center justify-start space-x-2 p-4 border-b border-gray-400  dark:border-gray-600">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          <img src={Logo} alt="Company Logo" className="rounded-full" />
        </div>
        <h2 className="text-xl font-space-mono font-bold dark:text-gray-50">
          vrv security
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className=" text-base">
                  <SidebarMenuButton asChild>
                    <NavLink
                      key={item.title}
                      to={item.url}
                      className={({ isActive }) => `
    flex items-center p-2 rounded-md 
    ${isActive ? "bg-gray-100 text-blue-600" : "text-gray-700"}
  `}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        <item.icon
                          className="mr-2 w-8 h-8   "
                          color="gray"
                          size="xl"
                        />
                        <span className="font-space-mono text-[20px] text-gray-800 font-semibold dark:text-gray-200 ">
                          {item.title}
                        </span>
                      </Button>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-col space-y-2 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 className="mr-2" />
                  {user ? user.username : "Guest"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  onClick={() => {
                    handleSignOut();
                  }}
                  className=""
                >
                  <Button
                    variant={"ghost"}
                    className="w-full justify-start bg-gray-300 text-black dark:text-white dark:bg-gray-700"
                  >
                    <LogOut className="mr-2  text-red-500" />
                    <span>Sign Out</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          className="w-full justify-start"
        >
          {theme === "dark" ? (
            <>
              <Sun className="mr-2" /> Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-2" /> Dark Mode
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
