document.addEventListener("DOMContentLoaded", function () {
  
  
  const form = document.getElementById("feedback-form");
  const status = document.getElementById("form-status");
  const feedbackModal = new bootstrap.Modal(document.getElementById("feedbackModal"));

  if (!form || !status) {
    console.error("Required elements not found!");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const formData = new FormData(this);
    
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Validation
    if (!name || !email || !message) {
      status.innerText = "❌ Please fill in all fields.";
      status.style.color = "red";
      return;
    }

    // Update UI
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";
    status.innerText = "Sending message...";
    status.style.color = "blue";

    // Template parameters
    const templateParams = {
      name: name,
      email: email,
      message: message
    };

    console.log("Sending email...");

    // Send email (EmailJS is already initialized in HTML)
    emailjs.send("service_xoo4akw", "template_v8so719", templateParams)
      .then(function(response) {
        console.log("SUCCESS!", response);
        status.innerText = "✅ Message sent successfully!";
        status.style.color = "green";
        form.reset();

        // Close modal after 1.5 seconds
        setTimeout(function() {
          feedbackModal.hide();
          status.innerText = "";
          status.style.color = "";
        }, 1500);
      })
      .catch(function(error) {
        console.error("ERROR!", error);
        status.innerText = "❌ Failed to send message. Please try again.";
        status.style.color = "red";
      })
      .finally(function() {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send";
      });
  });
});