import { resolvedThemeState } from "@/atoms/Atom";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolvedTheme = useRecoilValue(resolvedThemeState);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return children;
}
