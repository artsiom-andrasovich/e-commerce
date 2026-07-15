import { Container } from "@/components/Container";
import { HeaderWithBack } from "@/components/HeaderWithBack";
import { OrdersList } from "@/containers/OrdersList/OrdersList";
import { fetchMyOrders } from "@/containers/OrdersList/orders.actions";

export default async function OrdersPage() {
  const ordersResponse = await fetchMyOrders(1, 5);

  const initialOrders = ordersResponse?.data || [];
  const initialNextPage = ordersResponse?.nextPage || null;

  return (
    <div className="pb-20">
      <HeaderWithBack />
      <Container className="mt-8">
        <OrdersList initialOrders={initialOrders} initialNextPage={initialNextPage} />
      </Container>
    </div>
  );
}
