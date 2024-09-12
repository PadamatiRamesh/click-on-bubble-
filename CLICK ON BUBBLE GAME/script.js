document.addEventListener('DOMContentLoaded', () => {
    const bubbleContainer = document.getElementById('bubble-container');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const startButton = document.getElementById('start-button');
    const highScoreDisplay = document.createElement('div');
    //const correctSound = document.getElementById('correct-sound'); // Correct sound element
    //const wrongSound = document.getElementById('wrong-sound'); // Wrong sound element
    let score = 0;
    let timeLeft = 60;
    let timerInterval;
    let currentBubbleChar = '';
    let highestScore = localStorage.getItem('highestScore') || 0;

    // Display the highest score
    function displayHighScore() {
        highScoreDisplay.textContent = `High Score: ${highestScore}`;
        highScoreDisplay.style.fontSize = '24px';
        highScoreDisplay.style.margin = '10px';
        highScoreDisplay.style.color = '#333';
        document.getElementById('game-container').prepend(highScoreDisplay);
    }

    // Generate a random color
    function getRandomColor() {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF8C33', '#33FFF5'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    function getRandomPosition() {
        const containerRect = bubbleContainer.getBoundingClientRect();
        const bubbleSize = 60; // Bubble diameter
        const maxX = containerRect.width - bubbleSize;
        const maxY = containerRect.height - bubbleSize;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        return { x: randomX, y: randomY };
    }

    // Generate and display a single random bubble
    function displayRandomBubble() {
        bubbleContainer.innerHTML = ''; // Clear previous bubbles

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        const randomIndex = Math.floor(Math.random() * characters.length);
        currentBubbleChar = characters[randomIndex];

        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.textContent = currentBubbleChar;

        const { x, y } = getRandomPosition();
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        bubble.style.backgroundColor = getRandomColor(); // Set a random color

        bubbleContainer.appendChild(bubble);
    }
    function playSound(soundElement) {
        soundElement.currentTime = 0;  // Reset to start for immediate playback
        soundElement.play();
    }
    
    let correctSound, wrongSound;

    // Load sounds using Web Audio API
    function loadSounds() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        function loadSound(url, callback) {
            fetch(url)
                .then(response => response.arrayBuffer())
                .then(data => audioContext.decodeAudioData(data, callback));
        }
    
        loadSound('correct-6033.mp3', buffer => {
            correctSound = buffer;
        });
    
        loadSound('error-4-199275.mp3', buffer => {
            wrongSound = buffer;
        });
    
        function playSound(buffer) {
            const soundSource = audioContext.createBufferSource();
            soundSource.buffer = buffer;
            soundSource.connect(audioContext.destination);
            soundSource.start(0);
        }
    
        return { playCorrect: () => playSound(correctSound), playWrong: () => playSound(wrongSound) };
    }
    
    const sounds = loadSounds();
    
    // Handle keyboard input
    function handleKeyboardInput(event) {
        const keyPressed = event.key.toUpperCase();
        if (keyPressed === currentBubbleChar) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            sounds.playCorrect(); // Play correct sound
            displayRandomBubble(); // Display a new random bubble
        } else {
            sounds.playWrong(); // Play wrong sound
        }
    }
    

    // Start timer
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time left: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                finalScoreDisplay.textContent = `Final Score: ${score}`;

                if (score > highestScore) {
                    highestScore = score;
                    localStorage.setItem('highestScore', highestScore);
                    finalScoreDisplay.textContent += ` - New High Score!`;
                } else {
                    finalScoreDisplay.textContent += ` - High Score: ${highestScore}`;
                }

                finalScoreDisplay.classList.remove('hidden');
                restartButton.classList.remove('hidden'); // Show restart button
                document.removeEventListener('keydown', handleKeyboardInput); // Remove event listener
            }
        }, 1000);
    }

    // Initialize game
    function startGame() {
        score = 0;
        timeLeft = 60;
        scoreDisplay.textContent = `Score: ${score}`;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
        finalScoreDisplay.classList.add('hidden');
        restartButton.classList.add('hidden');
        displayRandomBubble();
        startTimer();
        document.addEventListener('keydown', handleKeyboardInput);
    }

    // Handle restart button click
    restartButton.addEventListener('click', () => {
        startGame();
    });

    // Handle start button click
    startButton.addEventListener('click', () => {
        startGame();
        startButton.classList.add('hidden'); // Hide the start button after starting the game
    });

    // Display the high score when the page loads
    displayHighScore();
});
