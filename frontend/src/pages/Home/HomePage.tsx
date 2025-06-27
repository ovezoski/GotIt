import PropertyCard from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import useFetch from "@/hooks/useFetch";
import type { Property } from "@/types/property";
import { useCallback, useEffect, useState } from "react";

function HomePage() {
  const { data, loading, refresh } = useFetch<Property[]>("property/");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const getCookie = useCallback((name: string) => {
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
  }, []);

  useEffect(() => {
    const csrfTokenCookie = getCookie("csrftoken");
    setCsrfToken(csrfTokenCookie);
  }, [getCookie]);

  return (
    <>
      <div className="w-full p-2">
        <div className="m-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 row-span-full  gap-3 grid">
          {loading ? (
            <div>
              <Skeleton className="h-30 w-full" />
              <Skeleton className="h-30" />
              <Skeleton className="h-30" />
            </div>
          ) : (
            data?.map((property: Property) => (
              <PropertyCard
                property={property}
                key={property.pk}
                csrfToken={csrfToken}
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
