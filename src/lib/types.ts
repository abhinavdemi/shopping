export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  stock: number;
};
