import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { addToCart } from "@/app/cart/actions";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

type ProductWithCategory = Product & { category: Category | null };

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, category_id, name, slug, description, price_cents, image_url, stock, category:categories(id, name, slug)",
    )
    .eq("slug", slug)
    .maybeSingle()
    .returns<ProductWithCategory>();

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/products" className="hover:text-foreground">
          All Products
        </Link>
        {product.category && (
          <>
            <ChevronRight className="size-3.5" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {product.category && (
            <Badge variant="secondary" className="w-fit">
              {product.category.name}
            </Badge>
          )}
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-2xl font-semibold">{formatPrice(product.price_cents)}</p>

          {product.stock > 0 ? (
            product.stock <= 5 ? (
              <p className="text-sm text-amber-600">
                Only {product.stock} left in stock — order soon
              </p>
            ) : (
              <p className="text-sm text-emerald-600">In stock</p>
            )
          ) : (
            <p className="text-sm text-destructive">Out of stock</p>
          )}

          <Separator />

          {product.description && (
            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <form action={addToCart} className="mt-2">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="redirectTo" value={`/products/${product.slug}`} />
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto sm:px-12"
              disabled={product.stock === 0}
            >
              Add to cart
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
