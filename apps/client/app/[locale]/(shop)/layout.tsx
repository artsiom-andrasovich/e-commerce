import { Container } from "@/components/Container";
import { Footer } from "@/containers/Footer";
import { Header } from "@/containers/Header";
import { Sidebar } from "@/containers/Sidebar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Container className="flex-1 items-stretch flex px-2 mt-4 gap-4">
        <Sidebar />
        <main className="flex-1 pb-8">{children}</main>
      </Container>
      <Footer />
    </>
  );
}
