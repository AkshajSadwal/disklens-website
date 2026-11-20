"use client";

import { useEffect, useRef } from "react";

const textAreas = [
  ".hero-copy",
  ".scan-section .chapter-title",
  ".scan-steps button",
  ".insight-title > *",
  ".privacy-layout .chapter-title",
  ".faq-layout > *",
].join(", ");

function measureField(landing, width, height) {
  const bounds = landing.getBoundingClientRect();
  const section = (selector) => {
    const rect = landing.querySelector(selector).getBoundingClientRect();
    return { top: rect.top - bounds.top, height: rect.height };
  };
  const hero = section(".hero");
  const scan = section("#how-it-works");
  const insights = section("#features");
  const privacy = section("#privacy");
  const showcase = section("#showcase");
  const download = section("#download");
  const faq = section("#faq");

  // Each row describes a cross-section of one continuous ribbon in document space.
  // The final column controls how far the green and blue strands fan out.
  const knots = [
    [-height * .26, 1.24, .12],
    [hero.height * .24, .91, .13],
    [hero.height * .57, .49, .064],
    [hero.height * .94, .77, .14],
    [scan.top + scan.height * .22, .96, .16],
    [scan.top + scan.height * .65, .57, .12],
    [insights.top + insights.height * .23, .87, .18],
    [insights.top + insights.height * .72, .63, .13],
    [privacy.top + privacy.height * .52, .83, .13],
    [showcase.top + showcase.height * .48, .59, .16],
    [download.top + download.height * .43, .31, .20],
    [download.top + download.height * .9, .73, .17],
    [faq.top + faq.height * .56, 1.09, .13],
    [bounds.height + height * .3, 1.31, .16],
  ];

  const count = width < 680 ? 26 : 42;
  const strands = Array.from({ length: count }, (_, index) => {
    const lane = index / (count - 1) * 2 - 1;
    const points = knots.map(([y, center, spread], knot) => ({
      y,
      x: (center + lane * spread + Math.sin(knot * 1.7 + index * .8) * .014) * width,
    }));
    return buildStrand(points, index);
  });

  const masks = Array.from(landing.querySelectorAll(textAreas), (element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left - bounds.left, y: rect.top - bounds.top, width: rect.width, height: rect.height };
  });

  return {
    strands,
    masks,
    top: window.scrollY + bounds.top,
    left: bounds.left,
    fades: [
      { start: showcase.top - 200, end: showcase.top, from: 0, to: 1 },
      { start: showcase.top + showcase.height, end: showcase.top + showcase.height + 195, from: 1, to: 0 },
      { start: bounds.height - 145, end: bounds.height, from: 0, to: 1 },
    ],
  };
}

function buildStrand(knots, index) {
  const path = new Path2D();
  const samples = [];
  let length = 0;

  // A shared slope at each join gives both cubic segments the same tangent.
  const slopes = knots.map((point, i) => {
    const previous = knots[Math.max(0, i - 1)];
    const next = knots[Math.min(knots.length - 1, i + 1)];
    return (next.x - previous.x) / (next.y - previous.y);
  });

  path.moveTo(knots[0].x, knots[0].y);
  let last = { ...knots[0], distance: 0 };
  samples.push(last);

  for (let i = 1; i < knots.length; i++) {
    const start = knots[i - 1];
    const end = knots[i];
    const rise = end.y - start.y;
    const firstControl = start.x + slopes[i - 1] * rise / 3;
    const secondControl = end.x - slopes[i] * rise / 3;
    path.bezierCurveTo(firstControl, start.y + rise / 3, secondControl, end.y - rise / 3, end.x, end.y);

    const count = Math.ceil(Math.max(rise, Math.abs(end.x - start.x)) / 7);
    for (let step = 1; step <= count; step++) {
      const t = step / count;
      const remaining = 1 - t;
      const x = remaining ** 3 * start.x + 3 * remaining ** 2 * t * firstControl +
        3 * remaining * t ** 2 * secondControl + t ** 3 * end.x;
      const y = start.y + rise * t;
      length += Math.hypot(x - last.x, y - last.y);
      last = { x, y, distance: length };
      samples.push(last);
    }
  }

  const blue = index % 8 < 2;
  const accent = index % 4 === 0;
  const color = blue ? "68, 175, 255" : "172, 239, 52";
  return {
    path, samples, length, accent, color,
    stroke: `rgba(${color}, ${accent ? .32 : .13})`,
    glow: index % 5 === 0,
    speed: 145 + index % 7 * 14,
    spacing: 415 + index % 9 * 28,
    offset: index * 121,
  };
}

function locate(samples, key, value) {
  let low = 0;
  let high = samples.length - 1;
  while (high - low > 1) {
    const middle = (high + low) >>> 1;
    if (samples[middle][key] <= value) low = middle;
    else high = middle;
  }
  return [samples[low], samples[high]];
}

