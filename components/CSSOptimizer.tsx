"use client";

import { useEffect } from "react";

/**
 * CSS Optimizer Component
 * 
 * This component helps reduce render-blocking CSS by:
 * 1. Deferring non-critical CSS using the print media trick
 * 2. Converting render-blocking stylesheets to async loading
 * 3. Optimizing CSS chunk loading after initial render
 * 
 * Works in conjunction with Next.js 14's optimizeCss: true build-time optimization
 */
export default function CSSOptimizer() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Function to defer CSS loading (non-blocking technique)
    const deferCSS = (link: HTMLLinkElement) => {
      // Use the print media trick to load CSS asynchronously
      // This prevents the CSS from blocking render
      const originalMedia = link.media || "all";
      
      // Set to print media first (browsers don't block on print media)
      link.media = "print";
      link.setAttribute("onload", `this.media='${originalMedia}'`);
      
      // Fallback for browsers that don't support onload on link elements
      if (!link.onload) {
        const script = document.createElement("script");
        script.textContent = `
          var link = document.querySelector('link[href="${link.href}"]');
          if (link) link.media = '${originalMedia}';
        `;
        document.head.appendChild(script);
      }
    };

    // Optimize CSS loading
    const optimizeCSS = () => {
      // Find all stylesheet links that are render-blocking
      const stylesheets = Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
      );

      stylesheets.forEach((link) => {
        // Skip if already optimized
        if (link.dataset.deferred === "true") return;

        const href = link.href;

        // Only defer non-critical CSS chunks
        // Skip:
        // - Inline styles (data URIs)
        // - Critical CSS marked explicitly
        // - CSS that's already been loaded
        if (
          href &&
          !href.includes("data:") &&
          !link.hasAttribute("data-critical") &&
          !link.hasAttribute("data-inline") &&
          (link.media === "all" || !link.media)
        ) {
          // Check if this is a Next.js CSS chunk (usually contains hash in filename)
          // We can defer these as they're typically non-critical after initial render
          const isNextJSCSSChunk = /\/_next\/static\/css\/[^/]+\.css/.test(href);
          
          if (isNextJSCSSChunk) {
            // Mark as deferred
            link.dataset.deferred = "true";
            
            // Defer loading using print media trick
            deferCSS(link);
          }
        }
      });
    };

    // Run optimization after a short delay to let critical CSS load first
    // This ensures the above-the-fold content renders quickly
    const timeoutId = setTimeout(() => {
      optimizeCSS();
      
      // Also run on next frame to catch any dynamically added stylesheets
      requestAnimationFrame(optimizeCSS);
    }, 0);

    // Also optimize when DOM is fully ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", optimizeCSS);
    }

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("DOMContentLoaded", optimizeCSS);
    };
  }, []);

  return null; // Component doesn't render anything
}

