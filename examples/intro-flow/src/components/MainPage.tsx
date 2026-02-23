import React from "react";

const MainPage: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1>Main Page</h1>
      <p>
        This is the main page users see after the intro. If you've already
        completed the intro, you'll be redirected here automatically on future
        visits.
      </p>
    </div>
  );
};

export default MainPage;
