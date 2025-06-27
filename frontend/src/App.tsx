import "./App.css";

import { SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/sidebar/AppSidebar";
import HomePage from "./pages/Home/HomePage";
import { Input } from "./components/ui/input";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropertyDetailsPage from "./pages/Property/PropertyDetailsPage";
import CreatePropertyPage from "./pages/Property/CreatePropertyPage";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <div className="p-2 m-auto w-1/3 sm:w-3/4 ">
            <Input type="email" placeholder="Search"></Input>
          </div>
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
