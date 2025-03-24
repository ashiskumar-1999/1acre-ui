"use client";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { ProcessedProperty, PropertyData } from "@/types";
import { formatLandSize, formatPrice } from "@/lib/utils";

interface PropertyMapComponentProps {
  mapData: PropertyData[];
}

const center = {
  lat: 17.2162,
  lng: 77.7,
};

const PropertyMapComponent: React.FC<PropertyMapComponentProps> = ({
  mapData,
}) => {
  const [processedProperties, setProcessedProperties] = useState<
    ProcessedProperty[]
  >([]);
  const [selectedProperty, setSelectedProperty] =
    useState<ProcessedProperty | null>(null);

  useEffect(() => {
    if (mapData.length > 0) {
      const properties = processPropertyData(mapData);
      setProcessedProperties(properties);
    }
  }, [mapData]);

  const processPropertyData = (data: PropertyData[]): ProcessedProperty[] => {
    const properties = _.map(data, (item) => ({
      id: item.id,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.long),
      land_size: item.land_size,
      land_price: item.land_price,
      total_land_size: item.total_land_size,
      total_price: item.total_price,
      division_slugs: item.division_slugs,
      highway_facing: item.highway_facing,
    }));

    return properties;
  };

  const handleMarkerClick = (property: ProcessedProperty) => {
    setSelectedProperty(property);
  };

  const closeInfoWindow = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="w-full h-90 pb-4">
      <Map mapId="property-map" defaultCenter={center} defaultZoom={10}>
        {processedProperties.map((property) => (
          <AdvancedMarker
            key={property.id}
            position={{ lat: property.lat, lng: property.lng }}
            onClick={() => handleMarkerClick(property)}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: "#efd503",
                border: "2px solid white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            />
          </AdvancedMarker>
        ))}

        {selectedProperty && (
          <InfoWindow
            position={{
              lat: selectedProperty.lat,
              lng: selectedProperty.lng,
            }}
            onCloseClick={closeInfoWindow}
          >
            <div className="p-2 max-w-xs bg-white rounded shadow">
              <div className="text-lg font-semibold mb-1">
                {formatLandSize(selectedProperty.land_size)} -{" "}
                {formatPrice(selectedProperty.land_price)}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {selectedProperty.division_slugs?.village},{" "}
                {selectedProperty.division_slugs?.mandal}
              </div>
              <div className="text-sm mb-2">
                <span className="font-medium">Total Price:</span> ₹{" "}
                {selectedProperty.total_price} Lakh
              </div>
              {selectedProperty.highway_facing && (
                <div className="text-sm text-green-600">Highway Facing</div>
              )}
              <button
                className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-4 rounded text-sm"
                onClick={() =>
                  window.open(`/property/${selectedProperty.id}`, "_blank")
                }
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};

export default PropertyMapComponent;
