import React, { useState, useEffect, useRef } from 'react';
import './FlappyBird.css';
import { useNavigate } from 'react-router-dom';

const FlappyBird = ({score, setScore}) => {
    // Game state
    const [gameOver, setGameOver] = useState(false);
    const [highScore, setHighScore] = useState(0);

    // Game configurations
    const boardWidth = 400;
    const boardHeight = 600;
    const birdWidth = 40;
    const birdHeight = 30;

    // Refs for game elements and animation
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const birdRef = useRef({
        x: boardWidth / 8,
        y: boardHeight / 2,
        width: birdWidth,
        height: birdHeight,
        velocityY: 0
    });
    const pipesRef = useRef([]);
    const requestRef = useRef(null);
    const lastPipeTimeRef = useRef(0);

    // Images
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const birdImg = useRef(new Image());
    const topPipeImg = useRef(new Image());
    const bottomPipeImg = useRef(new Image());

    // Navigation
    const navigate = useNavigate();

    // Load images on component mount
    useEffect(() => {
        birdImg.current.src = '/images/flappybird.png';
        topPipeImg.current.src = '/images/toppipe.png';
        bottomPipeImg.current.src = '/images/bottompipe.png';

        Promise.all([
            new Promise(resolve => birdImg.current.onload = resolve),
            new Promise(resolve => topPipeImg.current.onload = resolve),
            new Promise(resolve => bottomPipeImg.current.onload = resolve)
        ]).then(() => setImagesLoaded(true));

        // Load high score from localStorage
        const savedHighScore = localStorage.getItem('flappyBirdHighScore');
        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore));
        }
    }, []);

    // Setup canvas context
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = boardWidth;
        canvas.height = boardHeight;
        const context = canvas.getContext('2d');
        contextRef.current = context;
    }, []);

    // Game loop and animation
    useEffect(() => {
        if (!imagesLoaded || !contextRef.current) return;

        const gravity = 0.5; // Reduced gravity for a floatier feel
        const velocityX = -4;
        const PIPE_INTERVAL = 1500;

        const placePipes = () => {
            const pipeWidth = 64;
            const pipeHeight = 529;
            const openingSpace = boardHeight / 4;
            const randomPipeY = -pipeHeight/3 - Math.random() * (pipeHeight/2.5);

            const topPipe = {
                img: topPipeImg.current,
                x: boardWidth,
                y: randomPipeY,
                width: pipeWidth,
                height: pipeHeight,
                passed: false
            };

            const bottomPipe = {
                img: bottomPipeImg.current,
                x: boardWidth,
                y: randomPipeY + pipeHeight + openingSpace,
                width: pipeWidth,
                height: pipeHeight,
                passed: false
            };

            pipesRef.current.push(topPipe, bottomPipe);
        };

        const detectCollision = (bird, pipe) => {
            return (
                bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                bird.y < pipe.y + pipe.height &&
                bird.y + bird.height > pipe.y
            );
        };

        const update = (timestamp) => {
            if (gameOver) return;

            const context = contextRef.current;
            const bird = birdRef.current;
            const pipes = pipesRef.current;

            // Generate pipes at consistent intervals
            if (!lastPipeTimeRef.current || timestamp - lastPipeTimeRef.current > PIPE_INTERVAL) {
                placePipes();
                lastPipeTimeRef.current = timestamp;
            }

            // Clear canvas
            context.clearRect(0, 0, boardWidth, boardHeight);

            // Update bird physics
            bird.velocityY += gravity;
            bird.y = Math.max(bird.y + bird.velocityY, 0);

            // Draw bird
            context.drawImage(
                birdImg.current, 
                bird.x, 
                bird.y, 
                bird.width, 
                bird.height
            );

            // Game over if bird falls
            if (bird.y > boardHeight) {
                setGameOver(true);
            }

            // Update and draw pipes
            for (let i = pipes.length - 1; i >= 0; i--) {
                const pipe = pipes[i];
                pipe.x += velocityX;

                // Draw pipe
                context.drawImage(
                    pipe.img, 
                    pipe.x, 
                    pipe.y, 
                    pipe.width, 
                    pipe.height
                );

                // Check score
                if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                    setScore(prev => prev + 0.5);
                    pipe.passed = true;
                }

                // Collision detection
                if (detectCollision(bird, pipe)) {
                    setGameOver(true);
                }
            }

            // Remove off-screen pipes
            pipesRef.current = pipes.filter(pipe => pipe.x > -pipe.width);

            // Draw score
            context.fillStyle = "white";
            context.font =  "bold 45px 'Press Start 2P', sans-serif";
            context.fillText(Math.floor(score), 170, 70);

            // Continue animation
            requestRef.current = requestAnimationFrame(update);
        };

        // Start game loop
        requestRef.current = requestAnimationFrame(update);

        // Cleanup
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [imagesLoaded, gameOver, score]);

    // Update high score
    useEffect(() => {
        if (gameOver) {
            const currentHighScore = Math.max(score, highScore);
            setHighScore(currentHighScore);
            localStorage.setItem('flappyBirdHighScore', currentHighScore);
        }
    }, [gameOver, score]);

    // Handle touch and key events
    useEffect(() => {
        const handleTouch = (e) => {
            e.preventDefault(); // Prevent default touch behavior
            const bird = birdRef.current;
            
            // Jump on touch
            bird.velocityY = -10;

            // Reset game if game over
            if (gameOver) {
                birdRef.current = {
                    x: boardWidth / 8,
                    y: boardHeight / 2,
                    width: birdWidth,
                    height: birdHeight,
                    velocityY: 0
                };
                pipesRef.current = [];
                lastPipeTimeRef.current = 0;
                setScore(0);
                // setGameOver(false);
            }
        };

        const handleKeyDown = (e) => {
            const bird = birdRef.current;
            if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
                // Higher jump velocity with less gravity
                bird.velocityY = -10;

                // Reset game if game over
                if (gameOver) {
                    birdRef.current = {
                        x: boardWidth / 8,
                        y: boardHeight / 2,
                        width: birdWidth,
                        height: birdHeight,
                        velocityY: 0
                    };
                    pipesRef.current = [];
                    lastPipeTimeRef.current = 0;
                    setScore(0);
                    setGameOver(false);
                }
            }
        };

        const canvas = canvasRef.current;
        
        // Touch events
        canvas.addEventListener('touchstart', handleTouch, { passive: false });
        canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        
        // Keyboard events
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            canvas.removeEventListener('touchstart', handleTouch);
            canvas.removeEventListener('touchmove', (e) => e.preventDefault());
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameOver]);

    // Game reset function
    const handleResetGame = () => {
        birdRef.current = {
            x: boardWidth / 8,
            y: boardHeight / 2,
            width: birdWidth,
            height: birdHeight,
            velocityY: 0
        };
        pipesRef.current = [];
        lastPipeTimeRef.current = 0;
        setScore(0);
        setGameOver(false);
    };

    // Navigate to leaderboard
    const goToNewPage = () => {
      navigate('/addtolb');
    }

    return (
        <div className="flappy-bird-container">
            <canvas 
                ref={canvasRef} 
                width={boardWidth} 
                height={boardHeight} 
                style={{
                    border: '1px solid black',
                    display: 'block',
                    margin: '0 auto',
                    touchAction: 'none' // Disable default touch behaviors
                }}
            />
            {gameOver && (
                <div className="high-score-overlay">
                    <h1>Game Over</h1>
                    <p>Your Score: {Math.floor(score)}</p>
                    <p>High Score: {Math.floor(highScore)}</p>
                    <br></br>
                    <button onClick={goToNewPage}>Add To Leaderboard</button>
                    <br></br>
                    <br></br>
                    <button onClick={handleResetGame}>Restart</button>
                </div>
            )}
        </div>
    );
};

export default FlappyBird;