import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        grado: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Agrega "createdAt" y "updatedAt" automáticamente
    }
);

//Exportamos el modelo con `export default` para ser compatible con `import`
export default mongoose.model("Idea", ideaSchema);
