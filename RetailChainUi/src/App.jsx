import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Sonner } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext/AuthProvider";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Sonner />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
