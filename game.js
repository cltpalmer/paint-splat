const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let painting = false;
let score = 0;
const brushSize = 20;
let eraseInterval = 500; // Initial erase interval
let remainingTime = 30;
let gameStarted = false;
let currentColor = '#FFB6C1'; // Default color

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

const colorOptions = document.querySelectorAll('.colorOption');
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        currentColor = option.getAttribute('data-color');
        colorOptions.forEach(opt => opt.style.border = '2px solid #000'); // Reset border
        option.style.border = '2px solid #FFF'; // Highlight selected color
    });
});

function startGame() {
    gameStarted = true;
    startButton.style.display = 'none';
    document.getElementById('colorPalette').style.display = 'none';
    document.getElementById('timer').innerText = `Time: ${remainingTime}`;
    document.getElementById('score').innerText = `Score: ${score}`;
    
    const timer = setInterval(() => {
        remainingTime--;
        document.getElementById('timer').innerText = `Time: ${remainingTime}`;
        if (remainingTime <= 0) {
            clearInterval(timer);
            endGame();
        } else if (remainingTime % 5 === 0) {
            eraseInterval = Math.max(100, eraseInterval - 50); // Speed up every 5 seconds
        }
    }, 1000);

    let eraser = setInterval(() => {
        if (remainingTime > 0) {
            eraseRandomSpot();
        } else {
            clearInterval(eraser);
        }
    }, eraseInterval);

    canvas.addEventListener('mousemove', draw);
}

function endGame() {
    alert(`Time's up! Your final score is: ${score}`);
    canvas.removeEventListener('mousemove', draw);
    gameStarted = false;
    startButton.style.display = 'block';
    document.getElementById('colorPalette').style.display = 'flex';
    remainingTime = 30;
    score = 0;
    eraseInterval = 500; // Reset erase interval
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw(e) {
    if (!gameStarted) return;
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    
    updateScore();
}

function eraseRandomSpot() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = brushSize;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();

    updateScore();
}

function updateScore() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let filledPixels = 0;
    for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i] !== 0 || imageData[i + 1] !== 0 || imageData[i + 2] !== 0 || imageData[i + 3] !== 0) {
            filledPixels++;
        }
    }
    score = Math.floor((filledPixels / (canvas.width * canvas.height)) * 1000);
    document.getElementById('score').innerText = `Score: ${score}`;
}

canvas.addEventListener('mouseleave', () => {
    ctx.beginPath();
});
