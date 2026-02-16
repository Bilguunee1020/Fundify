import React from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "seenIntro";

type Props = {
  // optional callback for external handling; not required for the example
  onFinish?: () => void;
};

const IntroPage: React.FC<Props> = ({ onFinish }) => {
  const navigate = useNavigate();

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (e) {
      // storage might be unavailable in some browsers; swallow silently
      // Could send analytics or show a message here.
    }

    onFinish?.();
    navigate("/main", { replace: true });
  };

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Welcome to Fundify</h1>
      <p>
        This short intro will show you how to use the app. When you finish,
        we'll remember your choice and send you to the main page.
      </p>

      <section style={{ marginTop: 20 }}>
        <h2>Why Fundify?</h2>
        <p>
          Support fundraisers, track donations, and manage campaigns in one
          place.
        </p>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Privacy</h2>
        <p>
          Your data stays secure. We only store a small flag in your browser so
          we don't show the intro again.
        </p>
      </section>

      <div style={{ marginTop: 32 }}>
        <button onClick={finish} style={{ padding: "8px 16px", fontSize: 16 }}>
          Finish and go to Main Page
        </button>
      </div>
    </div>
  );
};

export default IntroPage;
