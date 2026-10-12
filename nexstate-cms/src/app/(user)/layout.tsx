import { Header } from "@/components/user/Header";
import { Footer } from "@/components/user/Footer";
import { AIAssistant } from "@/components/user/AIAssistant";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>{children}</main>
            <Footer />
            <AIAssistant />
        </div>
    );
}
