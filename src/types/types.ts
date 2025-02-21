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
type UpdateproductFeilds = {
  name: string;
  price: number;
  stock: number;
  category: string;
  photo: string;
};
export {
  IUser,
  NewUserRequestBody,
  NewProductRequestBody,
  UpdateproductFeilds,
};
