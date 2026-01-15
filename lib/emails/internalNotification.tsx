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
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  specialInstructions?: string;
  useBillingAddress: boolean;
}

export function generateInternalNotificationEmail(
  jobId: string,
  items: CartItem[],
  customerInfo: CustomerInfo,
  orderTotal: number
) {
  const hasCustomFabrication = items.some(item => item.isCustomFabrication);
  const steelEmbedsCount = items.filter(item => item.productType === 'steel-plate-embeds').length;
  const dumpsterGatesCount = items.filter(item => item.productType === 'dumpster-gate').length;

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
              Qty: ${config.quantity}${config.isCustom ? ' <span style="color: #DC143C; font-weight: bold;">(CUSTOM)</span>' : ''}
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
    subject: `🚨 New Order: ${jobId} - $${orderTotal.toFixed(2)}${hasCustomFabrication ? ' [CUSTOM FABRICATION]' : ''}`,
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
              max-width: 700px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              background: linear-gradient(135deg, #DC143C 0%, #B01030 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
            }
            .alert-badge {
              background-color: ${hasCustomFabrication ? '#ff9800' : '#4caf50'};
              color: white;
              padding: 10px 20px;
              border-radius: 4px;
              display: inline-block;
              font-weight: bold;
              margin: 15px 0;
              font-size: 14px;
            }
            .content {
              padding: 30px 20px;
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
            .summary-box {
              background-color: #f9f9f9;
              border: 2px solid #DC143C;
              border-radius: 4px;
              padding: 20px;
              margin: 20px 0;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .summary-row:last-child {
              border-bottom: none;
              font-weight: bold;
              font-size: 18px;
              margin-top: 10px;
              padding-top: 15px;
              border-top: 2px solid #DC143C;
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
            .action-button {
              display: inline-block;
              background-color: #DC143C;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin: 10px 5px;
            }
            .footer {
              background-color: #1a1a1a;
              color: #999;
              padding: 20px;
              text-align: center;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🚨 New Order Received</h1>
              <div class="alert-badge">
                ${hasCustomFabrication ? '⚠️ CUSTOM FABRICATION REQUIRED' : '✓ Standard Order'}
              </div>
            </div>
            
            <div class="content">
              <div class="order-id">
                Job ID: ${jobId}
              </div>
              
              <div class="summary-box">
                <div class="summary-row">
                  <span>Order Total:</span>
                  <span style="font-size: 20px; color: #DC143C; font-weight: bold;">$${orderTotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>Total Items:</span>
                  <span>${items.length}</span>
                </div>
                <div class="summary-row">
                  <span>Steel Embeds:</span>
                  <span>${steelEmbedsCount}</span>
                </div>
                <div class="summary-row">
                  <span>Dumpster Gates:</span>
                  <span>${dumpsterGatesCount}</span>
                </div>
                <div class="summary-row">
                  <span>Customer:</span>
                  <span>${customerInfo.name}${customerInfo.company ? ` (${customerInfo.company})` : ''}</span>
                </div>
                <div class="summary-row">
                  <span>Email:</span>
                  <span><a href="mailto:${customerInfo.email}" style="color: #DC143C;">${customerInfo.email}</a></span>
                </div>
                <div class="summary-row">
                  <span>Phone:</span>
                  <span><a href="tel:${customerInfo.phone}" style="color: #DC143C;">${customerInfo.phone}</a></span>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Order Items</div>
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
                <div class="section-title">Customer Information</div>
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
                  <span class="info-label">Email:</span>
                  <a href="mailto:${customerInfo.email}" style="color: #DC143C;">${customerInfo.email}</a>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <a href="tel:${customerInfo.phone}" style="color: #DC143C;">${customerInfo.phone}</a>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Shipping Address</div>
                <div class="info-row">
                  ${customerInfo.shippingAddress.street}<br>
                  ${customerInfo.shippingAddress.city}, ${customerInfo.shippingAddress.state} ${customerInfo.shippingAddress.zip}<br>
                  ${customerInfo.shippingAddress.country}
                </div>
              </div>
              
              ${customerInfo.useBillingAddress && customerInfo.billingAddress ? `
              <div class="section">
                <div class="section-title">Billing Address</div>
                <div class="info-row">
                  ${customerInfo.billingAddress.street}<br>
                  ${customerInfo.billingAddress.city}, ${customerInfo.billingAddress.state} ${customerInfo.billingAddress.zip}<br>
                  ${customerInfo.billingAddress.country}
                </div>
              </div>
              ` : ''}
              
              ${customerInfo.specialInstructions ? `
              <div class="section">
                <div class="section-title">Special Instructions</div>
                <p style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ff9800;">
                  ${customerInfo.specialInstructions.replace(/\n/g, '<br>')}
                </p>
              </div>
              ` : ''}
              
              ${hasCustomFabrication ? `
              <div class="section">
                <div style="background-color: #fff3cd; border: 2px solid #ff9800; border-radius: 4px; padding: 15px; margin: 20px 0;">
                  <strong style="color: #ff9800;">⚠️ CUSTOM FABRICATION REQUIRED</strong>
                  <p style="margin: 10px 0 0 0;">This order contains custom fabrication items. Please review specifications carefully.</p>
                </div>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yetiwelding.com'}/order/track/${jobId}" class="action-button">
                  View Order Details
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Yeti Welding Order Management System</strong></p>
              <p>This is an automated notification. Order received at ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
NEW ORDER RECEIVED - ${jobId}

${hasCustomFabrication ? '⚠️ CUSTOM FABRICATION REQUIRED' : 'Standard Order'}

Job ID: ${jobId}
Order Total: $${orderTotal.toFixed(2)}
Total Items: ${items.length}
Steel Embeds: ${steelEmbedsCount}
Dumpster Gates: ${dumpsterGatesCount}

CUSTOMER INFORMATION:
Name: ${customerInfo.name}
${customerInfo.company ? `Company: ${customerInfo.company}\n` : ''}Email: ${customerInfo.email}
Phone: ${customerInfo.phone}

SHIPPING ADDRESS:
${customerInfo.shippingAddress.street}
${customerInfo.shippingAddress.city}, ${customerInfo.shippingAddress.state} ${customerInfo.shippingAddress.zip}
${customerInfo.shippingAddress.country}

${customerInfo.useBillingAddress && customerInfo.billingAddress ? `
BILLING ADDRESS:
${customerInfo.billingAddress.street}
${customerInfo.billingAddress.city}, ${customerInfo.billingAddress.state} ${customerInfo.billingAddress.zip}
${customerInfo.billingAddress.country}
\n` : ''}ORDER ITEMS:
${items.map((item, index) => {
  if (item.productType === 'steel-plate-embeds') {
    const config = item.configuration as EmbedSpec;
    return `${index + 1}. Steel Plate Embed: ${config.plate.length}" × ${config.plate.width}" × ${config.plate.thickness}" • $${item.price.toFixed(2)}`;
  } else {
    const config = item.configuration as DumpsterGateConfig;
    const sizeDisplay = config.isCustom ? `${config.widthFt}' × ${config.heightFt}'` : config.size;
    return `${index + 1}. Dumpster Gate: ${sizeDisplay}${config.isCustom ? ' (CUSTOM)' : ''} • $${item.price.toFixed(2)}`;
  }
}).join('\n')}

Total: $${orderTotal.toFixed(2)}

${customerInfo.specialInstructions ? `SPECIAL INSTRUCTIONS:\n${customerInfo.specialInstructions}\n\n` : ''}${hasCustomFabrication ? '⚠️ CUSTOM FABRICATION REQUIRED - Please review specifications carefully.\n\n' : ''}View order: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://yetiwelding.com'}/order/track/${jobId}

Order received at: ${new Date().toLocaleString()}
    `.trim(),
  };
}





