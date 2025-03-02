import multer from "multer";

// Configuración de almacenamiento en disco
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // Se define la ruta de almacenamiento
    const pathStorage = __dirname + "/../storage";
    callback(null, pathStorage); // error y destination
  },
  filename: function (req, file, callback) {
    // Renombramos el archivo
    const ext = file.originalname.split(".").pop(); // Obtener la extensión
    const filenameV2 = file.originalname.split(".")[0] + "-" + Date.now() + "." + ext;
    console.log(file);
    callback(null, filenameV2);
  }
});

// Middleware de carga
const uploadMiddleware = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB de límite
const memory = multer.memoryStorage();
const uploadMiddlewareMemory = multer({ storage: memory, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB de límite

// Exportación de los middlewares
export { uploadMiddleware, uploadMiddlewareMemory };
