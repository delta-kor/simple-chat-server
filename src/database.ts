import * as mongoose from 'mongoose';

export class Database {

    public static init(): any {
        const target = process.env.DATABASE_URL;
        const options = { useNewUrlParser: true, useUnifiedTopology: true };
        void mongoose.connect(target, options, (error) => {
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