import { ReactNode } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import KeraltyLogo from "./KeraltyLogo";

const Layout = ({ children }: { children: ReactNode }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
        <h1 className="text-lg font-semibold text-primary">Asignación de Cursos</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <KeraltyLogo className="h-10" />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
