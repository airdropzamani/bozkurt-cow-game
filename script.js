let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let startScreen = document.getElementById("startScreen");
let startButton = document.getElementById("startButton");
let scoreBoard = document.getElementById("scoreBoard");
let difficultySelect = document.getElementById("difficulty");

let player = { x: 400, y: 500, width: 80, height: 80, speed: 5 };
let score = 0;
let milkDrops = [];
let milkBottle = null;
let dropSpeed = 2;
let gameInterval, bottleTimeout;
let playerImage = new Image();
playerImage.src = "character.png"; // Karakter görselin

// Oyun başlat
startButton.onclick = () => {
    let diff = difficultySelect.value;
    if (diff === "medium") dropSpeed = 4;
    if (diff === "hard") dropSpeed = 6;

    startScreen.style.display = "none";
    canvas.style.display = "block";
    scoreBoard.style.display = "block";
    score = 0;
    milkDrops = [];
    milkBottle = null;

    document.addEventListener("keydown", movePlayer);
    gameInterval = setInterval(gameLoop, 20);
};

// Oyuncu hareketi
function movePlayer(e) {
    if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (e.key === "ArrowRight" && player.x < canvas.width - player.width) player.x += player.speed;
}

// Süt damlası oluştur
function createMilkDrop() {
    milkDrops.push({
        x: Math.random() * (canvas.width - 20),
        y: 0,
        size: 20
    });
}

// Oyun döngüsü
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Damla oluştur
    if (Math.random() < 0.03) createMilkDrop();

    // Damla hareketi
    for (let i = milkDrops.length - 1; i >= 0; i--) {
        let drop = milkDrops[i];
        drop.y += dropSpeed;
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(drop.x, drop.y, drop.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Toplama kontrolü
        if (
            drop.x < player.x + player.width &&
            drop.x + drop.size > player.x &&
            drop.y < player.y + player.height &&
            drop.y + drop.size > player.y
        ) {
            milkDrops.splice(i, 1);
            score++;
            scoreBoard.innerText = "Score: " + score;

            // 10'un katı olduğunda şişe çıkart
            if (score % 10 === 0) {
                spawnMilkBottle();
            }
        }
    }

    // Süt şişesi çizme
    if (milkBottle) {
        ctx.fillStyle = "blue";
        ctx.fillRect(milkBottle.x, milkBottle.y, milkBottle.size, milkBottle.size * 1.5);
        milkBottle.y += dropSpeed;

        // Toplama kontrolü
        if (
            milkBottle.x < player.x + player.width &&
            milkBottle.x + milkBottle.size > player.x &&
            milkBottle.y < player.y + player.height &&
            milkBottle.y + milkBottle.size * 1.5 > player.y
        ) {
            score += score * 10;
            milkBottle = null;
            scoreBoard.innerText = "Score: " + score;
            clearTimeout(bottleTimeout);
        }
    }
}

// Şişe oluşturma
function spawnMilkBottle() {
    milkBottle = {
        x: Math.random() * (canvas.width - 30),
        y: 0,
        size: 30
    };
    bottleTimeout = setTimeout(() => {
        milkBottle = null;
    }, 3000);
}
