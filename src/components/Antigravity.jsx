import { useEffect, useRef } from "react";

export default function Antigravity({
  count = 750,
  magnetRadius = 10,
  ringRadius = 5,
  waveSpeed = 1.2,
  waveAmplitude = 2.9,
  particleSize = 2,
  lerpSpeed = 0.35,
  color = "#FF9FFC",
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 1.5,
  depthFactor = 1.8,
  pulseSpeed = 3,
  particleShape = "capsule",
  fieldStrength = 10,
}) {
  const canvasRef = useRef(null);
  const hostRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let rafId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles = Array.from({ length: count }, (_, index) => {
      const depth = 0.25 + Math.random() * depthFactor;
      const angle = (index / count) * Math.PI * 2;
      return {
        angle,
        phase: Math.random() * Math.PI * 2,
        depth,
        radiusOffset: (Math.random() - 0.5) * ringRadius,
        x: 0,
        y: 0,
      };
    });

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointerRef.current.x = width / 2;
      pointerRef.current.y = height / 2;
    };

    resize();

    const observer = new ResizeObserver(() => resize());
    observer.observe(host);

    const setPointer = (event) => {
      const rect = host.getBoundingClientRect();
      pointerRef.current.x = event.clientX - rect.left;
      pointerRef.current.y = event.clientY - rect.top;
      pointerRef.current.active = true;
    };

    const clearPointer = () => {
      pointerRef.current.active = false;
    };

    host.addEventListener("pointermove", setPointer);
    host.addEventListener("pointerenter", setPointer);
    host.addEventListener("pointerleave", clearPointer);

    const render = (time) => {
      const { width, height } = host.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const pulse = 1 + Math.sin((time / 1000) * pulseSpeed) * 0.05;
      const baseOrbit = Math.min(width, height) * 0.28 + ringRadius * 4;
      const mouse = pointerRef.current;
      const magnetRadiusPx = Math.max(36, magnetRadius * 10);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];

        if (autoAnimate) {
          particle.angle += rotationSpeed * 0.0008 * (0.45 + particle.depth * 0.25);
        }

        const wave = Math.sin((time / 1000) * waveSpeed + particle.phase) * waveAmplitude;
        const orbit = (baseOrbit + particle.radiusOffset + wave * 9) * (0.66 + particle.depth * 0.4) * pulse;

        let targetX = centerX + Math.cos(particle.angle) * orbit;
        let targetY = centerY + Math.sin(particle.angle) * orbit;

        const focusX = mouse.active ? mouse.x : centerX;
        const focusY = mouse.active ? mouse.y : centerY;

        const deltaX = targetX - focusX;
        const deltaY = targetY - focusY;
        const dist = Math.hypot(deltaX, deltaY);

        if (dist < magnetRadiusPx && dist > 0.001) {
          const force = (1 - dist / magnetRadiusPx) * fieldStrength * (0.7 + particle.depth * 0.2);
          targetX += (deltaX / dist) * force;
          targetY += (deltaY / dist) * force;
        }

        particle.x += (targetX - particle.x) * Math.min(1, lerpSpeed * 0.12);
        particle.y += (targetY - particle.y) * Math.min(1, lerpSpeed * 0.12);

        const size = Math.max(0.9, particleSize + (Math.random() - 0.5) * particleVariance + particle.depth * 0.4);
        const alpha = 0.28 + particle.depth * 0.35;
        ctx.fillStyle = hexToRgba(color, alpha);

        if (particleShape === "capsule") {
          const widthSize = size * 2.4;
          const heightSize = size * 1.15;
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.angle);
          roundRect(ctx, -widthSize / 2, -heightSize / 2, widthSize, heightSize, heightSize / 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      host.removeEventListener("pointermove", setPointer);
      host.removeEventListener("pointerenter", setPointer);
      host.removeEventListener("pointerleave", clearPointer);
    };
  }, [
    autoAnimate,
    color,
    count,
    depthFactor,
    fieldStrength,
    lerpSpeed,
    magnetRadius,
    particleShape,
    particleSize,
    particleVariance,
    pulseSpeed,
    ringRadius,
    rotationSpeed,
    waveAmplitude,
    waveSpeed,
  ]);

  return (
    <div ref={hostRef} className="antigravity-host" aria-hidden="true">
      <canvas ref={canvasRef} className="antigravity-canvas" />
    </div>
  );
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => char + char)
        .join("")
    : normalized;

  const r = Number.parseInt(value.slice(0, 2), 16) || 255;
  const g = Number.parseInt(value.slice(2, 4), 16) || 255;
  const b = Number.parseInt(value.slice(4, 6), 16) || 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
