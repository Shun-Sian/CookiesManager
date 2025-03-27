export interface Product {
  _id: string;
  ownerId: string;
  title: string;
  details: string;
  location: string;
  price: number;
  discountPrice?: number;
  coverPhoto: string;
}

export interface ProductListProps {
  products: Product[];
  userId?: string;
  isLoggedIn: boolean;
  onEditClick: (product: Product) => void;
  onDeleteClick: (productId: string) => void;
}
