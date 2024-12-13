import { motion } from 'framer-motion';

const BackgroundShapes = () => {
  // Large U-shaped bubble at top
  const mainShape = {
    size: '800px',
    initialTop: '-600px',
    finalTop: '-400px',
    left: '50%',
    transform: 'translateX(-50%)',
  };

  // Smaller ambient shapes with initial positions
  const shapes = [
    { 
      size: '120px', 
      initialX: '-100%',
      finalX: '10%',
      top: '40%', 
      delay: 0.5,
      duration: 20
    },
    { 
      size: '100px', 
      initialX: '200%',
      finalX: '20%',
      bottom: '20%', 
      delay: 0.8,
      duration: 25
    },
    { 
      size: '150px', 
      initialY: '200%',
      finalY: '30%',
      right: '15%', 
      delay: 1.2,
      duration: 22
    }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main U-shaped bubble */}
      <motion.div
        className="absolute rounded-[50%] bg-gradient-to-br from-purple-300/20 to-purple-400/25"
        initial={{ 
          width: mainShape.size,
          height: mainShape.size,
          top: mainShape.initialTop,
          left: mainShape.left,
          transform: mainShape.transform,
          opacity: 0,
          scale: 0.8
        }}
        animate={{ 
          top: mainShape.finalTop,
          opacity: 1,
          scale: 1,
          y: [0, 20, 0],
        }}
        transition={{
          duration: 2,
          y: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          border: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* Ambient shapes */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-gradient-to-br from-purple-300/20 to-purple-400/25"
          initial={{ 
            width: shape.size,
            height: shape.size,
            x: shape.initialX,
            y: shape.initialY,
            opacity: 0,
            scale: 0.5
          }}
          animate={{ 
            x: shape.finalX,
            y: shape.finalY,
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 1.5,
            delay: shape.delay,
            ease: "easeOut"
          }}
          style={{
            top: shape.top,
            right: shape.right,
            bottom: shape.bottom,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(1px)',
          }}
          whileInView={{
            x: [0, 15, 0],
            y: [0, -20, 0],
          }}
          viewport={{ once: false }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundShapes;
