import useFetch from "@/hooks/useFetch";
import type { Property } from "@/utils/types/property";
import { useParams } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import {
  Badge,
  Building,
  Calendar,
  Cuboid,
  Globe,
  LocateFixed,
  Mail,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  // const items = [
  //   [41.99213251989934, 21.439457155423124],
  //   [41.99153681168819, 21.442263524979815],
  //   [41.992532433078246, 21.440366930174967],
  //   [41.99048593706282, 21.44090475153171],
  // ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                {property?.name}
              </CardTitle>
              <CardDescription className="flex items-center text-md text-gray-600 dark:text-gray-400 mt-2">
                <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                {`${property?.address_line_1}, ${property?.city}, ${property?.country}`}
              </CardDescription>
            </CardHeader>
            {/* <CardContent>
              <Carousel className="w-full max-w-full mx-auto rounded-lg overflow-hidden">
                <CarouselContent>
                  {propertyImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <img
                          src={image}
                          alt={`Property Image ${index + 1}`}
                          className="w-full h-96 object-cover rounded-md"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent> */}
          </Card>

          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                About This Property
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <Building className="mr-3 h-5 w-5 text-blue-500" />
                <p>
                  <strong>Address Line 1:</strong> {property?.address_line_1}
                </p>
              </div>
              {property?.address_line_2 && (
                <div className="flex items-center">
                  <LocateFixed className="mr-3 h-5 w-5 text-blue-500" />
                  <p>
                    <strong>Address Line 2:</strong> {property.address_line_2}
                  </p>
                </div>
              )}
              <div className="flex items-center">
                <MapPin className="mr-3 h-5 w-5 text-blue-500" />
                <p>
                  <strong>City:</strong> {property?.city}
                </p>
              </div>
              <div className="flex items-center">
                <Globe className="mr-3 h-5 w-5 text-blue-500" />
                <p>
                  <strong>Country:</strong> {property?.country}
                </p>
              </div>
              <div className="flex items-center">
                <Building className="mr-3 h-5 w-5 text-blue-500" />
                <p>
                  <strong>State/Province:</strong> {property?.state_province}
                </p>
              </div>
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-blue-500" />
                <p>
                  <strong>Zip Code:</strong> {property?.zip_code}
                </p>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-blue-500" />
                <p>
                  <strong>Listed On:</strong>{" "}
                  {typeof property?.created_at == "string"
                    ? property?.created_at
                    : new Date(
                        property?.created_at ?? "2000-06-02"
                      ).toLocaleDateString()}
                </p>
              </div>
              {property?.pk && (
                <div className="flex items-center">
                  <Badge className="px-3 py-1 rounded-full text-sm font-medium">
                    ID: {property.pk}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6 shadow-lg sticky top-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{ height: "400px", width: "100%" }}
                className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: import.meta.env.VITE_MAPS_API_KEY || "",
                  }}
                  defaultCenter={defaultProps.center}
                  defaultZoom={defaultProps.zoom}
                  center={defaultProps.center}
                >
                  {property?.latitude && property?.longitude && <Marker />}
                </GoogleMapReact>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Exact location may vary slightly for privacy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Marker() {
  return (
    <>
      <Cuboid />
    </>
  );
}

export default PropertyDetailsPage;
