import mongoose from "mongoose";
export const connectDb = () => {
    mongoose
        .connect("mongodb://localhost:27017", { dbName: "QuickMart" })
        .then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
