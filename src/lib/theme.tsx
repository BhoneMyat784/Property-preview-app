import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Theme = "light" | "dark";
const storageKey = "portal-theme";
const mediaQuery = "(prefers-color-scheme: dark)";
const Context = createContext({
  theme: "light" as Theme,
  toggleTheme: () => {},
});

// Runs in the document head so saved preferences apply before first paint.
// Keep browser APIs out of the server render and the initial React render.
export const themeBootstrap = `(() => {
  let saved;
  try { saved = localStorage.getItem("${storageKey}"); } catch {}
  const theme = saved === "light" || saved === "dark" ? saved :
    (window.matchMedia("${mediaQuery}").matches ? "dark" : "light");
  document.documentElement.dataset.theme = theme;
})();`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const explicit = useRef<Theme | null>(null);
  useEffect(() => {
    const media = window.matchMedia(mediaQuery);
    function apply(value: Theme) {
      document.documentElement.dataset.theme = value;
      setTheme(value);
    }
    function readPreference() {
      try {
        const saved = localStorage.getItem(storageKey);
        explicit.current = saved === "light" || saved === "dark" ? saved : null;
      } catch {
        explicit.current = null;
      }
      apply(explicit.current ?? (media.matches ? "dark" : "light"));
    }
    function onSystemChange() {
      if (!explicit.current) apply(media.matches ? "dark" : "light");
    }
    function onStorage(event: StorageEvent) {
      if (event.key === storageKey || event.key === null) readPreference();
    }
    readPreference();
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function toggleTheme() {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    explicit.current = next;
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {}
  }
  return (
    <Context.Provider value={{ theme, toggleTheme }}>
      {children}
    </Context.Provider>
  );
}

export const useTheme = () => useContext(Context);
