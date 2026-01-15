import { CartItem } from '@/contexts/CartContext';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { DumpsterGateConfig } from '@/lib/dumpsterGates/types';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  specialInstructions?: string;
}

export function generateOrderConfirmationEmail(
  jobId: string,
  items: CartItem[],
  customerInfo: CustomerInfo,
  orderTotal: number
) {
  const renderItemDetails = (item: CartItem, index: number) => {
    if (item.productType === 'steel-plate-embeds') {
      const config = item.configuration as EmbedSpec;
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
            <strong>Steel Plate Embed #${index + 1}</strong><br>
            <span style="color: #666; font-size: 14px;">
              ${config.plate.length}" × ${config.plate.width}" × ${config.plate.thickness}" • ${config.plate.material}<br>
              ${config.studs?.positions?.length || 0} studs • Qty: ${config.quantity}<br>
              Finish: ${config.finish} • ${config.leadTime === 'rush' ? 'Rush' : 'Standard'} lead time
            </span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            $${item.price.toFixed(2)}
          </td>
        </tr>
      `;
    } else {
      const config = item.configuration as DumpsterGateConfig;
      const sizeDisplay = config.isCustom 
        ? `${config.widthFt}' × ${config.heightFt}'`
        : config.size;
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
            <strong>Dumpster Gate #${index + 1}</strong><br>
            <span style="color: #666; font-size: 14px;">
              Size: ${sizeDisplay} • Style: ${config.style.replace('-', ' ')}<br>
              Finish: ${config.finish.replace('-', ' ')} • ${config.mounting.replace('-', ' ')}<br>
              Qty: ${config.quantity}
            </span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            $${item.price.toFixed(2)}
          </td>
        </tr>
      `;
    }
  };

  const itemsHtml = items.map((item, index) => renderItemDetails(item, index)).join('');

  return {
    subject: `Order Confirmation - ${jobId} | Yeti Welding`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              background: linear-gradient(135deg, #000000 0%, #2a0a0a 50%, #3c0f0f 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 30px 20px;
            }
            .success-badge {
              background-color: #DC143C;
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              display: inline-block;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .order-id {
              background-color: #f9f9f9;
              border-left: 4px solid #DC143C;
              padding: 15px;
              margin: 20px 0;
              font-family: monospace;
              font-size: 18px;
              font-weight: bold;
            }
            .section {
              margin: 30px 0;
            }
            .section-title {
              color: #DC143C;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              border-bottom: 2px solid #DC143C;
              padding-bottom: 5px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .items-table th {
              background-color: #f9f9f9;
              padding: 12px;
              text-align: left;
              border-bottom: 2px solid #DC143C;
              color: #333;
            }
            .total-row {
              background-color: #f9f9f9;
              font-weight: bold;
              font-size: 18px;
            }
            .info-row {
              padding: 8px 0;
            }
            .info-label {
              font-weight: bold;
              color: #666;
              width: 150px;
              display: inline-block;
            }
            .footer {
              background-color: #1a1a1a;
              color: #999;
              padding: 30px 20px;
              text-align: center;
              font-size: 12px;
            }
            .footer a {
              color: #DC143C;
              text-decoration: none;
            }
            .button {
              display: inline-block;
              background-color: #DC143C;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #B01030;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Order Confirmation</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order!</p>
            </div>
            
            <div class="content">
              <div class="success-badge">✓ Order Received</div>
              
              <p>Dear ${customerInfo.name},</p>
              
              <p>Thank you for your order with Yeti Welding! We've received your order and will begin processing it shortly.</p>
              
              <div class="order-id">
                Job ID: ${jobId}
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Please save this Job ID for your records. You can use it to track your order status.
              </p>
              
              <div class="section">
                <div class="section-title">Order Details</div>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th style="text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <tr class="total-row">
                      <td style="padding: 15px; border-top: 2px solid #DC143C;">
                        <strong>Total</strong>
                      </td>
                      <td style="padding: 15px; border-top: 2px solid #DC143C; text-align: right;">
                        <strong>$${orderTotal.toFixed(2)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="section">
                <div class="section-title">Shipping Address</div>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  ${customerInfo.name}
                </div>
                ${customerInfo.company ? `
                <div class="info-row">
                  <span class="info-label">Company:</span>
                  ${customerInfo.company}
                </div>
                ` : ''}
                <div class="info-row">
                  <span class="info-label">Address:</span>
                  ${customerInfo.shippingAddress.street}<br>
                  ${customerInfo.shippingAddress.city}, ${customerInfo.shippingAddress.state} ${customerInfo.shippingAddress.zip}<br>
                  ${customerInfo.shippingAddress.country}
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  ${customerInfo.phone}
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  ${customerInfo.email}
                </div>
              </div>
              
              ${customerInfo.specialInstructions ? `
              <div class="section">
                <div class="section-title">Special Instructions</div>
                <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #DC143C;">
                  ${customerInfo.specialInstructions.replace(/\n/g, '<br>')}
                </p>
              </div>
              ` : ''}
              
              <div class="section">
                <div class="section-title">What's Next?</div>
                <ul style="line-height: 2;">
                  <li>Our team will review your order and contact you if any clarification is needed</li>
                  <li>Standard lead time is 2-3 weeks. Rush orders may be available upon request</li>
                  <li>You'll receive updates as your order progresses</li>
                  <li>You can track your order status using your Job ID</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yetiwelding.com'}/order/track/${jobId}" class="button">
                  Track Your Order
                </a>
              </div>
              
              <p style="margin-top: 30px;">
                If you have any questions about your order, please don't hesitate to contact us.
              </p>
              
              <p>
                Best regards,<br>
                <strong>The Yeti Welding Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Yeti Welding</strong></p>
              <p>Professional Welding Services | Custom Fabrication</p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yetiwelding.com'}">Visit our website</a> | 
                <a href="mailto:${process.env.BUSINESS_EMAIL || 'info@yetiwelding.com'}">Contact us</a>
              </p>
              <p style="margin-top: 20px; color: #666;">
                This is an automated confirmation email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Order Confirmation - ${jobId}

Dear ${customerInfo.name},

Thank you for your order with Yeti Welding! We've received your order and will begin processing it shortly.

Job ID: ${jobId}

ORDER DETAILS:
${items.map((item, index) => {
  if (item.productType === 'steel-plate-embeds') {
    const config = item.configuration as EmbedSpec;
    return `${index + 1}. Steel Plate Embed: ${config.plate.length}" × ${config.plate.width}" × ${config.plate.thickness}" • $${item.price.toFixed(2)}`;
  } else {
    const config = item.configuration as DumpsterGateConfig;
    const sizeDisplay = config.isCustom ? `${config.widthFt}' × ${config.heightFt}'` : config.size;
    return `${index + 1}. Dumpster Gate: ${sizeDisplay} • $${item.price.toFixed(2)}`;
  }
}).join('\n')}

Total: $${orderTotal.toFixed(2)}

SHIPPING ADDRESS:
${customerInfo.name}
${customerInfo.company ? `${customerInfo.company}\n` : ''}${customerInfo.shippingAddress.street}
${customerInfo.shippingAddress.city}, ${customerInfo.shippingAddress.state} ${customerInfo.shippingAddress.zip}
${customerInfo.shippingAddress.country}
Phone: ${customerInfo.phone}
Email: ${customerInfo.email}

${customerInfo.specialInstructions ? `SPECIAL INSTRUCTIONS:\n${customerInfo.specialInstructions}\n\n` : ''}WHAT'S NEXT:
- Our team will review your order and contact you if any clarification is needed
- Standard lead time is 2-3 weeks
- You'll receive updates as your order progresses
- Track your order: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://yetiwelding.com'}/order/track/${jobId}

If you have any questions, please contact us.

Best regards,
The Yeti Welding Team
    `.trim(),
  };
}





