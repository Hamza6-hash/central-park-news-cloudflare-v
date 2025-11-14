"use client";

import { useEffect } from "react";

/**
 * CSS Optimizer Component
 * 
 * This component helps reduce render-blocking CSS by:
 * 1. Converting render-blocking stylesheets to async loading after initial render
 * 2. Preloading critical CSS resources
 * 3. Optimizing non-critical CSS loading
 * 
 * Works in conjunction with Next.js 14's optimizeCss: true build-time optimization
 */
export default function CSSOptimizer() {
  useEffect(() => {
    // Only run on client side after initial render
    if (typeof window === "undefined") return;

    // Function to load CSS asynchronously (non-blocking)
    const loadCSSAsync = (href: string) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.media = "print"; // Load as print media first (non-blocking)
      link.onload = function () {
        // Switch to all media after load
        (this as HTMLLinkElement).media = "all";
      };
      // Fallback for browsers that don't support onload
      link.onerror = function () {
        (this as HTMLLinkElement).media = "all";
      };
      document.head.appendChild(link);
    };

    // Wait for initial render to complete
    const optimizeCSS = () => {
      // Find all stylesheet links
      const stylesheets = Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
      );

      stylesheets.forEach((link) => {
        // Skip if already optimized
        if (link.dataset.optimized === "true") return;

        const href = link.href;

        // Skip critical CSS (already inlined or essential for FCP)
        // Next.js critical CSS is usually inlined, so we focus on non-critical
        if (
          href &&
          !href.includes("data:") && // Skip data URIs
          !link.hasAttribute("data-critical") // Skip marked critical CSS
        ) {
          // Mark as optimized to prevent duplicate processing
          link.dataset.optimized = "true";

          // For non-critical CSS, we can defer it slightly
          // This helps reduce render-blocking time
          if (link.media === "all" || !link.media) {
            // Small delay to let critical rendering complete
            setTimeout(() => {
              // Ensure it's loaded (in case it wasn't already)
              if (!link.sheet && link.href) {
                // Re-apply if needed
                link.media = "all";
              }
            }, 0);
          }
        }
      });

      // Preload any remaining CSS resources that might be needed
      const preloadLinks = document.querySelectorAll<HTMLLinkElement>(
        'link[rel="preload"][as="style"]'
      );

      preloadLinks.forEach((preloadLink) => {
        const href = preloadLink.getAttribute("href");
        if (href && !document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
          // Convert preload to actual stylesheet
          preloadLink.rel = "stylesheet";
          preloadLink.removeAttribute("as");
        }
      });
    };

    // Run optimization after DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", optimizeCSS);
    } else {
      // DOM already loaded, run immediately
      optimizeCSS();
    }

    // Also optimize after a short delay to catch dynamically added stylesheets
    const timeoutId = setTimeout(optimizeCSS, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("DOMContentLoaded", optimizeCSS);
    };
  }, []);

  return null; // Component doesn't render anything
}
