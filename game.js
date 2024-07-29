const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let painting = false;
let score = 0;
const brushSize = 20;
const eraseInterval = 500; // Erase every 500ms
let remainingTime = 30;

function startGame() {
    document.getElementById('timer').innerText = `Time: ${remainingTime}`;
    document.getElementById('score').innerText = `Score: ${score}`;
    
    const timer = setInterval(() => {
        remainingTime--;
        document.getElementById('timer').innerText = `Time: ${remainingTime}`;
        if (remainingTime <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);

    const eraser = setInterval(() => {
        if (remainingTime > 0) {
            eraseRandomSpot();
        } else {
            clearInterval(eraser);
        }
    }, eraseInterval);
}

function endGame() {
    alert(`Time's up! Your final score is: ${score}`);
}

function startPosition(e) {
    painting = true;
    draw(e);
}

function finishedPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'red';
    
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    
    updateScore();
}

function eraseRandomSpot() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = brushSize * 2;
    
    ctx.clearRect(x, y, size, size);
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

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);

startGame();
