document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const twoPlayerButton = document.getElementById('twoPlayerButton');
    const restartButton = document.getElementById('restartButton');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('finalScore');
    const gameOverElement = document.getElementById('gameOver');

    let gameRunning = false;
    let gameOver = false;
    let animationFrameId;
    let score = 0;
    let twoPlayerMode = false;

    const laneCount = 4;
    const laneWidth = canvas.width / laneCount;
    const lanes = [];
    for (let i = 0; i < laneCount; i++) {
        lanes.push(i * laneWidth);
    }

    const player1 = {
        x: lanes[1],
        y: canvas.height - 80,
        width: 40,
        height: 70,
        color: '#3498db',
        speed: 7,
        lane: 1,
        active: true
    };

    const player2 = {
        x: lanes[2],
        y: canvas.height - 80,
        width: 40,
        height: 70,
        color: '#e74c3c',
        speed: 7,
        lane: 2,
        active: false
    };

    function drawPlayer(player) {
        if (!player.active) return;
        
        ctx.save();
        
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(player.x + 5, player.y + 5, player.width - 10, 15);
        ctx.fillRect(player.x + 5, player.y + 30, player.width - 10, 15);
        
        ctx.fillStyle = player === player1 ? '#FFD700' : '#FF4500';
        const lightY = player === player1 ? player.y + player.height - 10 : player.y;
        ctx.fillRect(player.x + 5, lightY, 8, 5);
        ctx.fillRect(player.x + player.width - 13, lightY, 8, 5);
        
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(player.x - 3, player.y + 10, 5, 15);
        ctx.fillRect(player.x - 3, player.y + player.height - 25, 5, 15);
        ctx.fillRect(player.x + player.width - 2, player.y + 10, 5, 15);
        ctx.fillRect(player.x + player.width - 2, player.y + player.height - 25, 5, 15);
        
        ctx.restore();
    }

    class EnemyCar {
        constructor(lane, speed) {
            this.lane = lane;
            this.x = lanes[lane] + (laneWidth - 40) / 2;
            this.y = -70;
            this.width = 40;
            this.height = 70;
            this.speed = speed;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            const colors = ['#2ecc71', '#9b59b6', '#e67e22', '#1abc9c', '#d35400'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.save();
            
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, 15);
            ctx.fillRect(this.x + 5, this.y + 30, this.width - 10, 15);
            
            ctx.fillStyle = '#FF4500';
            ctx.fillRect(this.x + 5, this.y, 8, 5);
            ctx.fillRect(this.x + this.width - 13, this.y, 8, 5);
            
            ctx.fillStyle = '#2C3E50';
            ctx.fillRect(this.x - 3, this.y + 10, 5, 15);
            ctx.fillRect(this.x - 3, this.y + this.height - 25, 5, 15);
            ctx.fillRect(this.x + this.width - 2, this.y + 10, 5, 15);
            ctx.fillRect(this.x + this.width - 2, this.y + this.height - 25, 5, 15);
            
            ctx.restore();
        }

        update() {
            this.y += this.speed;
            
            if (this.y > canvas.height) {
                return true;
            }
            return false;
        }

        collides(player) {
            if (!player.active) return false;
            
            return (
                player.x < this.x + this.width &&
                player.x + player.width > this.x &&
                player.y < this.y + this.height &&
                player.y + player.height > this.y
            );
        }
    }

    const enemyCars = [];
    let spawnRate = 60; 
    let spawnCounter = 0;

    function drawRoad() {
        ctx.fillStyle = '#34495e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 20]);
        
        for (let i = 1; i < laneCount; i++) {
            ctx.beginPath();
            ctx.moveTo(lanes[i], 0);
            ctx.lineTo(lanes[i], canvas.height);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
        
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, canvas.height);
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();
    }

    function initializeGame() {
        enemyCars.length = 0;
        score = 0;
        scoreElement.textContent = score;
        
        player1.x = lanes[1] + (laneWidth - player1.width) / 2;
        player1.y = canvas.height - 80;
        player1.lane = 1;
        player1.active = true;
        
        player2.x = lanes[2] + (laneWidth - player2.width) / 2;
        player2.y = canvas.height - 80;
        player2.lane = 2;
        player2.active = twoPlayerMode;
        
        gameOver = false;
        gameOverElement.style.display = 'none';
        spawnRate = 60;
        spawnCounter = 0;
    }

    function gameLoop() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawRoad();
        
        spawnCounter++;
        if (spawnCounter >= spawnRate) {
            spawnEnemyCar();
            spawnCounter = 0;
            
            if (spawnRate > 20) {
                spawnRate -= 0.1;
            }
        }
        
        for (let i = enemyCars.length - 1; i >= 0; i--) {
            const car = enemyCars[i];
            
            if (car.update()) {
                enemyCars.splice(i, 1);
                score += 1;
                scoreElement.textContent = score;
            } else {
                car.draw();
                
                if (car.collides(player1) || car.collides(player2)) {
                    endGame();
                    return;
                }
            }
        }
        
        drawPlayer(player1);
        drawPlayer(player2);
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    function spawnEnemyCar() {
        const occupiedLanes = enemyCars
            .filter(car => car.y < 100)
            .map(car => car.lane);
        
        let availableLanes = [];
        for (let i = 0; i < laneCount; i++) {
            if (!occupiedLanes.includes(i)) {
                availableLanes.push(i);
            }
        }
        
        if (availableLanes.length === 0) return;
        
        const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
        
        const speed = 3 + Math.random() * 2;
        
        enemyCars.push(new EnemyCar(lane, speed));
    }

    function endGame() {
        gameRunning = false;
        gameOver = true;
        cancelAnimationFrame(animationFrameId);
        
        finalScoreElement.textContent = `Puntuación: ${score}`;
        gameOverElement.style.display = 'block';
        startButton.disabled = false;
        twoPlayerButton.disabled = false;
    }

    document.addEventListener('keydown', (e) => {
        if (!gameRunning || gameOver) return;
        
        if (e.key === 'ArrowLeft') {
            player1.lane = Math.max(0, player1.lane - 1);
            player1.x = lanes[player1.lane] + (laneWidth - player1.width) / 2;
        } else if (e.key === 'ArrowRight') {
            player1.lane = Math.min(laneCount - 1, player1.lane + 1);
            player1.x = lanes[player1.lane] + (laneWidth - player1.width) / 2;
        }
        
        if (twoPlayerMode) {
            if (e.key === 'a' || e.key === 'A') {
                player2.lane = Math.max(0, player2.lane - 1);
                player2.x = lanes[player2.lane] + (laneWidth - player2.width) / 2;
            } else if (e.key === 'd' || e.key === 'D') {
                player2.lane = Math.min(laneCount - 1, player2.lane + 1);
                player2.x = lanes[player2.lane] + (laneWidth - player2.width) / 2;
            }
        }
    });

    startButton.addEventListener('click', () => {
        if (!gameRunning && !gameOver) {
            gameRunning = true;
            startButton.disabled = true;
            twoPlayerButton.disabled = true;
            initializeGame();
            gameLoop();
        }
    });

    resetButton.addEventListener('click', () => {
        location.reload();
    });

    twoPlayerButton.addEventListener('click', () => {
        twoPlayerMode = !twoPlayerMode;
        twoPlayerButton.textContent = twoPlayerMode ? 
            'Modo 1 Jugador' : 'Modo 2 Jugadores';
        
        if (!gameRunning) {
            player2.active = twoPlayerMode;
            drawInitialScreen();
        }
    });

    restartButton.addEventListener('click', () => {
        initializeGame();
        gameRunning = true;
        startButton.disabled = true;
        twoPlayerButton.disabled = true;
        gameLoop();
    });

    function drawInitialScreen() {
        drawRoad();
        drawPlayer(player1);
        if (twoPlayerMode) drawPlayer(player2);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 50, 300, 100);
        
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Traffic Racer', canvas.width / 2, canvas.height / 2 - 15);
        
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('Pulsa "Iniciar Juego" para empezar', canvas.width / 2, canvas.height / 2 + 15);
    }

    initializeGame();
    drawInitialScreen();
});