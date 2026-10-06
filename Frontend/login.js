const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const data = await response.json();

    if (data.success) {
      alert("Login successful!");

      localStorage.setItem("username", data.user.username);
      localStorage.setItem("email", data.user.email);

      window.location.href = "main.html";
    } else {
      alert(data.message);

      loginButton.disabled = false;
      loginButton.textContent = "Log in";
    }

  } catch (error) {
    console.error("Login error:", error);

    alert(
      "Unable to connect to the CarePulse server.\n\n" +
      "Make sure node server.js is running."
    );

    loginButton.disabled = false;
    loginButton.textContent = "Log in";
  }
});