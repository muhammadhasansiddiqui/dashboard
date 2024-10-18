import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./screens/dashboard";
import Layout from "./components/layout/Layout.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/admin" element={<Layout />}>
        <Route path="/admin/dashboard" element={<Dashboard/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}