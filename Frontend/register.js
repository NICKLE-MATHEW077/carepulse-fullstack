const registerForm = document.getElementById("registerForm");
const registerButton = document.getElementById("registerButton");

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // Prevent multiple clicks
  registerButton.disabled = true;
  registerButton.textContent = "Creating account...";

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Registration successful!");

      // Redirect to login page
      window.location.href = "login_page_design (1).html";
    } else {
      alert(data.message);

      registerButton.disabled = false;
      registerButton.textContent = "Register";
    }
  } catch (error) {
    console.error("Registration error:", error);

    alert(
      "Unable to connect to the server.\n\n" +
        "Make sure your Node.js backend is running.",
    );

    registerButton.disabled = false;
    registerButton.textContent = "Register";
  }
});
