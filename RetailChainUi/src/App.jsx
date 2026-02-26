import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Sonner } from "./components/ui/sonner";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Sonner />
    </BrowserRouter>
  )
}

export default App
