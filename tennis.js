(function () {
    "use strict";

    const WIN_SCORE = 11;
    const PADDLE_SPEED = 12;
    const AI_SPEED = 6;
    const BALL_SPEED = 11;
    const PADDLE_MARGIN = 30;
    const PADDLE_WIDTH = 14;
    const PADDLE_HEIGHT = 80;
    const BALL_SIZE = 24;

    const game = document.querySelector(".game-container");
    const ball = document.getElementById("ball");
    const aiPaddle = document.getElementById("ai-paddle");
    const playerPaddle = document.getElementById("player-paddle");
    const aiScoreEl = document.getElementById("ai-score");
    const playerScoreEl = document.getElementById("player-score");
    const gameOverEl = document.getElementById("game-over");
    const winnerText = document.getElementById("winner-text");
    const playAgainBtn = document.getElementById("play-again");
    const startScreen = document.getElementById("start-screen");
    const startBtn = document.getElementById("start-btn");

    let gameWidth, gameHeight;
    let ballX, ballY, ballVx, ballVy;
    let aiPaddleY, playerPaddleY;
    let aiScore = 0, playerScore = 0;
    let running = false;
    let gameLoopId;
    let lastMouseY = 0;

    function getBounds() {
        const rect = game.getBoundingClientRect();
        gameWidth = rect.width;
        gameHeight = rect.height;
    }

    function resetBall() {
        ballX = gameWidth / 2 - BALL_SIZE / 2;
        ballY = gameHeight / 2 - BALL_SIZE / 2;
        ballVx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
        ballVy = (Math.random() - 0.5) * 4;
    }

    function resetPaddles() {
        aiPaddleY = gameHeight / 2 - PADDLE_HEIGHT / 2;
        playerPaddleY = Math.max(0, Math.min(gameHeight - PADDLE_HEIGHT, lastMouseY || gameHeight / 2 - PADDLE_HEIGHT / 2));
        aiPaddle.style.top = aiPaddleY + "px";
        playerPaddle.style.top = playerPaddleY + "px";
    }

    const NET_X = 0.5;

    function crossedLine(prevX, nowX, lineX) {
        const line = gameWidth * lineX;
        return (prevX < line && nowX >= line) || (prevX >= line && nowX < line);
    }

    function updateBall() {
        const prevBallCenterX = ballX + BALL_SIZE / 2;

        ballX += ballVx;
        ballY += ballVy;

        const ballCenterX = ballX + BALL_SIZE / 2;
        if (crossedLine(prevBallCenterX, ballCenterX, NET_X) && !ball.classList.contains("ball-shrink")) {
            ball.classList.add("ball-shrink");
            setTimeout(function () {
                ball.classList.remove("ball-shrink");
            }, 300);
        }

        // Top/bottom walls
        if (ballY <= 0) {
            ballY = 0;
            ballVy = -ballVy;
        }
        if (ballY >= gameHeight - BALL_SIZE) {
            ballY = gameHeight - BALL_SIZE;
            ballVy = -ballVy;
        }

        // AI paddle (left side)
        const aiPaddleLeft = PADDLE_MARGIN;
        const aiPaddleRight = PADDLE_MARGIN + PADDLE_WIDTH;
        if (ballVx < 0 && ballX <= aiPaddleRight && ballX + BALL_SIZE >= aiPaddleLeft) {
            if (ballY + BALL_SIZE >= aiPaddleY && ballY <= aiPaddleY + PADDLE_HEIGHT) {
                const hitPos = (ballY + BALL_SIZE / 2 - aiPaddleY) / PADDLE_HEIGHT;
                const angle = (hitPos - 0.5) * 1.2;
                ballVx = Math.abs(ballVx) * 1.02;
                ballVy += angle * 8;
                ballX = aiPaddleRight + 2;
            }
        }

        // Player paddle (right side)
        const playerPaddleLeft = gameWidth - PADDLE_MARGIN - PADDLE_WIDTH;
        const playerPaddleRight = gameWidth - PADDLE_MARGIN;
        if (ballVx > 0 && ballX + BALL_SIZE >= playerPaddleLeft && ballX <= playerPaddleRight) {
            if (ballY + BALL_SIZE >= playerPaddleY && ballY <= playerPaddleY + PADDLE_HEIGHT) {
                const hitPos = (ballY + BALL_SIZE / 2 - playerPaddleY) / PADDLE_HEIGHT;
                const angle = (hitPos - 0.5) * 1.2;
                ballVx = -Math.abs(ballVx) * 1.02;
                ballVy += angle * 8;
                ballX = playerPaddleLeft - BALL_SIZE - 2;
            }
        }

        // Score: ball out of bounds
        if (ballX < -BALL_SIZE) {
            playerScore++;
            playerScoreEl.textContent = playerScore;
            checkWin();
            if (running) resetBall();
        }
        if (ballX > gameWidth) {
            aiScore++;
            aiScoreEl.textContent = aiScore;
            checkWin();
            if (running) resetBall();
        }

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";
    }

    function updateAI() {
        // AI tracks ball when it's coming toward AI's side; add slight imperfection
        const isBallComing = ballVx < 0;
        const noise = (Math.random() - 0.5) * 25;
        const targetY = ballY + BALL_SIZE / 2 - PADDLE_HEIGHT / 2 + (isBallComing ? noise : 0);
        const diff = targetY - aiPaddleY;
        aiPaddleY += Math.sign(diff) * Math.min(Math.abs(diff), AI_SPEED);
        aiPaddleY = Math.max(0, Math.min(gameHeight - PADDLE_HEIGHT, aiPaddleY));
        aiPaddle.style.top = aiPaddleY + "px";
    }

    function gameLoop() {
        if (!running) return;
        updateBall();
        updateAI();
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function checkWin() {
        if (aiScore >= WIN_SCORE || playerScore >= WIN_SCORE) {
            running = false;
            cancelAnimationFrame(gameLoopId);
            gameOverEl.classList.add("visible");
            winnerText.textContent = playerScore >= WIN_SCORE ? "You Win!" : "AI Wins!";
        }
    }

    function startGame() {
        getBounds();
        aiScore = 0;
        playerScore = 0;
        aiScoreEl.textContent = "0";
        playerScoreEl.textContent = "0";
        gameOverEl.classList.remove("visible");
        startScreen.classList.add("hidden");
        resetPaddles();
        resetBall();
        running = true;
        gameLoop();
    }

    function resetGame() {
        gameOverEl.classList.remove("visible");
        startGame();
    }

    // Mouse move: player paddle follows cursor
    game.addEventListener("mousemove", function (e) {
        const rect = game.getBoundingClientRect();
        lastMouseY = e.clientY - rect.top - PADDLE_HEIGHT / 2;
        if (!running) return;
        playerPaddleY = Math.max(0, Math.min(gameHeight - PADDLE_HEIGHT, lastMouseY));
        playerPaddle.style.top = playerPaddleY + "px";
    });

    startBtn.addEventListener("click", startGame);
    playAgainBtn.addEventListener("click", resetGame);

    window.addEventListener("resize", function () {
        getBounds();
        if (running) {
            ballX = Math.max(0, Math.min(gameWidth - BALL_SIZE, ballX));
            ballY = Math.max(0, Math.min(gameHeight - BALL_SIZE, ballY));
        }
    });

    getBounds();
})();
