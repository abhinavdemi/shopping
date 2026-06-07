import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

type OrderItem = {
  id: string;
  quantity: number;
  price_cents: number;
  product: { name: string; slug: string } | null;
};

type Order = {
  id: string;
  status: string;
  total_cents: number;
  created_at: string;
  order_items: OrderItem[];
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, status, total_cents, created_at, order_items(id, quantity, price_cents, product:products(name, slug))",
    )
    .eq("id", id)
    .maybeSingle()
    .returns<Order>();

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="size-12 text-emerald-600" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Order placed — thank you!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Order #{order.id.slice(0, 8)} ·{" "}
          {new Date(order.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <Badge variant="secondary" className="mt-3 capitalize">
          {order.status}
        </Badge>
      </div>

      <div className="mt-8 rounded-xl border p-5">
        <h2 className="font-semibold">Items</h2>
        <Separator className="my-4" />
        <ul className="flex flex-col gap-3">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <span>
                {item.product?.name ?? "Product no longer available"}{" "}
                <span className="text-muted-foreground">× {item.quantity}</span>
              </span>
              <span className="font-medium tabular-nums">
                {formatPrice(item.price_cents * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <Separator className="my-4" />
        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(order.total_cents)}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/products" className={buttonVariants()}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
