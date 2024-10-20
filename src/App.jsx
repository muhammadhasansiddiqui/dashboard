import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navigate } from "react-router-dom";
import React from "react";
import Users from "./screens/Users";
import Invite from "./screens/Invite";
import Dashboard from "./screens/Dashboard";
import ErrorScreen from "./screens/ErrorScreen";
import ManagePrices from "./screens/ManagePrices";
import ManageService from "./screens/ManageService";
import ManageAds from "./screens/ManageAds";
import Notifications from "./screens/Notifications";
import VendorsAccount from "./screens/VendorsAccount";
import VendorsRequest from "./screens/VendorsRequest";
import VerifiedVendors from "./screens/VerifiedVendors";
import PickupRequests from "./screens/PickupRequests";
import TopupRequests from "./screens/TopupRequests";
import Layout from "./components/layout/Layout.jsx";
import AuthLayout from "./components/layout/Auth.jsx";
import CustomerSupport from "./screens/CustomerSupport.jsx";
import WithdrawalRequest from "./screens/WithdrawalRequest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="/admin" element={<Layout />}>
        <Route path="/admin/manage-prices" element={<ManagePrices />} />
        <Route path="/admin/vendorsRequest" element={<VendorsRequest />} />
        <Route path="/admin/manage-service" element={<ManageService />} />
        <Route path="/admin/manage-ads" element={<ManageAds />} />
        <Route path="/admin/Notifications" element={<Notifications />} />
        <Route path="/admin/dashboard" exact element={<Dashboard />} />
        <Route path="/admin/invite-users" element={<Invite />} />
        <Route path="/admin/pickup-requests" element={<PickupRequests />} />
        <Route path="/admin/vendorsAccount" element={<VendorsAccount />} />
        <Route path="/admin/verifiedVendors" element={<VerifiedVendors />} />
        <Route path="/admin/TopupRequests" element={<TopupRequests />} />
        <Route path="/admin/chat" element={<CustomerSupport />} />
        <Route
          path="/admin/withdrawalRequest"
          element={<WithdrawalRequest />}
        />
        <Route path="/admin/users" element={<Users />} />
        <Route path="*" element={<ErrorScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </BrowserRouter>
  );
}