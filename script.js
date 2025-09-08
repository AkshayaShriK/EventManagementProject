// Initialize EmailJS
(function() {
    emailjs.init("-7IdTG9IF8MxUDXNc"); // your Public Key
})();

let generatedCode = "";
let attendees = [];

// RSVP Form Submission
document.getElementById("rsvpForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    generatedCode = Math.floor(100000 + Math.random() * 900000);

    emailjs.send("service_xn597k9", "template_1e5xd5v", {
        user_name: name,
        user_email: email,
        code: generatedCode
    })
    .then(() => {
        setStatus("📧 Confirmation email sent! Check your inbox.", "blue");
        document.getElementById("confirmationStep").classList.remove("hidden");

        attendees.push({ name, email, status: "pending" });
        renderAttendees();
    })
    .catch(err => {
        console.error("EmailJS Error:", err);
        setStatus("❌ Email sending failed!", "red");
    });
});

// Verify Confirmation Code
document.getElementById("verifyBtn").addEventListener("click", function() {
    const enteredCode = document.getElementById("confirmCode").value;
    const lastAttendee = attendees[attendees.length - 1];

    if (enteredCode == generatedCode && lastAttendee) {
        setStatus("✅ Email confirmed successfully!", "green");

        lastAttendee.status = "confirmed";
        renderAttendees();
        document.getElementById("confirmationStep").classList.add("hidden");
    } else {
        setStatus("❌ Incorrect code. Try again.", "red");
    }
});

// Render Attendees in Dashboard
function renderAttendees() {
    const list = document.getElementById("attendeeList");
    list.innerHTML = "";

    const filter = document.getElementById("filter").value;
    attendees
      .filter(a => filter === "all" || a.status === filter)
      .forEach(a => {
        const li = document.createElement("li");
        li.textContent = `${a.name} (${a.email}) - ${a.status}`;
        li.style.color = a.status === "confirmed" ? "green" : "orange";
        list.appendChild(li);
      });
}

// Filter Change
document.getElementById("filter").addEventListener("change", renderAttendees);

// Status Helper
function setStatus(message, color) {
    const status = document.getElementById("status");
    status.innerText = message;
    status.style.color = color;
}
