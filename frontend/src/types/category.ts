export interface Category {
  id: number;
  name: string;
  color: string;
  note_count: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CategoryResponse {
  category: Category;
}
