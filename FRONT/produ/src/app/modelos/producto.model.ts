export interface Producto {
    id?: string;
    product_id: number;
    product_name: string;
    product_list_price: number;
    product_min_promo_quantity: number;
    product_max_promo_quantity: number;
    product_min_promo_price: number;
    created_by?: string;
    created_by_email?: string;
    created_at?: string;
}
  