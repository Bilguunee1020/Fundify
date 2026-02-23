import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import IntroOrRedirect from "./components/IntroOrRedirect";
import MainPage from "./components/MainPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<IntroOrRedirect />} />
      <Route path="/main" element={<MainPage />} />
      {/* catch-all redirect to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
