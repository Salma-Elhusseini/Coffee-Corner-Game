// ============================
// STORE PLAYER DATA (REGISTER)
// ============================

const form = document.getElementById("registerForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const player = {
            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            committee: document.getElementById("committee").value.trim()
        };

        localStorage.setItem("player", JSON.stringify(player));
        window.location.href = "game.html";
    });
}


// ============================
// GAME PAGE
// ============================

const hintBox = document.getElementById("hintBox");
const submitBtn = document.getElementById("submitBtn");
const nextHintBtn = document.getElementById("nextHintBtn");
const answerInput = document.getElementById("answerInput");
const msg = document.querySelector(".msg");

if (hintBox) {

    function showMessage(text) {
        msg.innerText = text;
        msg.classList.add("show");

        setTimeout(function () {
            msg.innerText = "";
            msg.classList.remove("show");
        }, 3000);
    }

    let currentHint = 0;
    const pointsSystem = [10, 8, 6, 4];
    const pointsValue = document.querySelector(".pointsNumber");
    pointsValue.innerText = pointsSystem[currentHint];

    let gameData = [];
    const player = JSON.parse(localStorage.getItem("player"));

    // لو مفيش لاعب
    if (!player) {
        alert("Please register first.");
        window.location.href = "index.html";
    }

    // Load hints
    fetch("data.json")
        .then(res => res.json())
        .then(data => {
            gameData = data.levels;
            hintBox.innerText = gameData[0].hints[currentHint];
        })
        .catch(err => {
            console.error("Error loading data.json:", err);
        });

    // NEXT HINT
    nextHintBtn.addEventListener("click", function () {

        if (currentHint >= gameData[0].hints.length - 1) {
            showMessage("No more hints 😔");
            return;
        }

        const confirmNext = confirm("Are you sure? Your points will decrease.");
        if (!confirmNext) return;

        currentHint++;
        hintBox.innerText = gameData[0].hints[currentHint];
        pointsValue.innerText = pointsSystem[currentHint] || 0;
    });

    // SUBMIT ANSWER
    submitBtn.addEventListener("click", function () {

        const answer = answerInput.value.trim();

        if (!answer) {
            showMessage("Enter your answer first!");
            return;
        }

        const resultData = {
            name: player.name,
            phone: player.phone,
            committee: player.committee,
            answer: answer,
            hintUsed: currentHint + 1,
            points: pointsSystem[currentHint] || 0
        };

        
        fetch("https://script.google.com/macros/s/AKfycbyd-RkMZ1GA3KqlNvldB5zuHoT1F0GRECCJ4RaENKZdpTKLYNX6iHHQDiWQJnsvnUkB/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(resultData)
        })
        .then(res => res.text())
        .then(data => {
            console.log("Server Response:", data);
            window.location.href = "end.html";
        })
        .catch(err => {
            console.error("Submission failed:", err);
            alert("Error sending data. Check console.");
        });

    });
}
