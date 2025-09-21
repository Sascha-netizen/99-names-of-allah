document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Feedback form script loaded");
  
  const form = document.getElementById("feedback-form");
  const status = document.getElementById("form-status");
  
  if (!form || !status) {
    console.error("❌ Required elements not found!");
    return;
  }

  form.addEventListener("submit", function (e) {
    console.log("📝 Form submitted");
    e.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;
    const submitBtn = form.querySelector("button[type='submit']");

    console.log("📋 Form data:", { name, email, message });

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

    // Prepare template parameters
    const templateParams = {
      name: name,
      email: email,
      message: message
    };

    console.log("🚀 Sending email with EmailJS...");

    // Send email using EmailJS (already initialized in HTML)
    emailjs.send("service_xoo4akw", "template_v8so719", templateParams)
      .then(function(response) {
        console.log("✅ SUCCESS:", response);
        status.innerText = "✅ Message sent successfully!";
        status.style.color = "green";
        form.reset();
        
        // Close modal after 2 seconds
        setTimeout(function() {
          try {
            const modal = bootstrap.Modal.getInstance(document.getElementById("feedbackModal"));
            if (modal) {
              modal.hide();
            }
          } catch (e) {
            console.log("Modal close error (non-critical):", e);
          }
          status.innerText = "";
          status.style.color = "";
        }, 2000);
      })
      .catch(function(error) {
        console.error("❌ EmailJS ERROR:", error);
        console.error("Error status:", error.status);
        console.error("Error text:", error.text);
        
        let errorMessage = "❌ Failed to send message. ";
        if (error.status === 404) {
          errorMessage += "Service or template not found.";
        } else if (error.status === 401) {
          errorMessage += "Authentication error.";
        } else {
          errorMessage += "Please try again.";
        }
        
        status.innerText = errorMessage;
        status.style.color = "red";
      })
      .finally(function() {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send";
        console.log("🏁 Email sending process completed");
      });
  });

  console.log("✅ Event listener attached successfully");
});