"use client";
import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BadgeCheck } from "lucide-react";

type ImageURL = {
  id: number;
  video: null;
  image: string;
  media_type: string;
  category: string;
};

type Location = {
  id: number;
  name: string;
  division_type: "state" | "district" | "mandal" | "village";
};

type CardProps = {
  imageURL: ImageURL[];
  pricePerAcre: string;
  totalArea: string;
  propertyLocation: Location[];
  isVerified: boolean;
};

const PropertyCard = ({
  imageURL,
  pricePerAcre,
  totalArea,
  propertyLocation,
  isVerified,
}: CardProps) => {
  return (
    <Card className="w-75 h-60 rounded-lg pt-0">
      <CardHeader className="p-0 relative h-48 overflow-hidden">
        <Carousel className="absolute flex items-center justify-center">
          <CarouselContent>
            {imageURL.map((src) => (
              <CarouselItem key={src.id} className="flex justify-center">
                <Image
                  src={src.image}
                  alt="property-image"
                  width={300}
                  height={280}
                  className="object-cover rounded-t-lg h-48"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="p-1 left-2" />
          <CarouselNext className="p-1 right-2" />
        </Carousel>
      </CardHeader>
      <CardContent>
        <CardTitle className="flex text-md font-semibold">
          ₹ {pricePerAcre}/acre{"."}
          {totalArea} {""}{" "}
          {isVerified === true && <BadgeCheck className="text-blue-500" />}
        </CardTitle>
        {propertyLocation.map((location) => (
          <div className="inline text-md font-semibold" key={location.id}>
            {location.division_type === "district" && location.name}{" "}
            {location.division_type === "village" && location.name}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
