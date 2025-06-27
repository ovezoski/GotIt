import useFetch from "@/hooks/useFetch";
import type { Property } from "@/types/property";
import { useParams } from "react-router-dom";

function PropertyDetailsPage() {
  const { id } = useParams();

  const { data: property } = useFetch<Property>("/property/" + id);

  return (
    <div className="p-3">
      <h1 className="font-bold text-xl">{property?.name}</h1>
      <div className="w-300">
        <img className="w-300px" width={500} src={property?.main_image_url} />
      </div>
    </div>
  );
}

export default PropertyDetailsPage;
