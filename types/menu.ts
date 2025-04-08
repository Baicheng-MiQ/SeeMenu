export type MenuItem = {
  name: string;
  description?: string;
  price?: number;
};

export type Category = {
  category_name: string;
  items: MenuItem[];
}; 