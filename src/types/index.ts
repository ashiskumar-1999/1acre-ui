export interface ImageURL {
  id: number;
  video: null;
  image: string;
  media_type: string;
  category: string;
}

export interface Location {
  id: number;
  name: string;
  division_type: "state" | "district" | "mandal" | "village";
}

export interface PropertyResult {
  id: number;
  land_media: ImageURL[];
  price_per_acre: string;
  total_land_size: string;
  is_basic_verified: boolean;
  division_info: Location[];
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PropertyResult[];
}

export interface LandSizeUnit {
  acres?: number | null;
  guntas?: number | null;
  cents?: number | null;
}

export interface LandSize {
  total_land_size_in_acres?: LandSizeUnit;
  total_land_size_in_bighas?: LandSizeUnit | null;
  total_land_size_in_hectares?: number | null;
}

export interface PriceUnit {
  lakh?: number | null;
  crore?: number | null;
}

export interface LandPrice {
  price_per_acre_crore?: PriceUnit;
  price_per_bigha_crore?: PriceUnit | null;
  price_per_hectare_crore?: PriceUnit | null;
}

export interface DivisionSlugs {
  state: string;
  district: string;
  mandal: string;
  village: string;
}

export interface PropertyData {
  id: number;
  lat: string;
  long: string;
  land_size: LandSize;
  land_price: LandPrice;
  total_land_size: number;
  total_price: number;
  division_slugs: DivisionSlugs;
  highway_facing: boolean;
  status: string;
  exposure_type: string;
  seller_type: string;
}

export interface ProcessedProperty {
  id: number;
  lat: number;
  lng: number;
  land_size: LandSize;
  land_price: LandPrice;
  total_land_size: number;
  total_price: number;
  division_slugs: DivisionSlugs;
  highway_facing: boolean;
}
