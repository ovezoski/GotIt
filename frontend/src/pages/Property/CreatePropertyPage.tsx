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
import { useState, useRef, type FormEventHandler } from "react";

import { useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import useFetch from "@/hooks/useFetch";
import apiClient from "@/api/axiosConfig";
import axios from "axios";

function CreatePropertyPage() {
  const [name, setName] = useState("");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useFetch("/property/");

  const getCookie = (name: string) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Validation Error");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    if (mainImageFile) {
      formData.append("main_image", mainImageFile);
    }

    const csrftoken = getCookie("csrftoken");

    try {
      const response = await apiClient.post("/property/", formData, {
        headers: {
          "X-CSRFToken": csrftoken ?? "",
        },
      });

      toast.success("Property created.");
      setName("");
      setMainImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      navigate(`/property/${response.data.pk}/details`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error creating property:",
          error.response?.data || error.message
        );
        toast.error(error.response?.data?.detail || "Creation Failed");
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
            Create New Property
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a new property to your listing.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Property Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Cozy Apartment in City Center"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              {isSubmitting ? "Creating..." : "Create Property"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CreatePropertyPage;
