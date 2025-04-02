import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

//esto es como chema = mongoose.Schema y model = mongoose.model
const { Schema, model } = mongoose;

// HISTORIAL ESTADO PROYECTO
const projectStatusSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
    status: {
      type: String,
      required: true,
      enum: [
        "No iniciado",
        "En proceso",
        "Completado",
        "Pendiente",
        "Cancelado",
      ],
    },
  },
  { _id: false }
); //no neccesita id

//HISTORIAL NOTAS PENDIENTES
const pendingNotesSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    note: { type: String, required: true },
    userWhoWrites: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userWhoReceives: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tag: {
      type: String,
      required: true,
      enum: ["completada", "no completada"],
      default: "no completada",
    },
  },
  { _id: false }
); //no neccesita id

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    company: {
      type: String,
      required: true,
      enum: ["U-TAD", "ILION", "OTROS"],
    },
    area: {
      type: String,
      required: true,
      enum: ["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"],
    },
    responsibles: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    benefit: { type: String },
    folder: { type: String },
    pStatus: {
      type: [projectStatusSchema],
      default: [{ status: "No iniciado" }],
    },
    pendingNotes: { type: [pendingNotesSchema], default: [] },
    description: { type: String, required: true },
    practicesAgreement: { type: Boolean, default: false },
    practicesStudents: { type: Number, default: 0 },
    sdpStudents: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    reviewDates: [{ type: Date, default: [] }],
    endDate: { type: Date, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

projectSchema.pre("save", function (next) {
  if (!this.pStatus || this.pStatus.length === 0) {
    this.pStatus.push({ status: "No iniciado", date: Date.now(), notes: "" });
  }
  next();
});

// 🔄 Activar soft delete con mongoose-delete
projectSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

export default model("Project", projectSchema);
