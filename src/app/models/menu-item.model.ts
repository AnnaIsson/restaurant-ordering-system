// ============================================================
// MenuItem Model - Core data structure for menu items
// ============================================================

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  ingredients: string[];
  isAvailable: boolean;
  isRecommended: boolean;
  isDiscounted: boolean;
  discountPercent?: number;
  preparationTime: number; // in minutes
  calories: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  imageUrl: string;
  itemCount?: number;
}

export interface MenuFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isRecommended?: boolean;
}
