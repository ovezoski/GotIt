import "./App.css";

import { SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/sidebar/AppSidebar";
import HomePage from "./pages/Home/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropertyDetailsPage from "./pages/Property/PropertyDetailsPage";
import CreatePropertyPage from "./pages/Property/CreatePropertyPage";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/property/:id/details"
              element={<PropertyDetailsPage />}
            />
            <Route path="/property/add" element={<CreatePropertyPage />} />
          </Routes>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
