import NextTopLoader from "nextjs-toploader";
 
export default function TopLoader() {
  return (
    <div   >
      <NextTopLoader 
        color="linear-gradient(90deg, #9370DB, #40E0D0, #00FFFF)"
        initialPosition={0.08}
        crawlSpeed={400}
        height={4}               // Slightly thicker for gradient visibility
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={400}
        shadow="0 0 12px #40E0D0, 0 0 6px #9370DB"
      />
    </div>
  );
}