function positionAt(samples, distance) {
  const [start, end] = locate(samples, "distance", distance);
  const progress = (distance - start.distance) / (end.distance - start.distance);
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
  };
}

function paintStrand(context, strand, top, bottom, time) {
  const { path, samples, length, accent, color, speed, spacing, offset } = strand;
  if (strand.glow) {
    for (const [width, opacity] of [[68, .015], [30, .027], [9, .065]]) {
      context.strokeStyle = `rgba(${color}, ${opacity * (1 + .13 * Math.sin(time * 1.3 + offset))})`;
      context.lineWidth = width;
      context.stroke(path);
    }
  }
  context.strokeStyle = strand.stroke;
  context.lineWidth = accent ? 1.15 : .62;
  context.stroke(path);

  // Only sample particles near the viewport. Their phase belongs to the strand.
  const [first] = locate(samples, "y", top - 65);
  const [, last] = locate(samples, "y", bottom + 65);
  const phase = (time * speed + offset) % spacing;
  const start = phase + Math.max(0, Math.ceil((first.distance - phase) / spacing)) * spacing;
  const limit = Math.min(length, last.distance);
  for (let distance = start; distance < limit; distance += spacing) {
    const opacity = Math.min(1, distance / 95, (length - distance) / 95) * (accent ? .87 : .44);
    const tailDistance = Math.max(0, distance - (accent ? 39 : 16));
    const head = positionAt(samples, distance);
    const tail = positionAt(samples, tailDistance);
    const middle = positionAt(samples, (distance + tailDistance) / 2);
    context.strokeStyle = context.fillStyle = `rgba(${color}, ${opacity})`;
    context.lineWidth = accent ? 1.8 : .9;
    context.beginPath();
    context.moveTo(tail.x, tail.y);
    context.quadraticCurveTo(2 * middle.x - (tail.x + head.x) / 2, 2 * middle.y - (tail.y + head.y) / 2, head.x, head.y);
    context.stroke();
    context.beginPath();
    context.arc(head.x, head.y, accent ? 1.9 : .9, 0, Math.PI * 2);
    context.fill();
  }
}

function softenBehindContent(context, field, width, top, bottom) {
  context.globalCompositeOperation = "destination-out";
  for (const mask of field.masks) {
    if (mask.y > bottom + 60 || mask.y + mask.height < top - 60) continue;
    // Low-opacity, nested rounded shapes keep the edge soft even while scrolling.
    for (const inset of [56, 45, 34, 23, 12, 1]) {
      context.fillStyle = "rgba(0, 0, 0, .25)";
      context.beginPath();
      context.roundRect(mask.x - inset, mask.y - inset, mask.width + 2 * inset, mask.height + 2 * inset, inset + 16);
      context.fill();
    }
  }
  for (const fade of field.fades) {
    if (fade.end < top || fade.start > bottom) continue;
    const gradient = context.createLinearGradient(0, fade.start, 0, fade.end);
    gradient.addColorStop(0, `rgba(0,0,0,${fade.from})`);
    gradient.addColorStop(1, `rgba(0,0,0,${fade.to})`);
    context.fillStyle = gradient;
    context.fillRect(-Math.abs(field.left), fade.start, width + Math.abs(field.left), fade.end - fade.start);
  }
}

export default function LightTrails() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const landing = canvas.parentElement;
    const context = canvas.getContext("2d");
    if (!context) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let field, width, height, frameId;
    let lastPaint;
    let time = 0;

    function measure() {
      if (preference.matches) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      field = measureField(landing, width, height);
    }

    function draw(timestamp) {
      frameId = requestAnimationFrame(draw);
      if (!field || (lastPaint !== undefined && timestamp - lastPaint < 22)) return;
      if (lastPaint !== undefined) time += (timestamp - lastPaint) / 1000;
      lastPaint = timestamp;
      const top = window.scrollY - field.top;
      const bottom = top + height;

      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(field.left, -top);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.globalCompositeOperation = "lighter";
      for (const strand of field.strands) paintStrand(context, strand, top, bottom, time);
      softenBehindContent(context, field, width, top, bottom);
      context.restore();
    }

    function syncMotion() {
      cancelAnimationFrame(frameId);
      lastPaint = undefined;
      if (preference.matches || document.hidden) {
        context.clearRect(0, 0, width, height);
        return;
      }
      measure();
      frameId = requestAnimationFrame(draw);
    }

    const layout = new ResizeObserver(measure);
    layout.observe(landing);
    syncMotion();
    window.addEventListener("resize", measure);
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    return () => {
      cancelAnimationFrame(frameId);
      layout.disconnect();
      window.removeEventListener("resize", measure);
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
    };
  }, []);

  return <canvas ref={canvasRef} className="light-trails" aria-hidden="true" />;
}
