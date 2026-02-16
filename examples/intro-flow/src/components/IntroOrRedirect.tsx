import React from "react";
import { Navigate } from "react-router-dom";
import IntroPage from "./IntroPage";

const STORAGE_KEY = "seenIntro";

/**
 * If user already saw intro, redirect to /main.
 * Otherwise render the IntroPage component which handles finishing.
 */
const IntroOrRedirect: React.FC = () => {
  // localStorage access is synchronous and safe in browser environment
  const seen =
    typeof window !== "undefined" &&
    localStorage.getItem(STORAGE_KEY) === "true";

  if (seen) {
    return <Navigate to="/main" replace />;
  }

  return (
    <IntroPage
      onFinish={() => {
        /* handled inside IntroPage via navigation */
      }}
    />
  );
};

export default IntroOrRedirect;
