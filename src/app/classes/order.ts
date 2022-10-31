import { CartItem } from './cart-item';

// Order
export interface Order {
    shippingDetails?: any;
    product?: CartItem;
    orderId?: any;
    totalAmount?: any;
    createdOn?:any;
    discount?:any;
    id?:any;
    mrp?:any;
    netPrice?:any;
    billingAddress?:any;
    products?:any;
    shippingAddress?:any;
    userId?:any;
    taxAmount?:any;
    userInv?:any;
    OrderSKUDetails?:any;
}