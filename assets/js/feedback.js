document.addEventListener("DOMContentLoaded", function () {
  // Initialize EmailJS
  emailjs.init("_B5XNf9kr64s62G-9");

  const form = document.getElementById("feedback-form");
  const status = document.getElementById("form-status");
  const feedbackModal = new bootstrap.Modal(document.getElementById("feedbackModal"));

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    // Send form data using EmailJS
    emailjs.sendForm("service_xoo4akw", "template_v8so719", this)
      .then(() => {
        status.innerText = "✅ Message sent successfully!";
        form.reset();

        // Close modal after 1.5 seconds
        setTimeout(() => {
          feedbackModal.hide();
          status.innerText = ""; 
        }, 1500);
      })
      .catch((error) => {
        status.innerText = "❌ Failed to send message. Please try again.";
        console.error("EmailJS error:", error);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send";
      });
  });
});
