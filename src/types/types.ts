// Used in Creating User-Model
interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  // Virtual Attribute
  age: number;
}
// Used in Definig New-Request
interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  dob: Date;
  _id: string;
}
// Used in Definig New-Product-Request
interface NewProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
}
//Update Feild
type UpdateproductFeilds = {
  name: string;
  price: number;
  stock: number;
  category: string;
  photo: string;
};
type searchProductFeilds = {
  search: string;
  price: string;
  category: string;
  sort: string;
  page: string;
};
// Used for Searching Product ## Operator ka interface
interface baseQueryType {
  name: {
    $regex: string;
    $options: string;
  };
  price: {
    $lte: number;
  };
  category: string;
}
type invalidateCache = {
  products: boolean;
  order: boolean;
  admin: boolean;
  userId: string;
  orderId: string;
  productId: string | string[];
};

// New Order -->Req.body

type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};
type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};
interface NewOrderRequestFeild {
  shippingInfo: ShippingInfoType;
  user: string;
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  Total: number;
  orderItem: OrderItemType[];
}
export {
  IUser,
  NewUserRequestBody,
  NewProductRequestBody,
  UpdateproductFeilds,
  searchProductFeilds,
  baseQueryType,
  invalidateCache,
  NewOrderRequestFeild,
  OrderItemType,
};
