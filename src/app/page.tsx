import { Suspense } from "react";
import { RestaurantSearch } from "~/components/restaurant-search";
import { RecentRestaurants } from "~/components/recent-restaurants";

export default async function DashboardPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="mb-8 text-4xl font-bold">My Restaurants</h1>

      <div className="mb-8">
        <RestaurantSearch />
        <p className="mt-2 text-gray-700">
          Search for a restaurant by name (filtered to St. Louis area, example:
          Sushi Ai).
        </p>
        <p className="text-gray-700">
          Search uses OpenStreetMap Overpass API, which is somewhat slow.
        </p>
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
