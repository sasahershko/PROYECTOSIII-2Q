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
};

export default schemas;
