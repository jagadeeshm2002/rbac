import { atom, selector } from "recoil";
import { User, Role, RoleAndPermissions, Theme } from "../types/user.types";

const userState = atom<User>({
  key: "userState",
  default:
    typeof window !== "undefined"
      ? JSON.stringify(localStorage.getItem("user")) as any
      : {
          _id: "",
          username: "",
          email: "",
          isActive: false,
          role: {
            _id: "",
            name: "" as Role,
            permissions: [],
            isActive: false,
          } as RoleAndPermissions,
        },
});
const tokenState = atom<string | null>({
  key: "tokenState", // unique ID
  default:
    typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null,
});

// Optional: Create a selector for authentication status
const isAuthenticatedState = atom<boolean>({
  key: "isAuthenticatedState",
  default:
    typeof window !== "undefined" ? !!localStorage.getItem("jwt_token") : false,
});

const themeState = atom<Theme>({
  key: "themeState",
  default: "system",
  effects: [
    ({ setSelf, onSet }) => {
      // Read the stored theme when the atom is first loaded
      const savedTheme = localStorage.getItem("app-theme") as Theme;
      if (savedTheme) {
        setSelf(savedTheme);
      }

      // Subscribe to changes and update localStorage
      onSet((newValue) => {
        localStorage.setItem("app-theme", newValue);
      });
    },
  ],
});
export const resolvedThemeState = selector<"dark" | "light">({
  key: "resolvedThemeState",
  get: ({ get }) => {
    const theme = get(themeState);

    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return theme;
  },
});
export { userState, tokenState, isAuthenticatedState, themeState };
