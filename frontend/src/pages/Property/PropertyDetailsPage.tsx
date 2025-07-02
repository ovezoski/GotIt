import useFetch from "@/hooks/useFetch";
import type { Property } from "@/types/property";
import { useParams } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import { Cuboid } from "lucide-react";

function PropertyDetailsPage() {
  const { id } = useParams();

  const { data: property } = useFetch<Property>("/property/" + id);

  const defaultProps = {
    center: {
      lat: 41.991502921447314,
      lng: 21.44224528484455,
    },
    zoom: 17,
  };
  const items = [
    [41.99213251989934, 21.439457155423124],
    [41.99153681168819, 21.442263524979815],
    [41.992532433078246, 21.440366930174967],
    [41.99048593706282, 21.44090475153171],
  ];

  return (
    <div className="p-3">
      <h1 className="font-bold text-xl">{property?.name}</h1>
      <div className="w-300">
        <div style={{ height: "80vh", width: "70%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "" }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            {items.map((item) => (
              <Marker lat={item[0]} lng={item[1]} />
            ))}
          </GoogleMapReact>
        </div>
        {/* <img className="w-300px" width={500} src={property?.main_image_url} /> */}
      </div>
    </div>
  );
}

interface MarkerProps {
  lat: number;
  lng: number;
}

function Marker({ lat, lng }: MarkerProps) {
  return (
    <>
      <Cuboid />
    </>
  );
}

export default PropertyDetailsPage;
