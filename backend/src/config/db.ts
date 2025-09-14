import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string)
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error: any) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
}

const createIndex = async () => {
    try {
        const db = mongoose.connection.db;

        await db?.collection('orders').createIndex({school_id:1});
        await db?.collection('orders').createIndex({trustee_id:1});
        await db?.collection('orders').createIndex({"student_info":1});

        await db?.collection('orderStatuss').createIndex({collect_id:1})
        await db?.collection('orderStatuss').createIndex({status:1})
        await db?.collection('orderStatuss').createIndex({payment_time:1})

        await db?.collection('users').createIndex({ email: 1 }, { unique: true });
        
        console.log('Database indexes created successfully');
    } catch (error:any) {
         console.error('Error creating indexes:', error.message);
    }
}

export default connectDB;