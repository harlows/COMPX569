// Validate account creation form

  // Avoid firing fetch on every keystroke by calling a delay or 'debouncing'
  function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

  window.addEventListener("load", function () {
    const usernameInput = document.querySelector("#txtUsername");
    const originalUsername = usernameInput.dataset.originalUsername;
    const check = document.querySelector("#username-check");

    async function checkUsername() {
        const username = usernameInput.value;
        check.textContent = "";
        // If user hasn't changed their username, don't warn
        if (username === originalUsername) {
          return;
        }
        const response = await fetch(
          `/account/check-username?username=${username}`
        );
        const isUser = await response.json();
        console.log("Username available:", isUser.available);
        if (isUser.available) {
            check.textContent = "Username available";
        } else {
            check.textContent = "Username already taken";
        }
    };
    const debouncedCheckUsername = debounce(checkUsername, 500);

    // Now use the debounced function as the event handler
    usernameInput.addEventListener("input", debouncedCheckUsername);
 

  // Check passwords match
const password1 = document.querySelector("#txtPassword1");
const password2 = document.querySelector("#txtPassword2");
const match = document.querySelector("#password-match");
const submitBtn = document.querySelector("#btnSubmit");

function checkPasswords () {
  const password = password1.value;
  const confirm = password2.value;

  if (!password && !confirm) {
    match.textContent = "";
    submitBtn.disabled = false;
    return;
  }
  
  if (password === confirm) {
    match.textContent = "Passwords match";
    submitBtn.disabled = false;
  } else {
    match.textContent = "Passwords do not match";
    submitBtn.disabled = true;
  }
};
password1.addEventListener("input", checkPasswords);
password2.addEventListener("input", checkPasswords);

 });