import { ProductCard } from "@/components/product-card";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, category_id, name, slug, description, price_cents, image_url, stock")
    .order("created_at", { ascending: false })
    .returns<Product[]>();

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b bg-gradient-to-b from-muted/60 to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything you need, delivered fast.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Discover top-rated electronics, home essentials, books, and fashion
            — all in one place.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          Featured products
        </h2>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No products yet — check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
