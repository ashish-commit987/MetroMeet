// App.tsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./modules/shared/routes/AppRoutes";
import Navbar from "./modules/shared/components/Navbar"; // ✅ Import Navbar

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* ✅ Add Navbar here */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;