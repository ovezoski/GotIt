import { type MouseEventHandler } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { Property } from "@/utils/types/property";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  csrfToken: string | null;
  refreshProperties: () => void;
}

function PropertyCard({ property, refreshProperties }: PropertyCardProps) {
  const deleteProperty: MouseEventHandler = async (e) => {
    e.preventDefault();
    const buttonElement = e.currentTarget as HTMLButtonElement;
    const propertyId = buttonElement.value;

    const getCookie = (name: string) => {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name?.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    };

    const csrfToken = getCookie("csrftoken") ?? "none";

    const headers = new Headers();
    headers.append("X-CSRFToken", csrfToken);

    try {
      const response = await fetch(
        `http://localhost:8000/property/${propertyId}/`,
        {
          method: "DELETE",
          headers: headers,
          credentials: "include",
        }
      );

      if (response.ok) {
        refreshProperties();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <Link to={`/property/${property.pk}/details`}>
          <CardTitle>{property.name}</CardTitle>
          <CardDescription>
            {property?.created_at
              ? new Date(property.created_at).toLocaleString()
              : "N/A"}
          </CardDescription>
        </Link>
        <CardAction>
          <Button
            className="bg-red-400"
            variant="destructive"
            value={property.pk}
            onClick={deleteProperty}
          >
            <Trash2 />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <Link to={`/property/${property.pk}/details`}>
          <img
            src={property.main_image_url}
            alt="Property Image"
            className="w-full  max-h-50px"
          />
        </Link>
      </CardContent>
    </Card>
  );
}

export default PropertyCard;
