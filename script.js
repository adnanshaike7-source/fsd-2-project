
const form = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");
const successMessage = document.getElementById("successMessage");
const clearButton = document.getElementById("clearButton");

let feedbacks = JSON.parse(
    localStorage.getItem("studentFeedbacks") || "[]"
);

// UPDATE DASHBOARD
function updateDashboard() {
    document.getElementById("totalFeedback").textContent =
        feedbacks.length;

    const students = new Set(
        feedbacks.map(item => item.roll.toLowerCase())
    );

    document.getElementById("totalStudents").textContent =
        students.size;

    const average = feedbacks.length
        ? feedbacks.reduce((sum, item) => sum + Number(item.rating), 0)
          / feedbacks.length
        : 0;

    document.getElementById("averageRating").textContent =
        average.toFixed(1);
}

// DISPLAY FEEDBACK
function displayFeedback() {
    feedbackList.replaceChildren();

    if (feedbacks.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent = "📝 No feedback submitted yet.";
        feedbackList.appendChild(empty);
    }

    feedbacks.forEach(function(item, index) {
        const card = document.createElement("div");
        card.className = "feedback-card";

        const heading = document.createElement("h3");
        heading.textContent = "👨‍🎓 " + item.name;

        const roll = document.createElement("p");
        roll.textContent = "Roll Number: " + item.roll;

        const subject = document.createElement("p");
        subject.textContent = "Subject: " + item.subject;

        const rating = document.createElement("p");
        rating.textContent = "Rating: " + "⭐".repeat(
            Number(item.rating)
        ) + " (" + item.rating + "/5)";

        const message = document.createElement("p");
        message.textContent = "Feedback: " + item.message;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            feedbacks.splice(index, 1);
            saveFeedback();
            successMessage.textContent = "Feedback deleted successfully!";
        });

        card.append(
            heading,
            roll,
            subject,
            rating,
            message,
            deleteButton
        );

        feedbackList.appendChild(card);
    });

    updateDashboard();
}

// SAVE FEEDBACK
function saveFeedback() {
    localStorage.setItem(
        "studentFeedbacks",
        JSON.stringify(feedbacks)
    );

    displayFeedback();
}

// SUBMIT FEEDBACK
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const feedback = {
        name: document.getElementById("name").value.trim(),
        roll: document.getElementById("roll").value.trim(),
        subject: document.getElementById("subject").value,
        rating: document.getElementById("rating").value,
        message: document.getElementById("message").value.trim()
    };

    if (!feedback.name || !feedback.roll || !feedback.message) {
        alert("Please fill all the fields.");
        return;
    }

    feedbacks.push(feedback);

    saveFeedback();

    form.reset();

    successMessage.textContent =
        "✅ Feedback submitted successfully!";
});

// CLEAR ALL FEEDBACK
clearButton.addEventListener("click", function() {
    if (feedbacks.length === 0) {
        alert("No feedback available to clear.");
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to delete all feedback?"
    );

    if (confirmClear) {
        feedbacks = [];

        localStorage.removeItem("studentFeedbacks");

        displayFeedback();

        successMessage.textContent =
            "All feedback cleared successfully!";
    }
});

// INITIAL DISPLAY
displayFeedback();
