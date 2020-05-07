import * as mongoose from 'mongoose';

export class Database {

    public static async init(): Promise<void> {
        const target = process.env.DATABASE_URL;
        const options = { useNewUrlParser: true, useUnifiedTopology: true };
        await mongoose.connect(target, options, (error) => {
            if(error) {
                console.error('Failed to connect to the database');
                console.error(error);
                throw error;
            } else {
                console.log('Connected to the database');
            }
        });
    }

}

export default mongoose;