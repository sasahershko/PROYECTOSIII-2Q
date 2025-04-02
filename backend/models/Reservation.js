import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete';


const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Usuario que hace la reserva
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true }, // Mesa reservada
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }, // Proyecto asociado
    date: { type: String, required: true }, // Fecha de la reserva (YYYY-MM-DD)
    startTime: { type: String, required: true }, // Hora de inicio (HH:MM)
    endTime: { type: String, required: true }, // Hora de fin (HH:MM)
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    }, // Estado de la reserva
  },
  { timestamps: true }
);

reservationSchema.plugin(mongooseDelete, { overrideMethods: 'all' });
const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
