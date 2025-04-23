import { Suspense } from "react";
import { RestaurantSearch } from "~/components/restaurant-search";
import { RecentRestaurants } from "~/components/recent-restaurants";

export default async function DashboardPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="mb-8 text-4xl font-bold">My Restaurants</h1>

      <div className="mb-8">
        <RestaurantSearch />
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-semibold">Recently Updated</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <RecentRestaurants />
        </Suspense>
      </div>
    </main>
  );
}
