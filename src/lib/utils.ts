import { LandSize, LandPrice } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format land size for display
export const formatLandSize = (landSize: LandSize | undefined): string => {
  if (!landSize) return "N/A";

  const acres = landSize.total_land_size_in_acres?.acres || 0;
  const guntas = landSize.total_land_size_in_acres?.guntas || 0;

  let result = "";
  if (acres > 0) result += `${acres} Acre${acres > 1 ? "s" : ""}`;
  if (guntas > 0)
    result += `${result ? " " : ""}${guntas} Gunta${guntas > 1 ? "s" : ""}`;

  return result || "N/A";
};

// Format price for display
export const formatPrice = (landPrice: LandPrice | undefined): string => {
  if (!landPrice) return "N/A";

  const lakh = landPrice.price_per_acre_crore?.lakh || 0;
  const crore = landPrice.price_per_acre_crore?.crore || 0;

  let result = "";
  if (crore > 0) result += `₹ ${crore} Cr`;
  if (lakh > 0) result += `${result ? " " : "₹ "}${lakh} Lakh`;

  return result ? result + "/acre" : "N/A";
};
