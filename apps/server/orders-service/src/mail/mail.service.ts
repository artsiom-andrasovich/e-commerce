import { TOrder } from "@app/lib-shared-types";
import { env, logger } from "@configs";
import nodemailer from "nodemailer";
import { orderConfirmationTemplate } from "./templates/order-confirmation";

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT),
      secure: env.SMTP_PORT === "465",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  public async sendOrderConfirmation(to: string, order: TOrder) {
    try {
      const html = orderConfirmationTemplate(order);

      await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to,
        subject: `Order Confirmation - Order #${order.id}`,
        html,
      });

      logger.info(`Order confirmation email sent to: ${to}`);
    } catch (error) {
      logger.error("Failed to send order confirmation email:", error);
    }
  }
}

export const mailService = new MailService();
