import { connect, mongoose } from "mongoose" ;

export const connectDB = async () =>{
    try {
        mongoose.set('strictQuery', true);

        await connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
        
    } catch (error) {
         console.log(`Error on Connecting  to database ${error}`);
        
    }

}
