import dotenv from 'dotenv';
import Project from '../models/Project.js';
import User from '../models/User.js';

dotenv.config();

export const createProject = async (req, res) => {

    try {

        const { userId } = req; //usuario autenticado que está creando el proyecto

        const {
            projectName,
            contactPerson,
            company,
            area,
            projectResponsibles = [], // IDs de responsables
            users = [], // IDs de usuarios
            benefit = "",
            projectFolder = "",
            projectStatus = [],
            pendingNotes = [],
            projectDescription,
            practicesAgreement = false,
            practicesStudents = 0,
            sdpStudents = 0,
            startDate,
            reviewDates = [],
            endDate
        } = req.body;

        if (!projectName || !contactPerson || !company || !area || !projectDescription || !startDate || !endDate) {
            return res.status(400).json({ mensaje: "Todos los campos obligatorios" });
        }

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ mensaje: "La fecha de inicio no puede ser mayor que la de finalización" });
        }

        //validar si los responsables existen
        const validResponsibles = await User.find({ _id: { $in: projectResponsibles } }); //busca en mongo todos los usuarios cuyo sid están en el array de projectResponsibles

        if (validResponsibles.length !== projectResponsibles.length) {
            return res.status(400).json({ mensaje: "Alguno de los responsables no existen" });
        }

        const validUsers = await User.find({ _id: { $in: users } });

        if (validUsers.length !== users.length) {
            return res.status(400).json({ mensaje: "Alguno de los usuarios no existen" });
        }

        const uniqueUsers = [...new Set([...projectResponsibles, ...users])];  //elimina duplicados (esto es porque al poner a un usuario tanto en responsable como en usuario, se duplica)

        const newProject = new Project({
            projectName,
            contactPerson,
            company,
            area,
            projectResponsibles,
            users: uniqueUsers, //!esto es para que no se dupliquen los usuarios
            benefit,
            projectFolder,
            projectStatus,
            pendingNotes,
            projectDescription,
            practicesAgreement,
            practicesStudents,
            sdpStudents,
            startDate,
            reviewDates,
            endDate
        });


        const savedProject = await newProject.save();

        // //asignar el proyecto a los responsables
        // await User.updateMany({ _id: { $in: projectResponsibles } }, { $push: { projects: savedProject._id } });

        // //asignar el proyecto a los usuarios
        // await User.updateMany({ _id: { $in: users } }, { $push: { projects: savedProject._id } });

        //para que no se dupliquen
        await User.updateMany({_id: {$in: uniqueUsers}}, {$addToSet: {projects: savedProject._id}});

        return res.status(201).json({ mensaje: "Proyecto creado con éxito.", project: savedProject });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al crear el proyecto.", error: error.message });
    }
}

export const getAllProjects = async (req, res) =>{
    try {
        const projects = await Project.find();

        res.json(projects);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los proyectos", error: error.message});
    }
}

export const getProjectById = async (req, res) => {
    try {
        const {id} = req.params;

        const project = await Project.findById(id)
            .populate("projectResponsibles", "name")
            .populate("users", "name");

            if (!project) {
                return res.status(404).json({ mensaje: "Proyecto no encontrado" });
            }

            res.json(project);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el proyecto", error: error.message });
    }
}