import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "./themeProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <RecoilRoot>
      <ThemeProvider>
      <SidebarProvider>
        <Toaster />
        {children}
      </SidebarProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default Providers;
