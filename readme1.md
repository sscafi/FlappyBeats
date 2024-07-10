
# FlappyBeats

This JavaScript code implements a rhythm-driven game inspired by Flappy Bird. The game utilizes the HTML5 Canvas for rendering graphics and the Web Audio API for analyzing music beats to drive gameplay mechanics.

## Game setup

Canvas Setup: Initializes the game canvas and 2D rendering context (ctx).

Game Constants: Defines constants such as GRAVITY, FLAP_STRENGTH, PIPE_SPEED, and PIPE_SPAWN_INTERVAL for controlling gameplay mechanics.
## Game objects

Bird Object: Represents the player-controlled bird with properties for position (x, y), velocity (velocity), and dimensions (width, height).

Pipes Array: Stores information about the pipes in the game, including position (x), gap between top and bottom pipes (top, bottom), width (width), and whether the bird has passed through (passed).
## Game states

Score: Tracks the player's score based on how many pipes the bird successfully passes through.

Game Over: Boolean flag indicating whether the game is in a "game over" state.
## Audio Analysis

Audio Context and Analyser: Initializes the Web Audio API context (audioContext) and creates an analyser node (analyser) to analyze frequency data from the music.

Load Music: Loads and plays background music from a specified path (loadMusic() function).
## Game Mechanics

Spawn Pipe: Generates a new pipe with a random gap for the bird to fly through (spawnPipe() function).

Flap: Causes the bird to flap upwards in response to user input or detected music beats (flap() function).
## User Input

Event Listeners: Registers event listeners for keyboard (keydown for Space key) and canvas click events to trigger bird flapping (document.addEventListener() and canvas.addEventListener()).
