import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@projectcenterdb.prnvs.mongodb.net/projectCenterDB?retryWrites=true&w=majority&appName=projectCenterDB`;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:\n", error);
  }
};

export default connectDB;
