import PropertyCard from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import useFetch from "@/hooks/useFetch";
import type { Property, PropertyListResponse } from "@/utils/types/property";
import { useState } from "react";
import PropertyPagination from "../Home/PropertyPagination";

function MyPropertiesPage() {
  const [page, setPage] = useState(1);

  const { data, refresh, loading } = useFetch<PropertyListResponse>(
    `/my-properties?page=${page}&pageSize=8`
  );

  return (
    <>
      <h1 className="text-2xl font-bold text-center my-4">My Properties</h1>
      <PropertyPagination totalPages={5} page={page} setPage={setPage} />

      <div className="w-full p-2">
        <div className="m-auto p-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 row-span-full  gap-3 grid">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="grid gap-2">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ))
            : data?.results?.map((property: Property) => (
                <PropertyCard
                  property={property}
                  key={property.pk}
                  refreshProperties={refresh}
                />
              ))}
        </div>

        <div className="mt-5  w-1/2 m-auto bg-skyblue flex items-center space-x-4"></div>
      </div>
    </>
  );
}

export default MyPropertiesPage;
