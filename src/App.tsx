import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Resultados from "./pages/Resultados";
import ImportCSV from "./pages/ImportCSV";
import ImportFundamental from "./pages/ImportFundamental";
import ImportDiferenciales from "./pages/ImportDiferenciales";
import ImportSedes from "./pages/ImportSedes";
import ImportSedesColores from "./pages/ImportSedesColores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/import" element={<ImportCSV />} />
          <Route path="/import-fundamental" element={<ImportFundamental />} />
          <Route path="/import-diferenciales" element={<ImportDiferenciales />} />
          <Route path="/import-sedes" element={<ImportSedes />} />
          <Route path="/import-sedes-colores" element={<ImportSedesColores />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
