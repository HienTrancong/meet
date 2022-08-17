import React from "react";
import './WelcomeScreen.css';
function WelcomeScreen(props) {
  return props.showWelcomeScreen ?
    (
      <div className="WelcomeScreen">
<<<<<<< HEAD
        <h1>Welcome to Meet app</h1>
        <h4>Log in to see upcoming events around the world for full-stack developers</h4>
        <div className="button_cont" align="center">
          <div class="google-btn">
            <div class="google-icon-wrapper">
              <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google sign-in" />
            </div>
            <button onClick={() => { props.getAccessToken() }} className="btn-text"
              rel="nofollow noopener"
              class="btn-text"
            >
=======
        <div className="WelcomeWrapper">
          <h1>Welcome to the Meet app</h1>
          <h4>
            Log in to see upcoming events around the world for full-stack developers
          </h4>
        </div>
        <div className="button_cont" align="center">
          <div class="google-btn">
            <div class="google-icon-wrapper">
              <img
                class="google-icon"
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google sign-in"
              />
            </div>
            <button onClick={() => { props.getAccessToken() }} rel="nofollow noopener" class="btn-text">
>>>>>>> 4.9
              <b>Sign in with google</b>
            </button>
          </div>
        </div>
        <a
<<<<<<< HEAD
          href="https://YOUR_GITHUB_USERNAME.github.io/meet/privacy.html"
          rel="nofollow noopener">Privacy policy</a>
      </div>
=======
          href="https://hientrancong.github.io/meet/privacy.html"
          rel="nofollow noopener"
        >
          Privacy policy
        </a>
      </div >
>>>>>>> 4.9
    )
    : null
}
export default WelcomeScreen;
