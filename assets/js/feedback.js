document.addEventListener("DOMContentLoaded", function () {
  // TODO: Replace these with your EXACT IDs from EmailJS dashboard
  const PUBLIC_KEY = "_B5XNf9kr64s62G-9";  // ← Update this
  const SERVICE_ID = "service_xoo4akw";      // ← Update this  
  const TEMPLATE_ID = "template_v8so719";    // ← Update this
  
  console.log("=== EmailJS Debug Info ===");
  console.log("Public Key:", PUBLIC_KEY);
  console.log("Service ID:", SERVICE_ID);
  console.log("Template ID:", TEMPLATE_ID);
  console.log("========================");
  
  // Initialize EmailJS
  try {
    emailjs.init(PUBLIC_KEY);
    console.log("✅ EmailJS initialized successfully");
  } catch (error) {
    console.error("❌ EmailJS initialization failed:", error);
    return;
  }

  const form = document.getElementById("feedback-form");
  const status = document.getElementById("form-status");
  
  if (!form || !status) {
    console.error("❌ Required elements not found!");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("📝 Form submitted");

    const submitBtn = form.querySelector("button[type='submit']");
    const formData = new FormData(this);
    
    const name = formData.get('name');
    const email = formData.get('email'); 
    const message = formData.get('message');
    
    console.log("📋 Form data:", { name, email, message });

    // Validation
    if (!name || !email || !message) {
      status.innerText = "❌ Please fill in all fields.";
      status.style.color = "red";
      console.log("❌ Validation failed - missing fields");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";
    status.innerText = "Sending...";
    status.style.color = "blue";

    const templateParams = {
      name: name,
      email: email,
      message: message
    };

    console.log("🚀 Sending email with params:", templateParams);
    console.log("📧 Using Service ID:", SERVICE_ID);
    console.log("📋 Using Template ID:", TEMPLATE_ID);

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then((response) => {
        console.log("✅ SUCCESS! Response:", response);
        status.innerText = "✅ Message sent successfully!";
        status.style.color = "green";
        form.reset();
        
        // Close modal if it exists
        try {
          const feedbackModal = bootstrap.Modal.getInstance(document.getElementById("feedbackModal"));
          if (feedbackModal) {
            setTimeout(() => {
              feedbackModal.hide();
              status.innerText = "";
              status.style.color = "";
            }, 1500);
          }
        } catch (modalError) {
          console.log("Modal not found or error closing:", modalError);
        }
      })
      .catch((error) => {
        console.error("❌ ERROR Details:", error);
        console.error("❌ Error Status:", error.status);
        console.error("❌ Error Text:", error.text);
        
        let errorMessage = "❌ Failed to send message. ";
        
        if (error.status === 404) {
          errorMessage += "Service or template not found. Check your IDs.";
          console.error("🔍 404 Error: Double-check your Service ID and Template ID");
        } else if (error.status === 401) {
          errorMessage += "Unauthorized. Check your public key.";
        } else if (error.status === 400) {
          errorMessage += "Bad request. Check template variables.";
        } else {
          errorMessage += "Please try again.";
        }
        
        status.innerText = errorMessage;
        status.style.color = "red";
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send";
        console.log("🏁 Form submission completed");
      });
  });

  console.log("✅ Event listener attached successfully");