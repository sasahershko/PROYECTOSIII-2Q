const tableSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    zone: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
  });
  
  const Table = mongoose.model("Table", tableSchema);
  export default Table;
  