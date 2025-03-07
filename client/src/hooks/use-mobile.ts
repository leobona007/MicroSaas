import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current viewport is mobile size
 * @param breakpoint The width threshold in pixels to consider as mobile (default: 768)
 * @returns boolean indicating if the viewport is mobile size
 */
export function useMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsMobile(window.innerWidth < breakpoint);

    // Handler for window resize events
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}