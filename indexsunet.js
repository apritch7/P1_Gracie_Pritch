/**
 * Western Sunset Color Play - Procedural sunset with color dials
 * No image required - draws a western landscape scene with canvas
 */

const canvas = document.getElementById('sunsetCanvas');
const ctx = canvas.getContext('2d');

// State
let state = {
    hue: 0,
    saturation: 100,
    warmth: 100,
    brightness: 100
};

// Cloud animation: pixels per second
const CLOUD_SPEED = 25;

// Resize canvas to fill viewport
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

// Ground starts here—color dials do NOT affect the ground
const GROUND_START = 0.65;

let animationId = null;

function draw() {
    const w = canvas.width;
    const h = canvas.height;
    const groundY = h * GROUND_START;

    // Cloud offset for horizontal drift (loops)
    const cloudOffset = ((performance.now() / 1000) * CLOUD_SPEED) % (w + w * 0.4);

    // Draw full scene to offscreen (unfiltered)
    const offscreenUnfiltered = document.createElement('canvas');
    offscreenUnfiltered.width = w;
    offscreenUnfiltered.height = h;
    drawWesternSunsetToContext(offscreenUnfiltered.getContext('2d'), w, h, cloudOffset);

    // Create filtered version (sky + mountains only)
    const offscreenFiltered = document.createElement('canvas');
    offscreenFiltered.width = w;
    offscreenFiltered.height = h;
    const filterCtx = offscreenFiltered.getContext('2d');
    const filterStr = `hue-rotate(${state.hue}deg) saturate(${state.saturation}%) brightness(${state.brightness}%)` +
        (state.warmth > 100 ? ` sepia(${Math.min(0.3, (state.warmth - 100) / 200)})` : '');
    filterCtx.filter = filterStr;
    filterCtx.drawImage(offscreenUnfiltered, 0, 0);

    // Draw filtered scene (sky + mountains) to main canvas
    ctx.drawImage(offscreenFiltered, 0, 0, w, h, 0, 0, w, h);

    // Restore unfiltered ground on top
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, groundY, w, h - groundY);
    ctx.clip();
    ctx.drawImage(offscreenUnfiltered, 0, 0, w, h, 0, 0, w, h);
    ctx.restore();

    // Continue animation loop
    animationId = requestAnimationFrame(draw);
}

// Draw western sunset to a given context
function drawWesternSunsetToContext(ctx, w, h, cloudOffset = 0) {
    const grd = ctx.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#1a0a2e');
    grd.addColorStop(0.2, '#2d1b4e');
    grd.addColorStop(0.4, '#6b2d5c');
    grd.addColorStop(0.6, '#c94b3a');
    grd.addColorStop(0.75, '#e8a030');
    grd.addColorStop(0.9, '#f5d56e');
    grd.addColorStop(1, '#d48438');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    const sunX = w * 0.75;
    const sunY = h * 0.72;
    const sunRad = Math.min(w, h) * 0.12;

    const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRad * 3);
    sunGlow.addColorStop(0, 'rgba(255, 230, 150, 0.95)');
    sunGlow.addColorStop(0.3, 'rgba(255, 180, 80, 0.6)');
    sunGlow.addColorStop(0.6, 'rgba(255, 100, 50, 0.2)');
    sunGlow.addColorStop(1, 'rgba(200, 60, 30, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRad * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 240, 200, 0.98)';
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRad, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(40, 25, 35, 0.95)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, h * 0.5);
    ctx.lineTo(w * 0.15, h * 0.65);
    ctx.lineTo(w * 0.25, h * 0.55);
    ctx.lineTo(w * 0.35, h * 0.6);
    ctx.lineTo(w * 0.5, h * 0.45);
    ctx.lineTo(w * 0.6, h * 0.5);
    ctx.lineTo(w, h * 0.4);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(30, 18, 28, 0.98)';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h);
    ctx.lineTo(w * 0.55, h * 0.6);
    ctx.lineTo(w * 0.7, h * 0.55);
    ctx.lineTo(w * 0.85, h * 0.7);
    ctx.lineTo(w, h * 0.65);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    const groundGrd = ctx.createLinearGradient(0, h * 0.7, 0, h);
    groundGrd.addColorStop(0, 'rgba(80, 45, 35, 0.9)');
    groundGrd.addColorStop(0.5, 'rgba(60, 35, 30, 0.95)');
    groundGrd.addColorStop(1, 'rgba(40, 25, 25, 1)');
    ctx.fillStyle = groundGrd;
    ctx.fillRect(0, h * 0.65, w, h);

    // Stylized clouds (cream/teal with horizontal line texture) - drift right, seamless loop
    const loopW = w + w * 0.5;
    const clouds = [
        { baseX: w * 0.2, y: h * 0.22, width: w * 0.35, height: h * 0.12 },
        { baseX: w * 0.55, y: h * 0.32, width: w * 0.28, height: h * 0.1 },
        { baseX: w * 0.7, y: h * 0.18, width: w * 0.22, height: h * 0.09 }
    ];
    clouds.forEach(c => {
        const x = (c.baseX + cloudOffset) % loopW;
        drawStyledCloud(ctx, x, c.y, c.width, c.height);
        if (x + c.width > w) drawStyledCloud(ctx, x - loopW, c.y, c.width, c.height);
    });
}

