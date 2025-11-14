export default function FontLinks() {
  return (
    <>
      {/* Preload only the most critical font with high priority */}
      {/* Other fonts will load asynchronously to reduce critical path */}
      <link
        rel="preload"
        href="/fonts/century-gothic/centurygothic.ttf"
        as="font"
        type="font/truetype"
        crossOrigin="anonymous"
        fetchPriority="high"
      />
      {/* Defer non-critical fonts - they will load after initial render */}
      <link
        rel="preload"
        href="/fonts/Montserrat/Montserrat-Regular.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
        fetchPriority="low"
      />
      
      {/* Preload other fonts with low priority to avoid blocking */}
      <link
        rel="preload"
        href="/fonts/century-schoolbook/SCHLBKB.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
        fetchPriority="low"
      />
      <link
        rel="preload"
        href="/fonts/century-725/century-725-cn-bt.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
        fetchPriority="low"
      />
      <link
        rel="preload"
        href="/fonts/Poppins/Poppins-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
        fetchPriority="low"
      />
      <link
        rel="preload"
        href="/fonts/Poppins/Poppins-Bold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
        fetchPriority="low"
      />
    </>
  );
}
