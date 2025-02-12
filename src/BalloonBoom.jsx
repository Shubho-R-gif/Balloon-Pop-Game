import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Line, Ellipse, Group, Star, Rect } from "react-konva";
import Konva from "konva";
import "./BalloonBoom.css";

// Balloon component - Represents a floating balloon
const Balloon = ({ id, x, startY, color, handleBalloonClick, setScore }) => {
  const lightColors = {
    red: "#FFB3B3",
    orange: "#FFD9B3",
    yellow: "#FFEEB3",
    green: "#B3FFB3",
    teal: "#B3FFD9",
    cyan: "#B3EEFF",
    blue: "#B3D9FF",
    indigo: "#D1B3FF",
    violet: "#E8B3FF",
    pink: "#FFB3D9",
    magenta: "#FFB3EE",
  };
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state
  const balloonRef = useRef(null); // Reference to the balloon group

  useEffect(() => {
    // Function to get a random position within the allowed range
    const getRandomPosition = () => ({
      x: Math.floor(Math.random() * 250) + 50, // Random x between 60 and 300
      y: Math.floor(Math.random() * 400) + 650, // Random y between 750 and 400 (offscreen start)
    });

    const anim = new Konva.Animation((frame) => {
      if (balloonRef.current) {
        let newY = balloonRef.current.y() - 1.5; // Moves up faster than balloons
        let newX = balloonRef.current.x() + Math.sin(frame.time / 300) * 1; // Wavy motion
        // (50x) + math.sin(300/300)
        //  math.sin(1) = 0.84*2 = 50 + 1.68 = 51.68 value of newX, update to balloon current x(newX)
        // When explosion moves offscreen, reset to a random position
        // If the balloon moves offscreen (above -50), reset position and decrease score
        if (newY < -50) {
          const { x, y } = getRandomPosition();
          balloonRef.current.x(x);
          balloonRef.current.y(y);
          setScore((prevScore) => Math.max(prevScore - 1, 0));
          //Math.max Prevents negative score it doesnot fall to negative int
        } else {
          balloonRef.current.y(newY); // This sets the new position of the balloon. for.eg 850px - 1.5, 848.5px
          balloonRef.current.x(newX); // Moves the balloon left & right (wavy effect)
        }
      }
    }, balloonRef.current?.getLayer());

    anim.start(); // Start animation
    return () => anim.stop(); // Cleanup animation on unmount
  }, [setScore]);
  const handleClick = () => {
    if (isAnimating) return; // Prevent multiple clicks, multiple clicks don't trigger overlapping animations and balloon additions
    setIsAnimating(true); // Lock clicks until animation is done

    if (balloonRef.current) {
      const tween = new Konva.Tween({
        node: balloonRef.current,
        duration: 0.5,
        opacity: 0,
        scaleX: 1.3,
        scaleY: 1.3,
        onFinish: () => {
          handleBalloonClick(id);
          setIsAnimating(false); // Unlock clicks after animation finishes
        },
      });
      tween.play();
    }
  };

  return (
    <Group
      ref={balloonRef}
      x={x}
      y={startY}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Main balloon body */}
      <Ellipse
        radiusX={35}
        radiusY={40}
        fillLinearGradientStartPoint={{ x: -30, y: -50 }}
        fillLinearGradientEndPoint={{ x: 30, y: 50 }}
        fillLinearGradientColorStops={[
          0,
          "white",
          0.3,
          color,
          1,
          lightColors[color] || color,
        ]}
        stroke="black"
        strokeWidth={1.4}
      />
      {/* Highlight effect on balloon */}
      <Ellipse
        x={-10}
        y={-16}
        radiusX={14}
        radiusY={18}
        fill="white"
        opacity={0.3}
      />
      {/* Balloon knot */}
      <Line
        points={[8, 50, -8, 50, -8, 50, 0, 40]}
        fill={color}
        stroke="black"
        strokeWidth={1.6}
        closed
        opacity={0.8}
      />
      {/* String of the balloon */}
      <Line
        points={[0, 50, -20, 100, 30, 120, 0, 150]}
        stroke="white"
        strokeWidth={2.2}
        bezier
        opacity={0.8}
      />
    </Group>
  );
};

