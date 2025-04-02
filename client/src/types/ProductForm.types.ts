import { Product } from './ProductList.types';

export type UpdatedProductFormProps = Omit<Product, 'coverPhoto'> & {
  coverPhoto?: string | File;
};

export interface ProductFormProps {
  ownerId?: string;
  onClose: () => void;
  onProductAdded: (product: Product) => void;
  product?: Product;
  onSubmit?: (
    productData: Omit<Product, 'coverPhoto'> & {
      coverPhoto?: string | File;
    }
  ) => Promise<void>;
}
