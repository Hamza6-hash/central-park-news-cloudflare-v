'use client'
import { useEffect } from 'react';

export default function DisableDevTools() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // Disable developer tools keys
    // @ts-ignore
    const handleKeyDown = (e) => {
      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault();
      }

      // Disable Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j')) {
        e.preventDefault();
      }

      // Disable Ctrl+U (view source)
      if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null; // This component does not render anything
}

