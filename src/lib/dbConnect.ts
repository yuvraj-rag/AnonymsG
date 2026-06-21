import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to DB");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        // console.log("db obj : ",db);

        connection.isConnected = db.connections[0].readyState;

        console.log("DB connection success");
    } catch (err: any) {
        console.log("DB connection failed\n", err);
        console.error(err.stack);
        process.exit(1);
    }
}

export default dbConnect;