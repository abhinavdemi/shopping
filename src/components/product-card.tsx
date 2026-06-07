import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Link>
      <CardContent className="flex flex-col gap-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-semibold">{formatPrice(product.price_cents)}</p>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-amber-600">Only {product.stock} left</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-destructive">Out of stock</p>
        )}
      </CardContent>
      <CardFooter className="bg-transparent border-t-0 pt-0">
        <Button className="w-full" disabled={product.stock === 0}>
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}
