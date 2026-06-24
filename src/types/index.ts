export interface ProductType {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  ingredients: string | null;
  nutritionInfo: string | null;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  images: string[];
  categoryId: string;
  category: CategoryType;
  isFeatured: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId: string | null;
  orderStatus: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string | null;
  trackingNumber: string | null;
  notes: string | null;
  items: OrderItemType[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemType {
  id: string;
  orderId: string;
  productId: string;
  product: ProductType;
  quantity: number;
  price: number;
  total: number;
}

export interface CustomerType {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface ReviewType {
  id: string;
  productId: string;
  customerId: string | null;
  name: string;
  email: string | null;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface CouponType {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minOrder: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
}

export interface BannerType {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  position: string;
  isActive: boolean;
  order: number;
}

export interface CartItemType {
  id: string;
  productId: string;
  product: ProductType;
  quantity: number;
}

export interface AdminType {
  id: string;
  name: string;
  email: string;
  role: string;
  isFirstLogin: boolean;
}

export interface NotificationType {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}
