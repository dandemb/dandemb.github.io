
/*
 * Digital Rain Animation
 * Draws falling characters on the background canvas.
 */

function initRain() {
    // 1. Find the canvas and prepare its drawing context
    const canvas = document.getElementById("rain-canvas"); //Located in index.html

    if (!canvas) {
        console.error("Rain canvas was not found.");
        return;
    }

    const ctx = canvas.getContext("2d");

        // Find the design colours from variables.css
    const styles = getComputedStyle(document.documentElement);

    const backgroundColor = styles
        .getPropertyValue("--color-background")
        .trim();

    const rainColor = styles
        .getPropertyValue("--color-accent")
        .trim();

    const brightRainColor = styles
        .getPropertyValue("--color-accent-hover")
        .trim();

    // 2. Characters used in the digital rain
    const characters = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";
    const fontSize = 16;

    const RAIN_STEP = 70; // Time between rain updates (milliseconds)
    // Visual settings
    const RAIN_OPACITY = 0.38;
    const TEXT_ZONE_OPACITY = 0.07;
    const TRAIL_FADE = 0.18;
    
    let columns = 0;
    let drops = [];
    let speeds = [];
    let lastRain = 0;
    
    // 3. Adapt the canvas to the browser window
    function resizeCanvas() {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = window.innerWidth * pixelRatio;
        canvas.height = window.innerHeight * pixelRatio;

        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        columns = Math.ceil(window.innerWidth / fontSize);

        // Start each column at a random vertical position (no following characters' order)
        drops = [];
        speeds = [];
        
        for (let i = 0; i < columns; i++) {
            drops.push(Math.floor(Math.random() * window.innerHeight / fontSize));
            speeds.push(Math.random() * 0.5 + 0.5); // Random speed for each column
        }
    }
    // 4. Draw one frame of falling characters
    
    function drawRain() {
     // Fade previous frames to create character trails
     ctx.fillStyle = backgroundColor;
     ctx.globalAlpha = TRAIL_FADE;
     ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
     ctx.globalAlpha = 1;

     ctx.font = `${fontSize}px monospace`;
     ctx.textBaseline = "top";

     for (let i = 0; i < drops.length; i++) {
        // Only draw characters once they enter the visible screen
        if (drops[i] > 0) {
            const character = characters[
                Math.floor(Math.random() * characters.length)
            ];

            const x = i * fontSize;
            const y = Math.floor(drops[i]) * fontSize;
            
            // Determine opacity based on horizontal position
            // The left side is reserved for the main portfolio text
            const textZoneWidth = window.innerWidth * 0.55;

            const opacity = x < textZoneWidth
                ? TEXT_ZONE_OPACITY
                : RAIN_OPACITY;

            // Use the portfolio's orange palette
            ctx.fillStyle = Math.random() < 0.06
                ? brightRainColor
                : rainColor;

            ctx.globalAlpha = opacity;
            ctx.fillText(character, x, y);
            ctx.globalAlpha = 1;
        }

        // Move each column according to its own speed
        drops[i] += speeds[i];

        // Restart the column when it reaches the bottom
        if (
            drops[i] * fontSize > window.innerHeight &&
            Math.random() > 0.975
        ) {
            drops[i] = Math.random() * -20;
            speeds[i] = 0.25 + Math.random() * 0.6;
        }
    }
}

    // 5. Animation loop
    function animate(timestamp) {
    // Check whether enough time has passed for the next rain update
      if (timestamp - lastRain >= RAIN_STEP) {
          drawRain();
          lastRain = timestamp;
         }
      requestAnimationFrame(animate);
}

    // 6. Start and handle window resizing
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    animate();
}

// Start the rain animation
initRain();