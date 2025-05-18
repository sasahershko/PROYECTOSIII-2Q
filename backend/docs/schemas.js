const schemas = {
  TableCreate: {
    type: "object",
    required: ["number", "zone", "capacity"],
    properties: {
      number: {
        type: "integer",
        example: 7,
        description: "Número identificativo de la mesa",
      },
      zone: {
        type: "string",
        example: "Zona B",
        description: "Zona donde se encuentra la mesa",
      },
      capacity: {
        type: "integer",
        example: 4,
        description: "Número máximo de personas que caben en la mesa",
      },
    },
  },

  TableResponse: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        example: "6617f1f57e95e18f0fbf0a7c",
      },
      number: {
        type: "integer",
        example: 7,
      },
      zone: {
        type: "string",
        example: "Zona B",
      },
      capacity: {
        type: "integer",
        example: 4,
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2025-05-18T12:00:00.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2025-05-18T12:00:00.000Z",
      },
    },
  },

  TableUpdate: {
    type: "object",
    properties: {
      zone: {
        type: "string",
        example: "Zona C",
      },
      capacity: {
        type: "integer",
        example: 6,
      },
    },
  },

  UserRegister: {
    type: "object",
    required: ["name", "surname", "email", "password", "dni", "grade"],
    properties: {
      name: { type: "string", example: "Iván" },
      surname: { type: "string", example: "Martínez" },
      email: {
        type: "string",
        example: "ivan@u-tad.com",
        pattern: "@(u-tad\\.com|live\\.u-tad\\.com)$",
      },
      password: {
        type: "string",
        example: "Password123",
        description:
          "Debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número",
      },
      dni: {
        type: "string",
        example: "12345678Z",
        description: "Debe incluir la letra calculada",
      },
      grade: {
        type: "string",
        enum: ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"],
        example: "INSO",
      },
    },
  },

  UserLogin: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", example: "ivan@u-tad.com" },
      password: { type: "string", example: "Password123" },
    },
  },

  UserVerifyCode: {
    type: "object",
    required: ["email", "code"],
    properties: {
      email: { type: "string", example: "ivan@u-tad.com" },
      code: { type: "string", example: "123456", minLength: 6, maxLength: 6 },
    },
  },

  UserResendVerification: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", example: "ivan@u-tad.com" },
    },
  },

  UserUpdate: {
    type: "object",
    properties: {
      name: { type: "string", example: "Iván" },
      surname: { type: "string", example: "Martínez" },
      dni: { type: "string", example: "12345678Z" },
      grade: {
        type: "string",
        enum: ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"],
        example: "INSO",
      },
      rol: {
        type: "string",
        enum: ["admin", "moderator", "user"],
        example: "moderator",
      },
      profileImage: {
        type: "string",
        example: "https://cdn.img/ivan.png",
      },
    },
  },

  UserResponse: {
    type: "object",
    properties: {
      id: { type: "string", example: "6617f1f57e95e18f0fbf0a7b" },
      name: { type: "string", example: "Iván" },
      surname: { type: "string", example: "Martínez" },
      email: { type: "string", example: "ivan@u-tad.com" },
      dni: { type: "string", example: "12345678Z" },
      rol: {
        type: "string",
        enum: ["admin", "moderator", "user"],
        example: "user",
      },
      grade: {
        type: "string",
        enum: ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"],
        example: "INSO",
      },
      isVerified: { type: "boolean", example: true },
      profileImage: {
        type: "string",
        example: "https://cdn.img/ivan.png",
      },
      projects: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6620f3d9e38247ac84fd1a23" },
            title: { type: "string", example: "Proyecto X" },
            status: { type: "string", example: "en curso" },
            deadline: { type: "string", format: "date", example: "2025-07-10" },
          },
        },
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  ProjectCreate: {
    type: "object",
    required: [
      "name",
      "contactPerson",
      "company",
      "area",
      "description",
      "startDate",
      "endDate",
    ],
    properties: {
      name: { type: "string", example: "Plataforma Gestión Académica" },
      contactPerson: {
        type: "object",
        required: ["name", "email", "phone"],
        properties: {
          name: { type: "string", example: "Juan Pérez" },
          email: { type: "string", example: "juan@empresa.com" },
          phone: { type: "string", example: "666555444" },
        },
      },
      company: {
        type: "string",
        enum: ["U-TAD", "ILION", "OTROS"],
        example: "U-TAD",
      },
      area: {
        type: "string",
        enum: ["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"],
        example: "INSO",
      },
      responsibles: {
        type: "array",
        items: { type: "string" },
        example: ["6617f1f57e95e18f0fbf0a7e"],
      },
      users: {
        type: "array",
        items: { type: "string" },
        example: ["6617f1f57e95e18f0fbf0a7d"],
      },
      benefit: { type: "string", example: "Facilita la gestión centralizada" },
      folder: { type: "string", example: "/ruta/a/la/carpeta" },
      description: { type: "string", example: "Proyecto académico U-TAD" },
      practicesAgreement: { type: "boolean", example: true },
      practicesStudents: { type: "integer", example: 3 },
      sdpStudents: { type: "integer", example: 2 },
      startDate: { type: "string", format: "date", example: "2025-04-01" },
      reviewDates: {
        type: "array",
        items: { type: "string", format: "date" },
        example: ["2025-05-01", "2025-06-01"],
      },
      endDate: { type: "string", format: "date", example: "2025-07-01" },
    },
  },

  ProjectUpdate: {
    type: "object",
    properties: {
      name: { type: "string" },
      contactPerson: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
        },
      },
      company: {
        type: "string",
        enum: ["U-TAD", "ILION", "OTROS"],
      },
      area: {
        type: "string",
        enum: ["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"],
      },
      responsibles: {
        type: "array",
        items: { type: "string" },
      },
      users: {
        type: "array",
        items: { type: "string" },
      },
      benefit: { type: "string" },
      folder: { type: "string" },
      description: { type: "string" },
      practicesAgreement: { type: "boolean" },
      practicesStudents: { type: "integer", minimum: 0 },
      sdpStudents: { type: "integer", minimum: 0 },
      startDate: { type: "string", format: "date" },
      endDate: { type: "string", format: "date" },
    },
  },

  ProjectResponse: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6617f1f57e95e18f0fbf0a7c" },
      name: { type: "string", example: "Plataforma Gestión Académica" },
      contactPerson: {
        type: "object",
        properties: {
          name: { type: "string", example: "Juan Pérez" },
          email: { type: "string", example: "juan@empresa.com" },
          phone: { type: "string", example: "666555444" },
        },
      },
      company: { type: "string", example: "U-TAD" },
      area: { type: "string", example: "INSO" },
      responsibles: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            surname: { type: "string" },
            profileImage: { type: "string" },
          },
        },
      },
      users: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            surname: { type: "string" },
            profileImage: { type: "string" },
          },
        },
      },
      benefit: { type: "string" },
      folder: { type: "string" },
      description: { type: "string" },
      image: { type: "string" },
      startDate: { type: "string", format: "date" },
      endDate: { type: "string", format: "date" },
      practicesAgreement: { type: "boolean" },
      practicesStudents: { type: "integer" },
      sdpStudents: { type: "integer" },
      reviewDates: {
        type: "array",
        items: { type: "string", format: "date" },
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  ProjectBudget: {
    type: "object",
    properties: {
      title: { type: "string", example: "Presupuesto inicial" },
      reason: {
        type: "string",
        example: "Proyecto de colaboración con empresa externa",
      },
      generalComments: { type: "string", example: "Versión preliminar" },
      tutors: {
        type: "object",
        properties: {
          numTutors: { type: "number", example: 2 },
          estimatedHours: { type: "number", example: 10 },
          pricePerHour: { type: "number", example: 25 },
        },
      },
      interns: {
        type: "object",
        properties: {
          numInterns: { type: "number", example: 1 },
          estimatedHours: { type: "number", example: 80 },
          pricePerHour: { type: "number", example: 12 },
        },
      },
      extraExpenses: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: { type: "string", example: "Licencia software" },
            quantity: { type: "number", example: 3 },
            unitPrice: { type: "number", example: 50 },
          },
        },
      },
    },
  },

  StorageItem: {
    type: "object",
    properties: {
      filename: {
        type: "string",
        example: "profile_ivan.png",
      },
      url: {
        type: "string",
        example: "https://gateway.pinata.cloud/ipfs/QmEjemploArchivo",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2025-05-18T12:00:00Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2025-05-18T12:00:00Z",
      },
    },
  },

  IdeaCreate: {
    type: "object",
    required: ["nombre", "descripcion", "usuario", "grado"],
    properties: {
      nombre: { type: "string", example: "App para cafeterías" },
      descripcion: {
        type: "string",
        example: "Una app para gestionar pedidos y reservas en cafeterías.",
      },
      usuario: {
        type: "string",
        example: "6617f1f57e95e18f0fbf0a7a",
        description: "ID del usuario que propone la idea",
      },
      grado: {
        type: "string",
        example: "INSO",
      },
    },
  },

  IdeaUpdate: {
    type: "object",
    properties: {
      nombre: { type: "string", example: "Nueva idea modificada" },
      descripcion: { type: "string", example: "Descripción actualizada" },
      usuario: {
        type: "string",
        example: "6617f1f57e95e18f0fbf0a7a",
      },
      grado: {
        type: "string",
        example: "FIIS",
      },
    },
  },

  IdeaResponse: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6617f1f57e95e18f0fbf0a7e" },
      nombre: { type: "string", example: "App para cafeterías" },
      descripcion: {
        type: "string",
        example: "Una app para gestionar pedidos y reservas en cafeterías.",
      },
      usuario: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          surname: { type: "string" },
          email: { type: "string" },
          profileImage: { type: "string" },
        },
      },
      grado: { type: "string", example: "INSO" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  
};

export default schemas;
