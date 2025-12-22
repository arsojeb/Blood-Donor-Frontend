import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import DashboardLayout from "./layout/DashboardLayout";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SearchDonors from "./pages/SearchDonors";
import MyRequests from "./pages/MyRequests";
import AdminDashboard from "./pages/AdminDashboard";
import Funding from "./dashboard/Funding";
import CreateDonationRequest from "./dashboard/CreateDonationRequest";
import Profile from "./dashboard/Profile";
import AllUsers from "./dashboard/AllUsers"; 
import AllDonationRequests from "./dashboard/AllDonationRequests";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Layout */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<SearchDonors />} />
        </Route>

        {/* Protected Dashboard Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* User Routes */}
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="donate" element={<CreateDonationRequest />} />
          <Route path="profile" element={<Profile />} />

          {/* Admin / Volunteer Routes */}
          <Route
            path="admin"
            element={
              <RoleRoute roles={["admin", "volunteer"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="funding"
            element={
              <RoleRoute roles={["admin", "volunteer"]}>
                <Funding />
              </RoleRoute>
            }
          />
          <Route
            path="all-users"
            element={
              <RoleRoute roles={["admin"]}>
                <AllUsers />
              </RoleRoute>
            }
          />
          <Route
            path="all-blood-donation-request"
            element={
              <RoleRoute roles={["admin", "volunteer"]}>
                <AllDonationRequests />
              </RoleRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
