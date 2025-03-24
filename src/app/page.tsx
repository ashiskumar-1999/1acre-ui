"use client";
import React, { useEffect, useRef, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Home() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchProperty = async ({ pageParam = 1 }) => {
    try {
      const fetchPropertyData = await fetch(
        `https://prod-be.1acre.in/lands/?seller=211&page=${pageParam}&page_size=10`
      );
      return fetchPropertyData.json();
    } catch (error) {
      console.error(error);
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
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <>
      <div className="grid grid-cols-1 place-items-center md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {data?.pages.map((page) =>
          page.results.map((property: any) => (
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
