const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext('2d');
const cactusImage = document.getElementById("cactus");
const dinosaurImage= document.getElementById("dinosaur");
const gameOverContainer = document.getElementById("gameOverDisplay");
const restart = document.getElementById("restartGame");

canvas.width = window.innerWidth - 25;
canvas.height = window.innerHeight - 50;

const obstacles = [];
const gapSize = 150; 
const linePositionY = canvas.height - 300;

const dinosaur = {
    x: 50,
    y: linePositionY - 40,
    height: 25,
    width: 25,
    isJumping: false,
    jumpHeight: linePositionY - 170,
    jumpSpeed: 5
}

let gameOver = false;
let score = 0;

setInterval(() => {
    const obstacle = {
        x: canvas.width + Math.random() * 200, 
        y: linePositionY - 45, 
        width: 20,
        height: 20,
        speed: 3
    }

    if (obstacles.length === 0 || obstacle.x > obstacles[obstacles.length - 1].x + gapSize) {
        obstacles.push(obstacle);
    }
}, 2000); 

function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, canvas.width - 150, 50);
}

function game() {

    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        ctx.drawImage(dinosaurImage, dinosaur.x, dinosaur.y, 40, 40);


        ctx.fillStyle = 'black';
        ctx.fillRect(0, linePositionY, canvas.width, 2);

        for (let obstacle of obstacles) {
            obstacle.x -= obstacle.speed;
            ctx.drawImage(cactusImage, obstacle.x, obstacle.y, 50, 50);
        }

        for (let obstacle of obstacles) {
            if (
                dinosaur.x < obstacle.x + obstacle.width &&
                dinosaur.x + dinosaur.width > obstacle.x &&
                dinosaur.y < obstacle.y + obstacle.height &&
                dinosaur.y + dinosaur.height > obstacle.y
                ) {
                    gameOver = true;
                    gameOverContainer.innerHTML = "GAME OVER";
                    gameOverContainer.style.display = "block";
                    restart.style.display = "block";
            }
        }
        for (let i = obstacles.length - 1; i >= 0; --i) {
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
            }
        }
        
        drawScore();
    }
    requestAnimationFrame(game);
}

function jump() {
    if(!dinosaur.isJumping) { 
        dinosaur.isJumping = true;
        let jumpInterval = setInterval(() => {
            dinosaur.y -= dinosaur.jumpSpeed;
            if (dinosaur.y <= dinosaur.jumpHeight) {
                clearInterval(jumpInterval);
                fall();
            }
        }, 20);
    }
}

function fall() {
    let fallInterval = setInterval(() => {
        dinosaur.y += dinosaur.jumpSpeed;
        if (dinosaur.y >= linePositionY - 40) {
            dinosaur.y = linePositionY - 40;
            dinosaur.isJumping = false;
            clearInterval(fallInterval);
        }
    }, 20);
}

window.addEventListener('keydown', e => {
    if (e.key === " " || e.key === "Spacebar") {
        jump();
    }
});

game(); 

restart.addEventListener("click", () => {
    score = 0;
    gameOver = false;
    gameOverContainer.style.display = "none";
    restart.style.display = "none";
    obstacles.length = 0;
    dinosaur.isJumping = false;
    dinosaur.y = linePositionY - 40;
});