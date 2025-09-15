import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await createIndexes()
    } catch (error: any) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
}

const createIndexes = async () => {
    try {
        // Create indexes for better query performance
        const db = mongoose.connection.db;

        // Order collection indexes
        await db?.collection('orders').createIndex({ school_id: 1 });
        await db?.collection('orders').createIndex({ trustee_id: 1 });
        await db?.collection('orders').createIndex({ "student_info.id": 1 });

        // Order Status collection indexes
        await db?.collection('orderstatuses').createIndex({ collect_id: 1 });
        await db?.collection('orderstatuses').createIndex({ status: 1 });
        await db?.collection('orderstatuses').createIndex({ payment_time: -1 });


        // Users collection indexes
        await db?.collection('users').createIndex({ email: 1 }, { unique: true });

        console.log('Database indexes created successfully');
    } catch (error: any) {
        console.error('Error creating indexes:', error.message);
    }
};


export default connectDB;