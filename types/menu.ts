export type MenuItem = {
  name: string;
  description?: string;
  price?: number;
  search_term: string;
};

export type Category = {
  category_name: string;
  items: MenuItem[];
}; 