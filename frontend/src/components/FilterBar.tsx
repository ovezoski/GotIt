import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

function FilterBar({ onFilterChange }: FilterBarProps) {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [ordering, setOrdering] = useState("");

  const handleFilter = () => {
    const filters: Record<string, string> = {};
    if (city) filters.city = city;
    if (country) filters.country = country;
    if (ordering) filters.ordering = ordering;
    onFilterChange(filters);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg flex gap-4 items-center">
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
      <select
        value={ordering}
        onChange={(e) => setOrdering(e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="">Sort by</option>
        <option value="-created_at">Date (Newest First)</option>
        <option value="created_at">Date (Oldest First)</option>
      </select>
      <Button onClick={handleFilter}>Apply Filters</Button>
    </div>
  );
}

export default FilterBar;
