document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("_B5XNf9kr64s62G-9");

  const form = document.getElementById("feedback-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    if (!name || !email || !message) {
      status.innerText = "Please fill in all fields.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";
    status.innerText = "Sending...";

    const templateParams = {
      name: name,
      email: email,
      message: message
    };

    emailjs.send("service_xoo4akw", "template_v8so719", templateParams)
      .then(function(response) {
        status.innerText = "Message sent successfully!";
        form.reset();
      })
      .catch(function(error) {
        status.innerText = "Failed to send message.";
        console.error(error);
      })
      .finally(function() {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send";
      });
  });
});