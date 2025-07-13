import { motion } from "framer-motion";
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
import apiClient from "@/api/axiosConfig";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface PropertyCardProps {
  property: Property;
  refreshProperties: () => void;
  isFeatured?: boolean;
}
const DEVELOMPENT = import.meta.env.VITE_DEVELOPMENT;

function PropertyCard({ property, refreshProperties, isFeatured = false }: PropertyCardProps) {
  const { user } = useAuth();

  const deleteProperty: MouseEventHandler = async (e) => {
    e.preventDefault();
    const buttonElement = e.currentTarget as HTMLButtonElement;
    const propertyId = buttonElement.value;

    try {
      const response = await apiClient.delete(`/property/${propertyId}/`);

      if (response.status === 204 || response.status === 200) {
        toast.success("Property Deleted.");
        refreshProperties();
      } else {
        throw new Error(
          `Failed to delete property with status: ${response.status}`
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error deleting property:",
          error.response?.data || error.message
        );
        toast.error("Failed to delete property.");
      } else {
        console.error("Network error or unexpected issue:", error);
        toast.error("Could not connect to the server.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.8, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <Link to={`/property/${property.pk}/details`}>
            <CardTitle className={isFeatured ? "text-4xl" : ""}>{property.name}</CardTitle>
            <CardDescription>
              {property?.created_at
                ? new Date(property.created_at).toLocaleString()
                : "N/A"}
            </CardDescription>
          </Link>
          <CardAction>
            {user?.user_id === property.owner && (
              <Button
                className="bg-red-400"
                variant="destructive"
                value={property.pk}
                onClick={deleteProperty}
              >
                <Trash2 />
              </Button>
            )}
          </CardAction>
        </CardHeader>

        <CardContent className="flex-grow">
          <Link to={`/property/${property.pk}/details`}>
            {!DEVELOMPENT && (
              <img
                src={property.main_image_url}
                alt="Property Image"
                className={`w-full object-cover ${isFeatured ? "h-96" : "h-48"}`}
              />
            )}
            {isFeatured && (
              <p className="text-lg mt-4">{property.description}</p>
            )}
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PropertyCard;
