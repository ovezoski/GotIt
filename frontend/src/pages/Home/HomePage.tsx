import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import useFetch from "@/hooks/useFetch";
import type { Property, PropertyListResponse } from "@/utils/types/property";
import { useState } from "react";
import PropertyPagination from "./PropertyPagination";

function HomePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, refresh, loading } = useFetch<PropertyListResponse>(
    `/property?page=${page}&pageSize=8&search=${search}`
  );

  return (
    <>
      <SearchBar search={search} setSearch={setSearch} />

      <PropertyPagination totalPages={5} page={page} setPage={setPage} />

      <div className="w-full p-2">
        <div className="m-auto p-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 row-span-full  gap-3 grid">
          {loading ? (
            <div className="grid gap-2">
              <Skeleton className="h-30 w-full" />
              <Skeleton className="h-30" />
              <Skeleton className="h-30" />
            </div>
          ) : (
            data?.results?.map((property: Property) => (
              <PropertyCard
                property={property}
                key={property.pk}
                refreshProperties={refresh}
              />
            ))
          )}
        </div>

        <div className="mt-5  w-1/2 m-auto bg-skyblue flex items-center space-x-4"></div>
      </div>
    </>
  );
}

export default HomePage;
