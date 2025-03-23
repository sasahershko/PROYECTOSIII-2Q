import dotenv from 'dotenv';
import Project from '../models/Project.js';
import User from '../models/User.js';

dotenv.config();

export const createProject = async (req, res) => {

    try {

        const { userId } = req; //usuario autenticado que está creando el proyecto

        const {
            name,
            contactPerson,
            company,
            area,
            responsibles = [], // IDs de responsables
            users = [], // IDs de usuarios
            benefit = "",
            folder = "",
            pStatus = [],
            pendingNotes = [],
            description,
            practicesAgreement = false,
            practicesStudents = 0,
            sdpStudents = 0,
            startDate,
            reviewDates = [],
            endDate
        } = req.body;

        if (!name || !contactPerson || !company || !area || !description || !startDate || !endDate) {
            return res.status(400).json({ mensaje: "Todos los campos obligatorios" });
        }

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ mensaje: "La fecha de inicio no puede ser mayor que la de finalización" });
        }

        //validar si los responsables existen
        const validResponsibles = await User.find({ _id: { $in: responsibles } }); //busca en mongo todos los usuarios cuyo sid están en el array de responsibles

        if (validResponsibles.length !== responsibles.length) {
            return res.status(400).json({ mensaje: "Alguno de los responsables no existen" });
        }

        const validUsers = await User.find({ _id: { $in: users } });

        if (validUsers.length !== users.length) {
            return res.status(400).json({ mensaje: "Alguno de los usuarios no existen" });
        }

        const uniqueUsers = [...new Set([...responsibles, ...users])];  //elimina duplicados (esto es porque al poner a un usuario tanto en responsable como en usuario, se duplica)

        const newProject = new Project({
            name,
            contactPerson,
            company,
            area,
            responsibles,
            users: uniqueUsers, //!esto es para que no se dupliquen los usuarios
            benefit,
            folder,
            pStatus,
            pendingNotes,
            description,
            practicesAgreement,
            practicesStudents,
            sdpStudents,
            startDate,
            reviewDates,
            endDate
        });


        const savedProject = await newProject.save();

        //para que no se dupliquen
        await User.updateMany({_id: {$in: uniqueUsers}}, {$addToSet: {projects: savedProject._id}});

        return res.status(201).json({ mensaje: "Proyecto creado con éxito.", project: savedProject });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al crear el proyecto.", error: error.message });
    }
}

export const getAllProjects = async (req, res) =>{
    try {
        let projects;

        if(!req.usuario){
            //intentamos obtener el tken desde la scookies o el header authorization
            projects = await Project.find().select('area name description');
        }else if (req.usuario.rol === 'admin'){
            projects = await Project.find();
        }else{
            //!mirar -> si es moderador/usuario, puede ver los proyectos que es responsable, y en los que participa
            projects = await Project.find({ 
                $or: [
                    {responsibles: req.usuario._id},
                    {users: req.usuario._id}
                ]
            });
        }

        res.json(projects);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los proyectos", error: error.message});
    }
}

export const getProjectById = async (req, res) => {
    try {
        const {id} = req.params;

        const project = await Project.findById(id)
            .populate("responsibles", "name")
            .populate("users", "name");

            if (!project) {
                return res.status(404).json({ mensaje: "Proyecto no encontrado" });
            }

            res.json(project);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el proyecto", error: error.message });
    }
}

/**
 * @desc Eliminar un proyecto y limpiar referencias en usuarios
 * @route DELETE /api/projects/:id
 * @access Private (solo admin o responsables del proyecto)
 */
export const deleteProject = async (req, res) => {
    try {
      const usuarioAutenticado = req.usuario; // Usuario autenticado
      const { id } = req.params; // ID del proyecto a eliminar
  
      const proyectoAEliminar = await Project.findById(id);
      if (!proyectoAEliminar) {
        return res.status(404).json({ mensaje: "Proyecto no encontrado." });
      }
  
      // Verificar permisos: solo admin o responsables del proyecto pueden eliminarlo
      if (
        usuarioAutenticado.rol !== "admin" &&
        !proyectoAEliminar.responsibles.includes(usuarioAutenticado._id)
      ) {
        return res.status(403).json({ mensaje: "No tienes permisos para eliminar este proyecto." });
      }
  
      // Eliminar el ID del proyecto en la lista de proyectos de los usuarios asociados
      await User.updateMany(
        { projects: id },
        { $pull: { projects: id } }
      );
  
      // Finalmente, eliminar el proyecto
      await proyectoAEliminar.deleteOne();
  
      res.status(200).json({ mensaje: "Proyecto eliminado correctamente y referencias en usuarios limpiadas." });
  
    } catch (error) {
      console.error("❌ Error en el servidor:", error);
      res.status(500).json({ mensaje: "Error en el servidor." });
    }
  };

  export const updateProject = async (req, res) => {
    try {
        const { id } = req.params; // ID del proyecto a actualizar
        const { usuario } = req; // Usuario autenticado

        // Buscar el proyecto a actualizar
        const existingProject = await Project.findById(id);
        if (!existingProject) {
            return res.status(404).json({ mensaje: "Proyecto no encontrado." });
        }

        // Verificar permisos: solo admin o responsables pueden actualizar
        if (
            usuario.rol !== "admin" &&
            !existingProject.responsibles.includes(usuario._id)
        ) {
            return res.status(403).json({ mensaje: "No tienes permisos para actualizar este proyecto." });
        }

        // Validar que las fechas sean correctas si están presentes en la petición
        if (req.body.startDate && req.body.endDate && new Date(req.body.startDate) > new Date(req.body.endDate)) {
            return res.status(400).json({ mensaje: "La fecha de inicio no puede ser mayor que la de finalización." });
        }

        // Validar si los responsables existen si se proporcionan
        if (req.body.responsibles) {
            const validResponsibles = await User.find({ _id: { $in: req.body.responsibles } });
            if (validResponsibles.length !== req.body.responsibles.length) {
                return res.status(400).json({ mensaje: "Alguno de los responsables no existen." });
            }
        }

        // Validar si los usuarios existen si se proporcionan
        if (req.body.users) {
            const validUsers = await User.find({ _id: { $in: req.body.users } });
            if (validUsers.length !== req.body.users.length) {
                return res.status(400).json({ mensaje: "Alguno de los usuarios no existen." });
            }
        }

        // Unificar usuarios y responsables sin duplicados si se proporcionan
        if (req.body.responsibles || req.body.users) {
            const uniqueUsers = [...new Set([...(req.body.responsibles || existingProject.responsibles), ...(req.body.users || existingProject.users)])];
            req.body.users = uniqueUsers;
        }

        // Actualizar el proyecto con los campos proporcionados
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true } // Para devolver el proyecto actualizado
        );

        // Actualizar los usuarios asociados al proyecto si se modificaron
        if (req.body.users) {
            await User.updateMany({ projects: id }, { $pull: { projects: id } });
            await User.updateMany({ _id: { $in: req.body.users } }, { $addToSet: { projects: id } });
        }

        return res.status(200).json({ mensaje: "Proyecto actualizado con éxito.", project: updatedProject });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al actualizar el proyecto.", error: error.message });
    }
};
