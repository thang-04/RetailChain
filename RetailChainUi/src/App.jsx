import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import StoreDashboardPage from "./pages/StoreDashboard/StoreDashboardPage";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/store" element={<StoreDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
