import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

interface EdgeTriggerProps {
  onTriggerOpen: () => void;
  isOpen: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const EdgeTrigger: React.FC<EdgeTriggerProps> = ({
  onTriggerOpen,
  isOpen,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0); // pixels dragged inward (leftward)
  const [isHovered, setIsHovered] = useState(false);
  const startXRef = useRef<number>(0);
  const triggerRef = useRef<HTMLDivElement>(null);

  // 20% displacement threshold based on container width or 80px default
  const getThreshold = () => {
    if (containerRef?.current) {
      return containerRef.current.clientWidth * 0.20;
    }
    return 70;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpen) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    setDragOffset(0);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = startXRef.current - e.clientX; // positive when dragging to the left (inward)
    if (diff > 0) {
      setDragOffset(diff);
    } else {
      setDragOffset(0);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const threshold = getThreshold();
    const finalOffset = startXRef.current - e.clientX;

    setIsDragging(false);

    if (finalOffset >= threshold) {
      // Past 20% threshold: Snap Open!
      setDragOffset(0);
      onTriggerOpen();
    } else {
      // Rebuff / Spring back to edge
      setDragOffset(0);
    }
  };

  const threshold = getThreshold();
  const progressRatio = Math.min(1, dragOffset / threshold);

  if (isOpen) return null;

  return (
    <div
      ref={triggerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `translateX(-${dragOffset}px)`,
        transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-40 flex items-center select-none cursor-grab active:cursor-grabbing group touch-none"
      title="AuraDub Edge Trigger: Pressione e arraste para o centro para abrir"
    >
      {/* Visual drag guideline / hint when dragging or hovering */}
      {(isHovered || isDragging) && (
        <div
          className={`mr-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide transition-all ${
            isDragging
              ? 'bg-sky-500/90 text-white shadow-lg shadow-sky-500/30'
              : 'bg-slate-900/80 backdrop-blur-md text-sky-300 border border-sky-500/30'
          }`}
          style={{ opacity: isDragging ? Math.max(0.7, progressRatio) : 0.85 }}
        >
          <ChevronLeft className={`w-3 h-3 ${isDragging ? 'animate-pulse' : ''}`} />
          <span>
            {isDragging
              ? progressRatio >= 1
                ? 'Solte para abrir!'
                : `Puxe mais (${Math.round(progressRatio * 100)}%)`
              : 'Arraste para abrir'}
          </span>
        </div>
      )}

      {/* The 4px by 56px ultra-thin vertical pill with 20% resting opacity */}
      <div
        className="w-[4px] h-[56px] rounded-l-full transition-all duration-200"
        style={{
          backgroundColor: isDragging ? '#38bdf8' : '#38bdf8',
          opacity: isDragging
            ? Math.min(1, 0.2 + progressRatio * 0.8)
            : isHovered
            ? 0.75
            : 0.20,
          boxShadow: isDragging
            ? '0 0 12px rgba(56, 189, 248, 0.8), -2px 0 8px rgba(56, 189, 248, 0.5)'
            : isHovered
            ? '0 0 8px rgba(56, 189, 248, 0.5)'
            : 'none',
        }}
      />
    </div>
  );
};
