const schemas = {
  Ideas: {
    type: "object",
    required: ["nombre", "descripcion", "usuario", "grado"],
    properties: {
      nombre: {
        type: "string",
        example: "App para cafeter\u00edas",
      },
      descripcion: {
        type: "string",
        example: "Una app para gestionar pedidos de cafeter\u00edas.",
      },
      usuario: {
        type: "string",
        example: "6617f1f57e95e18f0fbf0a7a",
      },
      grado: {
        type: "string",
        example: "INSO",
      },
    },
  },
  Projects: {
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
      name: {
        type: "string",
        example: "App Gesti\u00f3n Proyectos",
      },
      contactPerson: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "Ana G\u00f3mez",
          },
          email: {
            type: "string",
            example: "ana@empresa.com",
          },
          phone: {
            type: "string",
            example: "666555444",
          },
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
      description: {
        type: "string",
        example: "Desarrollo de una app para gestionar proyectos.",
      },
      startDate: {
        type: "string",
        format: "date",
        example: "2025-03-01",
      },
      endDate: {
        type: "string",
        format: "date",
        example: "2025-06-30",
      },
      responsibles: {
        type: "array",
        items: {
          type: "string",
        },
        example: ["6617f1f57e95e18f0fbf0a7e"],
      },
      users: {
        type: "array",
        items: {
          type: "string",
        },
      },
      budget: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "Presupuesto Proyecto",
          },
          reason: {
            type: "string",
            example: "Necesidad de recursos para desarrollo",
          },
          totalGeneral: {
            type: "number",
            example: 12000,
          },
        },
      },
      practicesAgreement: {
        type: "boolean",
        example: true,
      },
      practicesStudents: {
        type: "integer",
        example: 2,
      },
      sdpStudents: {
        type: "integer",
        example: 3,
      },
    },
  },
  Storage: {
    type: "object",
    required: ["filename", "url"],
    properties: {
      filename: {
        type: "string",
        example: "logo.png",
      },
      url: {
        type: "string",
        example: "http://localhost:5000/logo.png",
      },
    },
  },
  Users: {
    type: "object",
    required: ["name", "surname", "email", "password", "dni", "rol", "grade"],
    properties: {
      name: {
        type: "string",
        example: "Laura",
      },
      surname: {
        type: "string",
        example: "Garc\u00eda",
      },
      email: {
        type: "string",
        example: "laura@u-tad.com",
      },
      password: {
        type: "string",
        example: "********",
      },
      dni: {
        type: "string",
        example: "12345678A",
      },
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
      projects: {
        type: "array",
        items: {
          type: "string",
        },
        example: ["6617f1f57e95e18f0fbf0a7d"],
      },
      isVerified: {
        type: "boolean",
        example: false,
      },
      verificationCode: {
        type: "string",
        example: "928371",
      },
      verificationAttempts: {
        type: "integer",
        example: 3,
      },
      verificationCodeExpires: {
        type: "string",
        format: "date-time",
      },
      profileImage: {
        type: "string",
        example: "https://cdn.img/profile.png",
      },
    },
  },
  UserUpdate: {
    type: "object",
    properties: {
      name: {
        type: "string",
        example: "Iván",
      },
      surname: {
        type: "string",
        example: "Martínez",
      },
      dni: {
        type: "string",
        example: "12345678Z",
      },
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
  Reservations: {
    type: "object",
    required: ["user", "table", "project", "date", "startTime", "endTime"],
    properties: {
      user: {
        type: "string",
        description: "ID del usuario que realiza la reserva",
        example: "6617f1f57e95e18f0fbf0a7b",
      },
      table: {
        type: "string",
        description: "ID de la mesa reservada",
        example: "6617f1f57e95e18f0fbf0a7c",
      },
      project: {
        type: "string",
        description: "ID del proyecto asociado",
        example: "6617f1f57e95e18f0fbf0a7d",
      },
      date: {
        type: "string",
        format: "date",
        example: "2025-05-10",
      },
      startTime: {
        type: "string",
        example: "10:00",
      },
      endTime: {
        type: "string",
        example: "12:00",
      },
      status: {
        type: "string",
        enum: ["pending", "approved", "rejected"],
        example: "pending",
      },
    },
  },
  Table: {
    type: "object",
    required: ["number", "zone", "capacity"],
    properties: {
      number: {
        type: "integer",
        example: 5,
      },
      zone: {
        type: "string",
        example: "Zona A",
      },
      capacity: {
        type: "integer",
        example: 4,
      },
    },
  },
  Budget: {
    type: "object",
    properties: {
      title: {
        type: "string",
        example: "Presupuesto inicial",
      },
      reason: {
        type: "string",
        example: "Proyecto de colaboración con empresa externa",
      },
      generalComments: {
        type: "string",
        example: "Versión preliminar",
      },
      tutors: {
        type: "object",
        properties: {
          numTutors: { type: "number", example: 2 },
          estimatedHours: { type: "number", example: 10 },
          pricePerHour: { type: "number", example: 25 },
          subtotal: { type: "number", example: 500 },
        },
      },
      interns: {
        type: "object",
        properties: {
          numInterns: { type: "number", example: 1 },
          estimatedHours: { type: "number", example: 80 },
          pricePerHour: { type: "number", example: 12 },
          subtotal: { type: "number", example: 960 },
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
            subtotal: { type: "number", example: 150 },
          },
        },
      },
      totalGeneral: {
        type: "number",
        example: 1610,
      },
    },
  },
};

export default schemas;
