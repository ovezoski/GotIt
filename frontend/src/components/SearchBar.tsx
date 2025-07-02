import { Input } from "./ui/input";

interface SerchBarProperties {
  search: string;
  setSearch: (text: string) => void;
}

function SearchBar({ search, setSearch }: SerchBarProperties) {
  return (
    <div className="p-2 m-auto w-1/3 sm:w-3/4 ">
      <Input
        type="email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      ></Input>
    </div>
  );
}

export default SearchBar;
