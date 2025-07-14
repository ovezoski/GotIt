import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";

interface SearchAndFilterBarProps {
  onFilterChange: (filters: Record<string, string>) => void;
  totalProperties: number;
}

function SearchAndFilterBar({
  onFilterChange,
  totalProperties,
}: SearchAndFilterBarProps) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [ordering, setOrdering] = useState("created_at");

  const handleApplyFilters = () => {
    const filters: Record<string, string> = {};
    if (search) filters.search = search;
    if (city) filters.city = city;
    if (country) filters.country = country;
    if (ordering) filters.ordering = ordering;
    onFilterChange(filters);
  };

  return (
    <div className="p-4 bg-background rounded-lg flex gap-4 items-center">
      <Input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-grow"
      />
      <div className="hidden md:flex gap-4 items-center">
        <Input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Input
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <Select onValueChange={setOrdering} value={ordering}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-created_at">Date (Newest First)</SelectItem>
            <SelectItem value="created_at">Date (Oldest First)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleApplyFilters}>Search</Button>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Filters</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <Select onValueChange={setOrdering} value={ordering}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="-created_at">
                      Date (Newest First)
                    </SelectItem>
                    <SelectItem value="created_at">
                      Date (Oldest First)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button onClick={handleApplyFilters}>Apply</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="text-lg ">{totalProperties}</div>
    </div>
  );
}

export default SearchAndFilterBar;
