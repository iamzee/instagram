import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}
