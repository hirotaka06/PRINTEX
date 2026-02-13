import { useState, useEffect, type RefObject } from 'react';

export function useResizer(containerRef: RefObject<HTMLDivElement | null>, initialHeight: number = 300) {
  const [topPaneHeight, setTopPaneHeight] = useState<number>(initialHeight);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newHeight = e.clientY - containerRect.top;

      const minHeight = 100;
      const maxHeight = containerRect.height - 100;

      if (newHeight < minHeight) newHeight = minHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;

      setTopPaneHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, containerRef]);

  const startResizing = () => {
    setIsResizing(true);
  };

  return {
    topPaneHeight,
    setTopPaneHeight,
    isResizing,
    startResizing,
  };
}
