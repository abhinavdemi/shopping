import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { placeOrder, removeCartItem, setCartItemQuantity } from "@/app/cart/actions";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price_cents: number;
    image_url: string | null;
    stock: number;
  } | null;
};

export default async function CartPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to view your cart and start adding items.
        </p>
        <Link href="/login?redirect=/cart" className={buttonVariants({ className: "mt-6" })}>
          Sign in
        </Link>
      </div>
    );
  }

  const { data: items } = await supabase
    .from("cart_items")
    .select("id, quantity, product:products(id, name, slug, price_cents, image_url, stock)")
    .order("created_at")
    .returns<CartItem[]>();

  const cartItems = (items ?? []).filter((item) => item.product);
  const subtotalCents = cartItems.reduce(
    (sum, item) => sum + item.product!.price_cents * item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/products" className={buttonVariants({ className: "mt-6" })}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-4">
          {cartItems.map((item) => {
            const product = item.product!;
            return (
              <li key={item.id} className="flex gap-4 rounded-xl border p-4">
                <Link
                  href={`/products/${product.slug}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted"
                >
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-medium leading-snug hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(product.price_cents)} each
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <form action={setCartItemQuantity}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="quantity" value={item.quantity - 1} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="icon-sm"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3.5" />
                        </Button>
                      </form>
                      <span className="w-8 text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <form action={setCartItemQuantity}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="quantity" value={item.quantity + 1} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="icon-sm"
                          aria-label="Increase quantity"
                          disabled={item.quantity >= product.stock}
                        >
                          <Plus className="size-3.5" />
                        </Button>
                      </form>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-medium tabular-nums">
                        {formatPrice(product.price_cents * item.quantity)}
                      </span>
                      <form action={removeCartItem}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-xl border p-5">
          <h2 className="font-semibold">Order summary</h2>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({cartItems.reduce((n, i) => n + i.quantity, 0)} items)
            </span>
            <span className="font-medium tabular-nums">{formatPrice(subtotalCents)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(subtotalCents)}</span>
          </div>

          <form action={placeOrder}>
            <Button type="submit" size="lg" className="mt-5 w-full">
              Place order
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
}
