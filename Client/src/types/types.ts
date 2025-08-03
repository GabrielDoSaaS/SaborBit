export interface Chef {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  restaurantName: string;
  profilePicture?: string;
  planoAtivo?: boolean;
  dataExpiracaoPlano?: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  chefId: string;
}

export interface Order {
  _id: string;
  clientName: string;
  clientPhone: string;
  clientAddress?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'delivered';
  orderDate: string;
  observations?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  observations?: string;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  observations?: string;
}

export interface AuthContextType {
  chef: Chef | null;
  login: (chef: Chef) => void;
  logout: () => void;
  updateChef: (chef: Chef) => void;
}