import { Button } from "@/components/Button";
import { Link } from "@/i18n";
import { CircleCheckBig } from "lucide-react";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <div className="m-auto max-w-7xl flex flex-col items-center justify-center py-24 gap-6">
      <CircleCheckBig className="h-24 w-24 text-green-500" />
      <h1 className="text-4xl font-bold">Order Placed Successfully!</h1>
      {searchParams.orderId && (
        <p className="text-gray-600 text-lg">
          Your order ID is:{" "}
          <span className="font-semibold text-gray-900">
            {searchParams.orderId}
          </span>
        </p>
      )}
      <p className="text-gray-500 text-center max-w-md">
        Thank you for your purchase. We have received your order and will
        process it shortly.
      </p>

      <div className="flex justify-center mt-8">
        <Link href="/">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
