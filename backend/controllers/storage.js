import storageModel from "../models/storage.js";
import { uploadToPinata } from "../utils/handleUploadIPFS.js";
import User from "../models/User.js";


const createItem = async (req, res) => {
    const { body, file } = req;
    const fileData = {
        filename: file.filename,
        url: process.env.PUBLIC_URL + "/" + file.filename,
    };

    const data = await storageModel.create(fileData);
    res.send(data);
};

const updateImage = async (req, res) => {
    try {
        const id = req.params.id;
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const pinataResponse = await uploadToPinata(fileBuffer, fileName);
        const ipfsFile = pinataResponse.IpfsHash;
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;
        const data = await storageModel.create({ _id: id }, { url: ipfs }, { new: true });
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("ERROR_UPLOAD_COMPANY_IMAGE");
    }
};

const updateUserImage = async (req) => {
    try {
        const id = req.params.id;
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const pinataResponse = await uploadToPinata(fileBuffer, fileName);
        const ipfsFile = pinataResponse.IpfsHash;
        const ipfsUrl = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;

        // Guardar en la base de datos
        await storageModel.create({ _id: id, url: ipfsUrl });

        return ipfsUrl; // ✅ Devolver la URL de la imagen
    } catch (err) {
        console.error(err);
        throw new Error("ERROR_UPLOAD_COMPANY_IMAGE");
    }
};

const uploadAndUpdateUserImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Debe subir una imagen" });
        }

        const { userId } = req.params;

        //SEARCH USER
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        //UPLOAD
        const imageUrl = await updateUserImage(req);
        if (!imageUrl) {
            return res.status(500).json({ error: "No se pudo obtener la URL de la imagen" });
        }

        //UPDATE IMAGE
        user.profileImage = imageUrl;
        await user.save();

        return res.status(200).json({
            message: "Imagen de perfil actualizada correctamente",
            profileImage: imageUrl,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export { createItem, updateImage, uploadAndUpdateUserImage };
