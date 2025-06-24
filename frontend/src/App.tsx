import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import "./App.css";
import { Button } from "./components/ui/button";
import { Calendar } from "./components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import useFetch from "./hooks/useFetch";
import { Skeleton } from "./components/ui/skeleton";

type Property = {
  name: string;
  created_at: string;
  pk: string;
};

function App() {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const {
    data,
    loading,
  }: {
    data: Property[] | null;
    loading: boolean;
  } = useFetch("property/json/");

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

  const deleteProperty = useCallback(
    async (propertyId: string) => {
      if (!csrfToken) {
        console.error("CSRF token not available. Cannot delete property.");
        return;
      }

      const headers = new Headers();
      headers.append("X-CSRFToken", csrfToken);

      try {
        const response = await fetch(
          `http://localhost:8000/property/${propertyId}/delete`,
          {
            method: "POST",
            headers: headers,
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    },
    [csrfToken]
  );

  return (
    <div className="w-full p-2">
      <div className="w-3/4 m-auto flex justify-between flex-wrap wrap gap-3">
        {loading ? (
          <div>
            <Skeleton className="h-30 w-full" />
            <Skeleton className="h-30" />
            <Skeleton className="h-30" />
          </div>
        ) : (
          data?.map((property: Property) => (
            <div key={property.pk}>
              <Card className="col-4 min-w-100">
                <CardHeader>
                  <CardTitle>{property.name}</CardTitle>
                  <CardDescription>
                    {property?.created_at
                      ? new Date(property.created_at).toLocaleString()
                      : "N/A"}
                  </CardDescription>
                  <CardAction>
                    <Button
                      variant="destructive"
                      onClick={() => deleteProperty(property.pk)}
                    >
                      Delete
                    </Button>
                  </CardAction>
                </CardHeader>
              </Card>
            </div>
          ))
        )}
      </div>

      <div className="p-2 mt-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button>
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
              className="rounded-lg border"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-5  w-1/2 m-auto bg-skyblue flex items-center space-x-4"></div>
    </div>
  );
}

export default App;
