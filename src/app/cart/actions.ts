"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function currentUserId(redirectTo: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (!userId) {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  }

  return { supabase, userId };
}

export async function addToCart(formData: FormData) {
  const productId = formData.get("productId") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/products";
  const { supabase, userId } = await currentUserId(redirectTo);

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("cart_items")
      .insert({ user_id: userId, product_id: productId, quantity: 1 });
  }

  revalidatePath("/", "layout");
}

export async function setCartItemQuantity(formData: FormData) {
  const itemId = formData.get("itemId") as string;
  const quantity = Number(formData.get("quantity"));
  const { supabase, userId } = await currentUserId("/cart");

  if (quantity <= 0) {
    await supabase.from("cart_items").delete().eq("id", itemId).eq("user_id", userId);
  } else {
    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .eq("user_id", userId);
  }

  revalidatePath("/", "layout");
}

export async function removeCartItem(formData: FormData) {
  const itemId = formData.get("itemId") as string;
  const { supabase, userId } = await currentUserId("/cart");

  await supabase.from("cart_items").delete().eq("id", itemId).eq("user_id", userId);

  revalidatePath("/", "layout");
}

export async function placeOrder() {
  const { supabase, userId } = await currentUserId("/cart");

  const { data: items } = await supabase
    .from("cart_items")
    .select("quantity, product:products(id, price_cents, stock)")
    .eq("user_id", userId)
    .returns<{ quantity: number; product: { id: string; price_cents: number; stock: number } | null }[]>();

  if (!items || items.length === 0) {
    redirect("/cart");
  }

  const validItems = items.filter((item) => item.product);
  const totalCents = validItems.reduce(
    (sum, item) => sum + item.product!.price_cents * item.quantity,
    0,
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: userId, total_cents: totalCents, status: "paid" })
    .select("id")
    .single();

  if (orderError || !order) {
    redirect("/cart");
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    validItems.map((item) => ({
      order_id: order.id,
      product_id: item.product!.id,
      quantity: item.quantity,
      price_cents: item.product!.price_cents,
    })),
  );

  if (itemsError) {
    redirect("/cart");
  }

  await supabase.from("cart_items").delete().eq("user_id", userId);

  revalidatePath("/", "layout");
  redirect(`/orders/${order.id}`);
}
