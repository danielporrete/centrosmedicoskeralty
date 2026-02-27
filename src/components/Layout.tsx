import { ReactNode } from "react";
import KералtyLogo from "./KералtyLogo";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background">
    <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
      <h1 className="text-lg font-semibold text-primary">Asignación de Cursos</h1>
      <KералtyLogo className="h-10" />
    </header>
    <main className="max-w-6xl mx-auto px-8 py-8">
      {children}
    </main>
  </div>
);

export default Layout;
