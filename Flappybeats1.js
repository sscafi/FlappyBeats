// FlappyBeats - A rhythm-driven Flappy Bird-style game

// Canvas setup
const canvas = document.getElementById('gameCanvas'); // Get the canvas element
const ctx = canvas.getContext('2d'); // Get 2D rendering context

// Game constants
const GRAVITY = 0.5; // Gravity affecting bird's vertical velocity
const FLAP_STRENGTH = -10; // Strength of bird's flap
const PIPE_SPEED = 2; // Speed at which pipes move horizontally
const PIPE_SPAWN_INTERVAL = 2000; // Interval between spawning pipes (milliseconds)

// Bird object
const bird = {
  x: 50, // Initial horizontal position
  y: canvas.height / 2, // Initial vertical position (centered)
  velocity: 0, // Vertical velocity
  width: 30, // Width of the bird
  height: 30 // Height of the bird
};

// Pipes array
let pipes = [];

// Game state
let score = 0; // Player's score
let gameOver = false; // Flag indicating game over state

// Audio context and analyser for beat detection
const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Create audio context
const analyser = audioContext.createAnalyser(); // Create analyser node
analyser.fftSize = 256; // FFT size for frequency analysis
const bufferLength = analyser.frequencyBinCount; // Number of data points in the frequency domain
const dataArray = new Uint8Array(bufferLength); // Uint8Array to hold frequency data

// Load and play background music
function loadMusic() {
  const audio = new Audio('path/to/your/music.mp3'); // Replace 'path/to/your/music.mp3' with your music file path
  const source = audioContext.createMediaElementSource(audio); // Create media element source
  source.connect(analyser); // Connect source to analyser node
  analyser.connect(audioContext.destination); // Connect analyser to audio context destination (speakers)
  audio.play(); // Start playing the audio
}

// Main game loop
function gameLoop() {
  if (!gameOver) {
    update(); // Update game state
    draw(); // Draw game elements
    requestAnimationFrame(gameLoop); // Request next animation frame
  }
}

// Update game state
function update() {
  // Update bird's position based on gravity and velocity
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // Check for collisions with top and bottom boundaries
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true; // Game over if bird touches top or bottom
  }

  // Update pipes positions and check for collisions with bird
  pipes.forEach(pipe => {
    pipe.x -= PIPE_SPEED; // Move pipe horizontally

    // Check for collision with bird
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver = true; // Game over if bird collides with pipe
    }

    // Check if bird has passed through the pipe
    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      score++; // Increment score
      pipe.passed = true; // Mark pipe as passed
    }
  });

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

  // Spawn new pipes at intervals
  if (Date.now() - lastPipeSpawn > PIPE_SPAWN_INTERVAL) {
    spawnPipe();
    lastPipeSpawn = Date.now(); // Update last pipe spawn time
  }

  // Check audio levels for bird's flap
  analyser.getByteFrequencyData(dataArray); // Get frequency data
  const average = dataArray.reduce(((a, b) => a + b)) / bufferLength; // Calculate average frequency
  if (average > 100) { // Adjust threshold as needed based on music and gameplay feel
    flap(); // Flap the bird
  }
}

// Draw game elements on the canvas
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Draw pipes
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top); // Top pipe
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom); // Bottom pipe
  });

  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);

  // Draw game over message
  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Spawn a new pipe with a gap for the bird to fly through
function spawnPipe() {
  const gap = 200; // Gap between top and bottom pipes
  const minHeight = 50; // Minimum height of top pipe
  const maxHeight = canvas.height - gap - minHeight; // Maximum height of top pipe
  const height = Math.random() * (maxHeight - minHeight) + minHeight; // Random height for top pipe

  pipes.push({
    x: canvas.width, // Start off-screen to the right
    top: height, // Top pipe height
    bottom: height + gap, // Bottom pipe height
    width: 50, // Pipe width
    passed: false // Flag to track if bird has passed through the pipe
  });
}

// Flap the bird upwards
function flap() {
  bird.velocity = FLAP_STRENGTH; // Set bird's velocity to flap strength
}

// Start the game
loadMusic(); // Load and play background music
gameLoop(); // Start the game loop

// Event listeners for user input
document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    flap(); // Flap the bird on Space key press
  }
});

canvas.addEventListener('click', flap); // Flap the bird on canvas click
