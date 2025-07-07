// js/session.js

const SESSION_COOKIE_NAME = "DummyClaimSessionID";
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes



function isSessionValid() {
  const session = getCookie(SESSION_COOKIE_NAME);
  return session !== null;
}

function logout(reason = "Session expired or invalid.") {
  console.log(reason);
  deleteCookie(SESSION_COOKIE_NAME);
  window.location.href = "login.html";
}

function updateSessionActivity() {
  if (!isSessionValid()) {
    logout();
  } else {
    setCookie(SESSION_COOKIE_NAME, Date.now(), 5); // Reset session timeout
  }
}

// Protect all pages with this
function protectPage() {
  if (!isSessionValid()) {
    logout("You are not logged in.");
  }
}

// Attach activity listeners
["click"].forEach(event => {
  window.addEventListener(event, updateSessionActivity);
});

// Initial session check
protectPage();
updateSessionActivity();