// Draw cumulus-style cloud with cream/teal colors and horizontal line texture
function drawStyledCloud(ctx, x, y, width, height) {
    const midY = y + height * 0.5;

    // Cloud path: rounded bumps on top, flatter wavy bottom
    const cloudPath = new Path2D();
    cloudPath.moveTo(x + width * 0.1, midY);
    cloudPath.bezierCurveTo(x, midY, x, y + height * 0.2, x + width * 0.2, y + height * 0.15);
    cloudPath.bezierCurveTo(x + width * 0.25, y, x + width * 0.4, y + height * 0.08, x + width * 0.5, y + height * 0.12);
    cloudPath.bezierCurveTo(x + width * 0.65, y, x + width * 0.75, y + height * 0.1, x + width * 0.85, y + height * 0.15);
    cloudPath.bezierCurveTo(x + width, y + height * 0.2, x + width, midY, x + width * 0.9, midY);
    cloudPath.bezierCurveTo(x + width * 0.95, midY + height * 0.15, x + width * 0.7, midY + height * 0.1, x + width * 0.5, midY + height * 0.12);
    cloudPath.bezierCurveTo(x + width * 0.3, midY + height * 0.1, x + width * 0.1, midY + height * 0.15, x + width * 0.1, midY);
    cloudPath.closePath();

    // Fill with cream (top) to pale teal (bottom) gradient
    const cloudGrd = ctx.createLinearGradient(x, y, x, y + height);
    cloudGrd.addColorStop(0, '#f5f0d8');
    cloudGrd.addColorStop(0.4, '#ebe5cc');
    cloudGrd.addColorStop(0.7, '#d4e8e2');
    cloudGrd.addColorStop(1, '#b8d4cc');
    ctx.fillStyle = cloudGrd;
    ctx.fill(cloudPath);

    // Horizontal line texture (clipped to cloud shape)
    ctx.save();
    ctx.clip(cloudPath);
    ctx.strokeStyle = 'rgba(180, 170, 150, 0.35)';
    ctx.lineWidth = 1;
    const lineSpacing = 3;
    for (let ly = y; ly < y + height; ly += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(x - 5, ly);
        ctx.lineTo(x + width + 5, ly);
        ctx.stroke();
    }
    ctx.restore();

    // Soft outline
    ctx.strokeStyle = 'rgba(200, 195, 175, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke(cloudPath);
}

// Dial handlers
function bindDials() {
    const hueDial = document.getElementById('hueDial');
    const saturationDial = document.getElementById('saturationDial');
    const warmthDial = document.getElementById('warmthDial');
    const brightnessDial = document.getElementById('brightnessDial');

    hueDial.addEventListener('input', (e) => {
        state.hue = parseInt(e.target.value, 10);
        document.getElementById('hueValue').textContent = state.hue + '°';
    });

    saturationDial.addEventListener('input', (e) => {
        state.saturation = parseInt(e.target.value, 10);
        document.getElementById('saturationValue').textContent = state.saturation + '%';
    });

    warmthDial.addEventListener('input', (e) => {
        state.warmth = parseInt(e.target.value, 10);
        document.getElementById('warmthValue').textContent = state.warmth + '%';
    });

    brightnessDial.addEventListener('input', (e) => {
        state.brightness = parseInt(e.target.value, 10);
        document.getElementById('brightnessValue').textContent = state.brightness + '%';
    });
}

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
    state = {
        hue: 0,
        saturation: 100,
        warmth: 100,
        brightness: 100
    };
    document.getElementById('hueDial').value = 0;
    document.getElementById('saturationDial').value = 100;
    document.getElementById('warmthDial').value = 100;
    document.getElementById('brightnessDial').value = 100;
    document.getElementById('hueValue').textContent = '0°';
    document.getElementById('saturationValue').textContent = '100%';
    document.getElementById('warmthValue').textContent = '100%';
    document.getElementById('brightnessValue').textContent = '100%';
});

// Init
function init() {
    if (animationId) cancelAnimationFrame(animationId);
    resizeCanvas();
}
bindDials();
window.addEventListener('resize', init);
init();
