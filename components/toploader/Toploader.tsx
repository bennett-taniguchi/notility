import NextTopLoader from "nextjs-toploader";

export default function TopLoader() {
  return (
    <div  >
      <NextTopLoader 
      
        color="#50C878"
        initialPosition={0.08}
        crawlSpeed={400}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={400}
        shadow="0 0 10px #2299DD,0 0 5px #2299DD"
      />
    </div>
  );
}
