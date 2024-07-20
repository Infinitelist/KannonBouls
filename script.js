/* Rutherford Labbe - 05-02-2024 */

const ballImages = {
    green: 'assets/BoulGreen.png',
    orange: 'assets/BoulOrange.png',
    red: 'assets/BoulRed.png',
    blue: 'assets/Star.png',
    black: 'assets/Ghost.png'
};

// Object to store counts for each color
 const clickCounts = {
    green: 0,
    orange: 0,
    red: 0,
    blue: 0
};

// Variable to keep track of the number of rounds
let rounds = 0;

let blackBallCount = 0;

function createBall(color, position) {
    const ball = document.createElement('img');
    ball.src = ballImages[color]; // Set the image source to the corresponding color
    ball.classList.add('ball', color, position);
    ball.style.position = 'absolute'; // Ensure the image is positioned absolutely within the container

    // Click event listener for the ball
    ball.addEventListener('click', () => {
        if (color === 'blue') {
            removeAllBalls();
            // Increment the count for the clicked blue ball only if it's the only blue ball on the screen
            if (document.querySelectorAll('.ball.blue').length === 1) {
                clickCounts.blue++;
                rounds++; // Increment the number of rounds
                decreaseTimeout(); // Adjust timeout duration for colored balls
            }
            // Set a new interval for generating blue balls after a blue ball is clicked
            setTimeout(() => {
                setInterval(() => {
                    const colors = ['green', 'orange', 'red'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    createBall(randomColor, 'bottom-left'); // Position ball at bottom-left corner
                    createBall(randomColor, 'bottom-right'); // Position ball at bottom-right corner
                }, 3000); // Adjust the interval for how often new balls are created
            }, 3000 - 10); // Adjusted interval after a blue ball is clicked
        } else {
            if (!ball.classList.contains('black')) { // Check if the ball is not black
                ball.remove(); // Remove the ball from the DOM when clicked
                clearTimeout(timer); // Clear the timer
                // Increment the count for the clicked color
                clickCounts[color]++;
                updateCountDisplay(); // Update the display of counts
            }
        }
    });

    // Set a timer for the ball to change color to black
    let timer;
    if (color !== 'blue') {
        timer = setTimeout(() => {
            ball.src = ballImages['black']; // Change the image source to black
            ball.classList.remove(color);
            ball.classList.add('black');
            ball.removeEventListener('click', clickHandler); // Remove click event listener
            blackBallCount++;
            checkBlackBallCount(); // Check if we need to add a blue ball

            // Update black ball count and check if game over
            clickCounts.black++;
            checkGameOver();
        }, calculateTimeout());
    }

    document.querySelector('.container').appendChild(ball);

    // Random wander
    setInterval(() => {
        moveBall(ball, position);
    }, 3000);

    // Random wander
    const interval = color === 'blue' ? 800 : 1500; // Adjust the interval for blue balls
    setInterval(() => {
        moveBall(ball, position);
    }, interval); // Use different intervals for blue and non-blue balls
}

// Function to calculate timeout duration based on the number of rounds
function calculateTimeout() {
    return Math.max(100, 8000 - rounds * 100); // Minimum timeout is 1000 ms, maximum is 8000 ms
}

// Function to adjust timeout duration for colored balls after each round
function decreaseTimeout() {
    const balls = document.querySelectorAll('.ball:not(.blue)');
    balls.forEach(ball => {
        clearTimeout(ball.timer); // Clear the existing timeout
        ball.timer = setTimeout(() => {
            ball.classList.remove(ball.classList[1]); // Remove the current color class
            ball.classList.add('black'); // Change to black
            ball.removeEventListener('click', clickHandler); // Remove click event listener
        }, calculateTimeout()); // Calculate timeout duration based on the number of rounds
    });
}

// Update count display for each ball color
function updateCountDisplay() {
    document.getElementById('boul_one').textContent = "x" + clickCounts.green;
    document.getElementById('boul_two').textContent = "x" + clickCounts.orange;
    document.getElementById('boul_three').textContent = "x" + clickCounts.red;
    document.getElementById('boul_four').textContent = "x" + clickCounts.blue;
}

document.addEventListener('DOMContentLoaded', () => {

    // Create initial display for counts
    updateCountDisplay();

    // Counter to keep track of total balls
    let totalBalls = 0;

    // Function to generate a blue ball at a random position
    function generateBlueBall() {
        const minBallsBeforeBlue = 2; // Number of balls required before spawning blue ball

        // Increment total ball count
        totalBalls++;

        // Check if total balls reached a multiple of 10
        if (totalBalls % minBallsBeforeBlue === 0) {
            const positions = ['bottom-left', 'bottom-right']; // Possible positions
            const randomPosition = positions[Math.floor(Math.random() * positions.length)]; // Choose a random position
            createBall('blue', randomPosition); // Create a blue ball at the chosen position
        }

        // Schedule the next blue ball spawn after a random delay
        const nextSpawnDelay = Math.random() * 10000 + 5000; // Random delay between 5 to 15 seconds
        setTimeout(generateBlueBall, nextSpawnDelay);
    }

    // Start the random blue ball spawning
    generateBlueBall();

    // Initial interval time
    let intervalTime = 3000;

    setInterval(() => {
        const colors = ['green', 'orange', 'red'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        createBall(randomColor, 'bottom-left'); // Position ball at bottom-left corner
        createBall(randomColor, 'bottom-right'); // Position ball at bottom-right corner
    }, intervalTime); // Adjust the interval for how often new balls are created

    // Function to generate blue balls and other colored balls for each round
    function generateBallsForRound() {
        const minBallsBeforeBlue = 2; // Minimum number of balls required before spawning blue ball
        const maxBallsPerRound = 7; // Maximum number of balls that can appear per round

        // Generate a random number of balls for this round
        const ballsToGenerate = Math.floor(Math.random() * maxBallsPerRound) + 1;

        // Check if at least one blue ball should appear for this round
        let blueBallSpawned = false;

        for (let i = 0; i < ballsToGenerate; i++) {
            if (!blueBallSpawned && i >= minBallsBeforeBlue) {
                // Ensure at least one blue ball appears for each round after the minimum balls threshold
                createBall('blue', getRandomPosition());
                blueBallSpawned = true;
            } else {
                // Generate other colored balls for this round
                const colors = ['green', 'orange', 'red'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                createBall(randomColor, getRandomPosition());
            }
        }

        // Schedule the next round after a random delay
        const nextRoundDelay = Math.random() * 10000 + 5000; // Random delay between 5 to 15 seconds
        setTimeout(generateBallsForRound, nextRoundDelay);
    }

    // Function to get a random position for ball spawning
    function getRandomPosition() {
        const positions = ['bottom-left', 'bottom-right']; // Possible positions
        return positions[Math.floor(Math.random() * positions.length)]; // Choose a random position
    }

    // Start generating balls for each round
    generateBallsForRound();
    
});

function moveBall(ball, position) {
  const container = document.querySelector('.container');
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const ballWidth = ball.clientWidth;
  const ballHeight = ball.clientHeight;

  /*const maxX = containerWidth - ballWidth;
  const maxY = containerHeight - ballHeight;*/

  const maxX = ballWidth - containerWidth;
  const maxY = ballHeight - containerHeight;

  let randomX, randomY;

  // Adjust random movement based on position class
  if (position === 'bottom-left') {
    const angle = Math.PI * (3 / 4) + Math.random() * Math.PI / 4; // Angle range: π/4 to π/2 (135 to 90 degrees)
    randomX = Math.cos(angle) * (Math.random() * maxX);
    randomY = Math.sin(angle) * (Math.random() * maxY);

  } else if (position === 'bottom-right') {
    randomX = Math.random() * maxX; // Move horizontally anywhere within the container
    randomY = Math.random() * maxY; // Move vertically anywhere within the container
  }
  
  ball.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

// Function to remove all balls and update counts for disappeared balls
function removeAllBalls() {
    const balls = document.querySelectorAll('.ball');
    balls.forEach(ball => {
        const color = ball.classList[1]; // Get the color of the ball
        ball.remove(); // Remove the ball from the DOM
        if (color !== undefined) { // Check if the ball has a color class
            clickCounts[color]++; // Increment the count for the color
        }
    });
    updateCountDisplay(); // Update the display of counts
}

// Check black ball count and add blue ball if needed
function checkBlackBallCount() {
    if (blackBallCount >= 1) {
        const positions = ['bottom-left', 'bottom-right'];
        const randomPosition = positions[Math.floor(Math.random() * positions.length)];
        createBall('blue', randomPosition);
        blackBallCount = 0; // Reset black ball count after spawning blue ball(s)
    }
}

function checkGameOver() {
    const coloredBalls = document.querySelectorAll('.ball:not(.black)').length;
    const blackBalls = document.querySelectorAll('.black').length;

    // Check if there are more black balls than colored balls
    if (blackBalls > coloredBalls) {
        gameOver();
    }
}

function gameOver() {
    alert('Game Over!'); // You can customize this message or implement other actions for game over
}

// Add a setInterval to periodically check the game over condition
setInterval(checkGameOver, 2000); // Adjust the interval as needed

//window.location.reload(); // Reload the page to reset the game

