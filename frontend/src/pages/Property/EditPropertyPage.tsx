import { useParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import PropertyForm from "./PropertyForm";
import type { Property } from "@/utils/types/property";

function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, loading } = useFetch<Property>(`/property/${id}/`);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  return <PropertyForm property={property} isEditMode={true} />;
}

export default EditPropertyPage;
