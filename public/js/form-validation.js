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
    const check = document.querySelector("#username-check");

    async function checkUsername() {
        const username = usernameInput.value;
        if (username === '') {
          check.textContent = '';
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
  password = password1.value;
  confirm = password2.value;

  if (password === "" || confirm === "") {
    match.textContent = "";
    submitBtn.disabled = true;
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