export default function FontLinks() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/Blockchain-Default.webp"
        fetchPriority="high"
      />
      {/* Google Fonts */}
      {/* <link rel="preconnect" href="https://fonts.googleapis.com" /> */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
        rel="stylesheet"
      /> */}

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
        href="/fonts/Montserrat/Montserrat-Regular.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/century-schoolbook/SCHLBKB.TTF"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/century-725/century-725-cn-bt.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
    </>
  );
}