// Boom component - Represents an explosion effect
const Boom = ({ x, startY, color, handleGameOver }) => {
  const boomRef = useRef(null); // Reference to the explosion group

  useEffect(() => {
    // Function to get a random position within the allowed range
    const getRandomPosition = () => ({
      x: Math.floor(Math.random() * 160) + 100, // Random x between 160 and 200
      y: Math.floor(Math.random() * 420) + 680, // Random y between  420 and 680 (offscreen start)
    });

    const anim = new Konva.Animation(() => {
      if (boomRef.current) {
        let newY = boomRef.current.y() - 1.5; // Moves up faster than balloons
        let newRotation = boomRef.current.rotation() + 2; // Rotate slightly each frame
        //If the current rotation is 0°, after one frame, it becomes 2°.
        //After another frame, it becomes 4°, then 6°, and so on.

        // When explosion moves offscreen, reset to a random position
        if (newY < -50) {
          const { x, y } = getRandomPosition();
          boomRef.current.x(x); // Set new random x position
          newY = y; // Set new random y position
          newRotation = 0; // Reset rotation
        }
        boomRef.current.y(newY);
        boomRef.current.rotation(newRotation); // Apply rotation
      }
    }, boomRef.current?.getLayer());

    anim.start(); // Start animation
    return () => anim.stop(); // Cleanup animation on unmount
  }, []);
  const handleBoomClick = () => {
    handleGameOver();
  };
  return (
    <Group
      ref={boomRef}
      x={x}
      y={startY}
      onClick={handleBoomClick}
      onTap={handleBoomClick}
    >
      {/* Outer glow effect */}
      <Ellipse radiusX={30} radiusY={30} fill="rgba(137, 46, 46, 0.2)" />
      {/* Inner explosion color */}
      <Ellipse
        radiusX={30}
        radiusY={30}
        fill={color}
        shadowBlur={10}
        shadowOpacity={0.4}
        shadowOffset={{ x: 5, y: 5 }}
      />
      {/* Small rectangle in explosion effect */}
      <Rect
        x={-5}
        y={-40}
        width={10}
        height={10}
        fill={color}
        stroke="green"
        strokeWidth={2}
      />
      {/* Small explosion lines */}
      <Line points={[0, -52, 0, -32]} stroke="black" strokeWidth={2} />
      {/* Starburst effect */}
      <Star
        x={0}
        y={-55}
        numPoints={2}
        innerRadius={4}
        outerRadius={6}
        fill="orangered"
        stroke="red"
        strokeWidth={2}
      />
    </Group>
  );
};

// Main component that renders balloons and explosions
const BalloonBoom = ({ setScore, handleGameOver }) => {
  // Array of balloon objects with unique IDs
  // State to track visible balloons
  const [balloons, setBalloons] = useState([
    { id: 1, x: 50, startY: 850, color: "teal" },
    { id: 2, x: 110, startY: 700, color: "cyan" },
    { id: 3, x: 200, startY: 760, color: "green" },
    { id: 4, x: 250, startY: 900, color: "indigo" },
  ]);
  // Array of boom objects with unique IDs
  const booms = [
    { id: 1, x: 50, startY: 800, color: "black" },
    { id: 2, x: 175, startY: 750, color: "black" },
    { id: 3, x: 265, startY: 900, color: "black" },
  ];

  // Handle balloon click
  const handleBalloonClick = (id) => {
    setScore((prevScore) => prevScore + 1); // Increase score on balloon pop
    setBalloons((prevBalloon) => {
      // Remove the clicked balloon
      const updatedBalloons = prevBalloon.filter(
        (balloon) => balloon.id !== id
      );
      // Add a new balloon with a random position
      const newBalloon = {
        id: Math.max(...prevBalloon.map((b) => b.id), 0) + 1, // Ensure unique id
        x: Math.random() * 250 + 50, // Random x position
        startY: Math.random() * 400 + 650, // Random y position
        color: `hsl(${Math.random() * 360}, 100%, 40%)`, //get the random colors
      };
      return [...updatedBalloons, newBalloon];
    });
  };

  return (
    <Stage width={400} height={700} className="drawballoonboom">
      <Layer>
        {/* Mapping through the balloons array */}
        {balloons.map(({ id, x, startY, color }) => (
          <Balloon
            key={id}
            id={id}
            x={x}
            startY={startY}
            color={color}
            handleBalloonClick={handleBalloonClick}
            setScore={setScore}
          />
        ))}
        {/* Rendering explosion effects */}
        {booms.map(({ id, x, startY, color }) => (
          <Boom
            key={id}
            x={x}
            startY={startY}
            color={color}
            handleGameOver={handleGameOver}
          />
        ))}
      </Layer>
    </Stage>
  );
};

// Prop validation
Balloon.propTypes = {
  id: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  startY: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  handleBalloonClick: PropTypes.func.isRequired,
  setScore: PropTypes.func.isRequired,
};

Boom.propTypes = {
  x: PropTypes.number.isRequired,
  startY: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  handleGameOver: PropTypes.func.isRequired,
};

BalloonBoom.propTypes = {
  setScore: PropTypes.func.isRequired, // Ensures setScore is a function
  handleGameOver: PropTypes.func.isRequired,
};

export default BalloonBoom;
