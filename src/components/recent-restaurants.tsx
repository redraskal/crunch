"use client";

import { Card } from "./ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";

export function RecentRestaurants() {
  const { data: restaurants } = api.restaurant.getRecent.useQuery();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {restaurants?.map((restaurant) => (
        <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
          <Card className="hover:bg-accent cursor-pointer p-4">
            <h3 className="font-semibold">{restaurant.name}</h3>
            <p className="text-muted-foreground mb-2 text-sm">
              {restaurant.address}
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (restaurant.rating ?? 0)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {restaurant.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-primary/10 rounded-full px-2 py-1 text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
