import React, { useEffect, useRef } from 'react';

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let streams = [];
    
    const fontSize = 16;
    const symbolSet = '01{}[]/\\<>*=;'.split('');

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStreams();
    };

    class Stream {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        // Snap to grid based on fontSize
        this.x = Math.floor(Math.random() * (canvas.width / fontSize)) * fontSize;
        // Start above screen, or randomly distributed if initial
        this.y = initial ? Math.random() * canvas.height : Math.random() * -500;
        this.speed = Math.random() * 1.5 + 0.5; // Smooth, slow falling speed
        this.length = Math.floor(Math.random() * 15 + 10); // Stream length
        this.chars = [];
        
        for (let i = 0; i < this.length; i++) {
          this.chars.push(this.getRandomChar());
        }
      }

      getRandomChar() {
        return symbolSet[Math.floor(Math.random() * symbolSet.length)];
      }

      update() {
        this.y += this.speed;
        
        // Reset when the tail passes the bottom of the screen
        if (this.y - (this.length * fontSize) > canvas.height) {
          this.reset();
        }

        // Randomly glitch/change some characters as they fall
        if (Math.random() < 0.05) {
          this.chars[Math.floor(Math.random() * this.length)] = this.getRandomChar();
        }
      }

      draw(color) {
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.textAlign = 'center';
        
        for (let i = 0; i < this.length; i++) {
          const charY = this.y - (i * fontSize);
          
          // Only draw if within screen bounds for performance
          if (charY > -fontSize && charY < canvas.height + fontSize) {
            // Head is more opaque, tail fades out
            const alpha = 1 - (i / this.length);
            
            ctx.globalAlpha = alpha * 0.15; // Max opacity 0.15 so it's very subtle
            ctx.fillStyle = color;
            
            // The head (first char) can be slightly brighter
            if (i === 0) {
               ctx.globalAlpha = 0.25;
            }
            
            ctx.fillText(this.chars[i], this.x, charY);
          }
        }
      }
    }

    const initStreams = () => {
      streams = [];
      // Density based on screen width
      const numberOfStreams = Math.floor(canvas.width / (fontSize * 1.5)); 
      for (let i = 0; i < numberOfStreams; i++) {
        streams.push(new Stream());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const style = getComputedStyle(document.body);
      const accentColor = style.getPropertyValue('--accent').trim() || '#00d2ff';

      streams.forEach(stream => {
        stream.update();
        stream.draw(accentColor);
      });
      
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialization
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BackgroundAnimation;
