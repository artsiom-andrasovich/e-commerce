import handlebars from "handlebars";

const source = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
  <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
  <p>Dear Customer,</p>
  <p>Thank you for your order! We are pleased to confirm that your order has been received and is being processed.</p>
  
  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <thead>
      <tr style="background-color: #f8f8f8;">
        <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
        <th style="padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Quantity</th>
        <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
      </tr>
    </thead>
    <tbody>
      {{#each items}}
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{product.title}}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">{{quantity}}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">{{priceAtPurchase}} {{../currency}}</td>
      </tr>
      {{/each}}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
        <td style="padding: 8px; text-align: right; font-weight: bold;">{{totalAmount}} {{currency}}</td>
      </tr>
    </tfoot>
  </table>

  <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
    <h4 style="margin-top: 0;">Delivery details:</h4>
    <p style="margin: 5px 0;">Method: {{deliveryMethod}}</p>
    <p style="margin: 5px 0;">Recipient: {{billingInfo.firstName}} {{billingInfo.lastName}}</p>
    <p style="margin: 5px 0;">Address: {{billingInfo.street}}, {{billingInfo.city}}, {{billingInfo.zipCode}}, {{billingInfo.country}}</p>
  </div>

  <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
    This is an automated email, please do not reply.
  </p>
</div>
`;

export const orderConfirmationTemplate = handlebars.compile(source);
