import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Sonner } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext/AuthProvider";
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Sonner />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
