"use client";
import React, { useEffect, useRef, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import PropertyMapComponent from "@/components/PropertyMap";
import { ApiResponse } from "@/types";

export default function Home() {
  const [mapData, setMapData] = useState([]);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchProperty = async ({ pageParam = 1 }): Promise<ApiResponse> => {
    try {
      const fetchPropertyData = await fetch(
        `https://prod-be.1acre.in/lands/?seller=211&page=${pageParam}&page_size=10`
      );
      return fetchPropertyData.json();
    } catch (error) {
      console.error(error);
      throw new Error("Problem while fetching the data");
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["properties"],
      queryFn: ({ pageParam = 1 }) => fetchProperty({ pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const totalCount = lastPage.count;
        const loaded = allPages.reduce(
          (acc, page) => acc + page.results.length,
          0
        );
        return loaded < totalCount ? allPages.length + 1 : undefined;
      },
    });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const currentRef = loadMoreRef.current; // Capture the current ref

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const propertyMapData = await fetch(
          "https://prod-be.1acre.in/lands/landmaps/?seller_id=211"
        );
        const data = await propertyMapData.json();
        console.log("Property map data fetched:", data.results.length);
        setMapData(data.results);
      } catch (error) {
        console.error("Error fetching property map data:", error);
      }
    };
    fetchMapData();
  }, []);

  return (
    <>
      <PropertyMapComponent mapData={mapData} />
      <div className="grid grid-cols-1 place-items-center md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {data?.pages.map((page) =>
          page.results.map((property) => (
            <PropertyCard
              key={property.id}
              imageURL={property.land_media}
              pricePerAcre={property.price_per_acre}
              totalArea={property.total_land_size}
              isVerified={property.is_basic_verified}
              propertyLocation={property.division_info}
            />
          ))
        )}
        {/* Load More Trigger */}
        <div ref={loadMoreRef} className="col-span-full text-center py-8">
          {isFetchingNextPage ? (
            <div className="border-4 border-t-4 border-gray-200 border-t-yellow-500 rounded-full w-10 h-10 animate-spin " />
          ) : (
            hasNextPage
          )}
        </div>
      </div>
    </>
  );
}
