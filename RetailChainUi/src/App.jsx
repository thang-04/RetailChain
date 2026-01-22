import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import StorePage from "./pages/Store/StorePage";
import ProductPage from "./pages/Product/ProductPage";
import InventoryPage from "./pages/Inventory/InventoryPage";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
