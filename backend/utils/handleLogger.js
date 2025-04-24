import { IncomingWebhook } from "@slack/webhook";

const errorWebhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_ERRORS);
const eventWebhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_EVENTS);

// Stream para logs de errores HTTP (morgan-body)
const loggerStream = {
  write: (message) => {
    errorWebhook.send({ text: message });
  },
};

// Función para enviar logs personalizados (acciones, eventos, etc.)
export const logEvent = async (message) => {
  try {
    await eventWebhook.send({ text: message });
  } catch (err) {
    console.error("❌ Error enviando log de evento a Slack:", err.message);
  }
};

export default loggerStream;
