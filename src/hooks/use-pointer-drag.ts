/**
 * Pointer-drag gesture without opinion about what is being resized.
 * Products own clamp / snap / units.
 */

import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface DragOrigin {
  x: number;
  y: number;
  pointerId: number;
}

export interface PointerDragOptions {
  onMove: (event: PointerEvent, origin: DragOrigin) => void;
  onEnd?: (event: PointerEvent, origin: DragOrigin) => void;
}

export interface PointerDrag {
  onPointerDown: (event: ReactPointerEvent) => void;
  dragging: boolean;
}

export function usePointerDrag({
  onMove,
  onEnd,
}: PointerDragOptions): PointerDrag {
  const [dragging, setDragging] = useState(false);
  const originRef = useRef<DragOrigin | null>(null);
  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);
  onMoveRef.current = onMove;
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (event: PointerEvent) => {
      const origin = originRef.current;
      if (!origin || event.pointerId !== origin.pointerId) return;
      onMoveRef.current(event, origin);
    };

    const handleEnd = (event: PointerEvent) => {
      const origin = originRef.current;
      if (!origin || event.pointerId !== origin.pointerId) return;
      originRef.current = null;
      setDragging(false);
      onEndRef.current?.(event, origin);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
    };
  }, [dragging]);

  const onPointerDown = useCallback((event: ReactPointerEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    originRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    setDragging(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* capture optional */
    }
  }, []);

  return { onPointerDown, dragging };
}
