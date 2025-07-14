import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState, useRef, type FormEventHandler, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import apiClient from "@/api/axiosConfig";
import axios from "axios";
import type { Property } from "@/utils/types/property";
import { Label } from "@/components/ui/label";

interface PropertyFormProps {
  property?: Property;
  isEditMode?: boolean;
}

function PropertyForm({ property, isEditMode = false }: PropertyFormProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && property) {
      setName(property.name);
      setCity(property.city);
      setState(property.state_province);
      setCountry(property.country);
      setZipCode(property.zip_code);
      setAddress(property.address_line_1);
    }
  }, [isEditMode, property]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Validation Error");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address_line_1", address);

    formData.append("city", city);
    formData.append("state_province", state);
    formData.append("country", country);
    formData.append("zip_code", zipCode);

    if (mainImageFile) {
      formData.append("main_image", mainImageFile);
    }

    try {
      const response = isEditMode
        ? await apiClient.patch(`/property/${property?.pk}/`, formData)
        : await apiClient.post("/property/", formData);

      toast.success(
        `Property ${isEditMode ? "updated" : "created"} successfully.`
      );
      navigate(`/property/${response.data.pk}/details`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Error ${isEditMode ? "updating" : "creating"} property:`,
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.detail ||
            `${isEditMode ? "Update" : "Creation"} Failed`
        );
      } else {
        console.error("Network error or unexpected issue:", error);
        toast.error(
          "Could not connect to the server. Please check your internet connection."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {isEditMode ? "Edit Property" : "Create New Property"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update the details of your property."
              : "Fill in the details below to add a new property to your listing."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Property Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Cozy Apartment in City Center"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="e.g. 75th street"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="e.g. Ocean Pines"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                type="text"
                placeholder="e.g. Maryland"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country">country</Label>
              <Input
                id="country"
                type="text"
                placeholder="e.g. Germany"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input
                id="zip_code"
                type="text"
                placeholder="e.g. 7500"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mainImage">Main Image</Label>
              <Input
                id="mainImage"
                type="file"
                accept="image/*"
                onChange={(e) => setMainImageFile(e.target.files?.[0] ?? null)}
                ref={fileInputRef}
              />
              <p className="text-sm text-gray-500">
                Upload a main image for the property (optional).
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Property"
                : "Create Property"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default PropertyForm;
