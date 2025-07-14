import PropertyCard from "@/components/PropertyCard";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import { Skeleton } from "@/components/ui/skeleton";
import useFetch from "@/hooks/useFetch";
import type { Property, PropertyListResponse } from "@/utils/types/property";
import { useEffect, useState, useRef, useCallback } from "react";

function HomePage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", "24");
    for (const key in filters) {
      params.append(key, filters[key]);
    }
    return `/property?${params.toString()}`;
  }, [filters, page]);

  const { data, loading, refresh } = useFetch<PropertyListResponse>(buildUrl);

  useEffect(() => {
    if (data?.results) {
      setAllProperties((prev) =>
        page === 1 ? data.results : [...prev, ...data.results]
      );
      setTotalPages(data.total_pages);
      setTotalProperties(data.count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setPage(1);
    setAllProperties([]);
  }, [filters]);

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setPage(1);
    setFilters(newFilters);
    setAllProperties([]);
  };

  const observer = useRef<IntersectionObserver>(null);
  const lastPropertyElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, page, totalPages]
  );

  const featuredProperty = allProperties[0];
  const otherProperties = allProperties.slice(1);

  return (
    <>
      <SearchAndFilterBar
        onFilterChange={handleFilterChange}
        totalProperties={totalProperties}
      />

      {loading && allProperties.length === 0 ? (
        <HomePageSkeleton />
      ) : (
        <div className="w-full p-2">
          {featuredProperty && (
            <div className="mb-8">
              <PropertyCard
                property={featuredProperty}
                refreshProperties={refresh}
                isFeatured
              />
            </div>
          )}
          <div className="m-auto p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherProperties.map((property, index) => (
              <div
                key={property.pk}
                ref={
                  otherProperties.length === index + 1
                    ? lastPropertyElementRef
                    : null
                }
              >
                <PropertyCard property={property} refreshProperties={refresh} />
              </div>
            ))}
          </div>
          {loading && <div className="text-center py-4">Loading more...</div>}
        </div>
      )}
    </>
  );
}

function HomePageSkeleton() {
  return (
    <div className="w-full p-2">
      <div className="mb-8">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 11 }).map((_, index) => (
          <div key={index} className="grid gap-2">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4 mt-2" />
            <Skeleton className="h-6 w-1/2 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
