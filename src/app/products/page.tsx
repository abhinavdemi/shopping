import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  const supabase = await createClient();

  const [{ data: categories }, productsQuery] = await Promise.all([
    supabase.from("categories").select("id, name, slug").returns<Category[]>(),
    (async () => {
      let query = supabase
        .from("products")
        .select("id, category_id, name, slug, description, price_cents, image_url, stock")
        .order("name");

      if (categorySlug) {
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categorySlug)
          .maybeSingle();

        if (category) {
          query = query.eq("category_id", category.id);
        }
      }

      return query.returns<Product[]>();
    })(),
  ]);

  const { data: products } = productsQuery;
  const activeCategory = categories?.find((c) => c.slug === categorySlug);

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        {activeCategory ? activeCategory.name : "All Products"}
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <CategoryPill href="/products" label="All" active={!activeCategory} />
        {categories?.map((category) => (
          <CategoryPill
            key={category.id}
            href={`/products?category=${category.slug}`}
            label={category.name}
            active={activeCategory?.id === category.id}
          />
        ))}
      </div>

      {products && products.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-muted-foreground">No products found.</p>
      )}
    </div>
  );
}

function CategoryPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
          : "rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      }
    >
      {label}
    </Link>
  );
}
