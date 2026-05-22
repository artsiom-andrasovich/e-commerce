import { Container } from '@/components/container';
import { Sidebar } from '@/components/sidebar';

export default function Home() {
  return (
    <>
      <Sidebar />
      <Container className="flex flex-1 items-stretch"></Container>
    </>
  );
}
