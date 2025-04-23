import { notFound } from "next/navigation";
import { RestaurantForm } from "~/components/restaurant-form";
import { api } from "~/trpc/server";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await api.restaurant.getById(id).catch(() => null);

  if (!restaurant) {
    notFound();
  }

  return <RestaurantForm restaurant={restaurant} />;
}
