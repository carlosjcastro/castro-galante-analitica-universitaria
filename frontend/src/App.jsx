import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ComparePage from "./pages/ComparePage";
import NotFoundPage from "./pages/NotFoundPage";
import DocumentationPage from "./pages/DocumentationPage";
import DisclaimerModal from "./components/ui/DisclaimerModal";

export default function App() {
  return (
    <>
      <DisclaimerModal githubUrl="https://github.com/carlosjcastro/castro-galante-analitica-universitaria/blob/main/analitica-notebooks/notebooks/castro_galante_analitica_u_ejecutado.ipynb" />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/comparar" element={<ComparePage />} />
          <Route path="/documentacion" element={<DocumentationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
