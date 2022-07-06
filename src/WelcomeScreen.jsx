import React from "react";

function WelcomeScreen(props) {
  return props.showWelcomeScreen ? (
    <div className="WelcomeScreen">
      <h1>Welcome to Meet app</h1>
      <h4>Log in to see upcoming events around the world for full-stack developers</h4>
      <button onClick={() => { props.getAccessToken(); }} className="btn-text">
        <b className="btn-text">Sign in with google</b>
      </button>
    </div>
  ) : null;
}

export default WelcomeScreen;