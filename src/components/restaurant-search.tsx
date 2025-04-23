"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Search } from "lucide-react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export interface OverpassResponse {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OverpassElement[];
}

export type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number; // only present if type is 'node'
  lon?: number; // only present if type is 'node'
  tags?: Record<string, string>;
  nodes?: number[]; // for ways
  bounds?: {
    minlat: number;
    minlon: number;
    maxlat: number;
    maxlon: number;
  };
};

export function RestaurantSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OverpassResponse>();
  const router = useRouter();
  const createRestaurant = api.restaurant.create.useMutation({
    onSuccess: (data) => {
      router.push(`/restaurant/${data.id}`);
    },
  });

  const searchPlaces = useDebouncedCallback(async () => {
    if (!query) {
      setResults(undefined);
      return;
    }
    const input = `
			node
			  [amenity=restaurant]
			  ["name"~"${query}",i]
			  (around:80000,38.6280278,-90.1910154);
			out;
			`;
    const response = await fetch(
      `https://overpass.private.coffee/api/interpreter?data=[out:json];${input}`,
    );
    const data = (await response.json()) as OverpassResponse;
    setResults(data);
  }, 500);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search for a restaurant..."
          value={query}
          onChange={async (e) => {
            setQuery(e.target.value);
            await searchPlaces();
          }}
        />
        <Button onClick={searchPlaces}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {results?.elements.map((result) => (
          <Card
            key={result.id}
            className="hover:bg-accent cursor-pointer p-4"
            onClick={() => {
              if (!result.tags?.name) return;
              createRestaurant.mutate({
                name: result.tags.name,
                address: result.tags["addr:full"] ?? result.tags.name,
                osmNodeId: result.id.toString(),
              });
            }}
          >
            <h3 className="font-semibold">{result.tags?.name}</h3>
            <p className="text-muted-foreground text-sm">
              {result.tags?.["addr:full"] ?? result.tags?.name}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
