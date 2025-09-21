console.log("Feedback script loaded");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");
  
  const form = document.getElementById("feedback-form");
  const status = document.getElementById("form-status");
  
  console.log("Form element:", form);
  console.log("Status element:", status);
  console.log("EmailJS available:", typeof emailjs);
  
  if (!form) {
    console.error("Form not found!");
    return;
  }
  
  if (!status) {
    console.error("Status element not found!");
    return;
  }

  form.addEventListener("submit", function (e) {
    console.log("Form submit event triggered");
    e.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;
    const submitBtn = form.querySelector("button[type='submit']");

    console.log("Form values:", { name, email, message });
    console.log("Submit button:", submitBtn);

    if (!name || !email || !message) {
      console.log("Validation failed - missing fields");
      status.innerText = "Please fill in all fields.";
      status.style.color = "red";
      return;
    }

    console.log("Validation passed, preparing to send email");
    
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";
    status.innerText = "Sending...";
    status.style.color = "blue";

    const templateParams = {
      name: name,
      email: email,
      message: message
    };
    
    console.log("Template params:", templateParams);
    console.log("About to call emailjs.send...");

    emailjs.send("service_xoo4akw", "template_v8so719", templateParams)
      .then(function(response) {
        console.log("EmailJS SUCCESS:", response);
        status.innerText = "✅ Message sent successfully!";
        status.style.color = "green";
        form.reset();
        
        setTimeout(function() {
          status.innerText = "";
          status.style.color = "";
        }, 3000);
      })
      .catch(function(error) {
        console.error("EmailJS ERROR:", error);
        console.error("Error details:", error.status, error.text);
        status.innerText = "❌ Failed to send message.";
        status.style.color = "red";
      })
      .finally(function() {
        console.log("EmailJS call completed");
        submitBtn.disabled = false;
        submitBtn.innerText = "Send";
      });
  });
  
  console.log("Event listener attached successfully");
});