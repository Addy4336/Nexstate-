import Hero from "@/components/home/Hero";
import ProcessFlow from "@/components/home/ProcessFlow";
import SalesManagement from "@/components/home/SalesManagement";
import EverythingApp from "@/components/home/EverythingApp";
import LiveDataCalculator from "@/components/home/LiveDataCalculator";
import HomeTenants from "./tenants/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative font-sans">
      {/* <Hero />
      <ProcessFlow />
      <SalesManagement />
      <EverythingApp />
      <LiveDataCalculator /> */}
      <HomeTenants />
    </main>
  );
}
