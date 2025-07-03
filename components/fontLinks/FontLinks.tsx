export default function FontLinks() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Preload Custom Fonts */}
      <link
        rel="preload"
        href="/fonts/century-gothic/centurygothic.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Montserrat/Montserrat-Regular.woff"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/century-schoolbook/SCHLBKB.woff"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/century-725/century-725-cn-bt.woff"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
    </>
  );
}
