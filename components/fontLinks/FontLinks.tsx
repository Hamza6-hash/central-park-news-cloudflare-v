export default function FontLinks() {
  return (
    <>
      {/* Preload images */}

      <link
        rel="preload"
        href="/fonts/century-schoolbook/SCHLBKB.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/century-725/century-725-cn-bt.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Poppins-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Poppins-Bold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

    </>
  );
}
