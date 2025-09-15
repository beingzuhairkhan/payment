import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
declare global {
  namespace Express {
    interface UserPayload extends JwtPayload {
      _id: mongoose.Types.ObjectId;
      name:string;
      email: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
