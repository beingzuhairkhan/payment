import mongoose from "mongoose";

export interface NewUser {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;

}
