export type Property = {
  name: string;
  created_at: Date | string;
  pk: string;
  main_image: string;
  main_image_url: string;
  description?: string;

  address_line_1: string;
  address_line_2: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  state_province: string;
  zip_code: string;
  owner: number;
};

export interface PropertyListResponse {
  results: Property[];
  total_pages: number;
  count: number;
}

