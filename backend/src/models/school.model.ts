import mongoose , {Document , Model , Schema} from "mongoose";

export interface ISchool extends Document {
    name:string,
    email:string,
}

const schoolSchema = new Schema<ISchool>({
    name:{
        type:String,
        required: [true, "School Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
},{timestamps:true})

const School:Model<ISchool> = mongoose.model<ISchool>("School" , schoolSchema)

export default School