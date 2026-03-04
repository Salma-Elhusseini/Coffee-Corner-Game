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

if (hintBox) {

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
            alert("no more hints 😔");
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
            alert("where is your answer!")
            return;
        }

        const usedHintNumber = currentHint + 1;
        const points = pointsSystem[currentHint] || 0;

        const resultData = {
            name: player.name,
            phone: player.phone,
            committee: player.committee,
            answer: answerInput.value,
            hintUsed: usedHintNumber,
            points: points
        };
        fetch("YOUR_GOOGLE_WEB_APP_URL", {
            method: "POST",
            body: JSON.stringify(resultData)
        });

        window.location.href = "end.html";
    });
}
