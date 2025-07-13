import { SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";
import HomePage from "./pages/Home/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropertyDetailsPage from "./pages/Property/PropertyDetailsPage";
import CreatePropertyPage from "./pages/Property/CreatePropertyPage";
import EditPropertyPage from "./pages/Property/EditPropertyPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import PrivateRoute from "./utils/PrivateRoute";
import { Toaster } from "@/components/ui/sonner";
import ProfilePage from "./pages/Profile/ProfilePage";
import MyPropertiesPage from "./pages/Profile/MyPropertiesPage";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-properties" element={<MyPropertiesPage />} />
            <Route
              path="/property/:id/details"
              element={<PropertyDetailsPage />}
            />
            <Route element={<PrivateRoute />}>
              <Route path="/property/add" element={<CreatePropertyPage />} />
              <Route
                path="/property/:id/edit"
                element={<EditPropertyPage />}
              />
            </Route>
          </Routes>
        </div>
      </SidebarProvider>
      <Toaster richColors />
    </BrowserRouter>
  );
}

export default App;
