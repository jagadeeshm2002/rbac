import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/common/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  // Add any props if needed
}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  return (
    <div className="w-screen">
      <div className="flex ">
        <aside className="">
          <AppSidebar />
        </aside>
        <main className="flex flex-col w-full">
          <div className="h-[74px] border-b border-b-gray-300 dark:border-b-gray-600 flex flex-row items-center justify-start">
            <div>
              <SidebarTrigger
                className="p-4 bg-gray-300 dark:bg-gray-700 rounded-l-none h-14 w-10"
                size={"lg"}
              />
            </div>
            <div className="sr-only"><span>other content</span></div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
