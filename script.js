// store data of player
const form = document.getElementById("registerForm");
if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const player = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            committee: document.getElementById("committee").value
        };
        localStorage.setItem("player", JSON.stringify(player));
        window.location.href = "game.html";
    });
}

//game page
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

    fetch("data.json")
        .then(res => res.json())
        .then(data => {
            gameData = data.levels;
            hintBox.innerText = gameData[0].hints[currentHint];
        });

    nextHintBtn.addEventListener("click", function () {
        if (currentHint >= gameData[0].hints.length - 1) {
            showMessage("No more hints 😔");
            return;
        }
        const confirmNext = confirm("Are you sure? Because your points will decrease.");
        if (!confirmNext) {
            return;
        }
        currentHint++;
        if (currentHint < gameData[0].hints.length) {
            hintBox.innerText = gameData[0].hints[currentHint];
            pointsValue.innerText = pointsSystem[currentHint] || 0;
        } else {
            nextHintBtn.disabled = true;
        }
    });

    submitBtn.addEventListener("click", function () {
        const answer = answerInput.value.trim();
        if (answer === "") {
            showMessage("Where your answer!");
            return;
        }

        const usedHintNumber = currentHint + 1;
        const points = pointsSystem[currentHint] || 0;

  
        const resultData = {
            name: player.name,
            phone: player.phone,
            committee: player.committee,
            answer: answer,
            hintUsed: usedHintNumber,
            points: points
        };

        fetch("https://script.google.com/macros/s/AKfycbyd-RkMZ1GA3KqlNvldB5zuHoT1F0GRECCJ4RaENKZdpTKLYNX6iHHQDiWQJnsvnUkB/exec", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(resultData)
        })
        .then(() => {
            window.location.href = "end.html";
        })
        .catch(err => {
            console.error("Submission failed:", err);
            window.location.href = "end.html";
        });
    });
}
