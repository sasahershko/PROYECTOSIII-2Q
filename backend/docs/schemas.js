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

  
};

export default schemas;
