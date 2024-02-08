import { Schema, model } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}"),
    },
    password: {
        type: String,
        required: true,
    },
});

const User = model<IUser>("User", userSchema);

export default User;
