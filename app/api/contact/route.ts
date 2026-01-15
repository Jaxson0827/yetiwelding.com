import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/contact/route.ts:module-init',message:'Contact route module init',data:{hasResendKey:!!process.env.RESEND_API_KEY,hasResendFrom:!!process.env.RESEND_FROM_EMAIL,hasBusinessEmail:!!process.env.BUSINESS_EMAIL},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
// #endregion
let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function POST(request: NextRequest) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/contact/route.ts:POST',message:'Contact POST start',data:{hasResendKey:!!process.env.RESEND_API_KEY,hasResendFrom:!!process.env.RESEND_FROM_EMAIL,hasBusinessEmail:!!process.env.BUSINESS_EMAIL},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{});
  // #endregion
  try {
    const formData = await request.formData();

    // Extract form fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const inquiryType = formData.get('inquiryType') as string;
    const projectType = formData.get('projectType') as string;
    const message = formData.get('message') as string;
    const preferredContact = formData.get('preferredContact') as string;
    const urgency = formData.get('urgency') as string;
    const file = formData.get('file') as File | null;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Prepare email content
    const inquiryTypeLabels: Record<string, string> = {
      general: 'General Inquiry',
      quote: 'Quote Request',
      service: 'Service Inquiry',
      support: 'Support',
    };

    const urgencyLabels: Record<string, string> = {
      low: 'Low - No rush',
      normal: 'Normal - Within a week',
      high: 'High - Within 48 hours',
      urgent: 'Urgent - As soon as possible',
    };

    const preferredContactLabels: Record<string, string> = {
      phone: 'Phone',
      email: 'Email',
      text: 'Text Message',
    };

    // Prepare attachments if file is present
    const attachments = file ? [
      {
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      },
    ] : undefined;

    // Send email to business email
    const businessEmail = process.env.BUSINESS_EMAIL || process.env.RESEND_FROM_EMAIL;
    
    if (!businessEmail) {
      console.error('BUSINESS_EMAIL is not set in environment variables');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/contact/route.ts:send',message:'Attempting to send contact email',data:{hasAttachments:!!attachments,hasBusinessEmail:!!businessEmail},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    const resendInstance = getResend();
    if (!resendInstance) {
      console.error('RESEND_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const { data, error } = await resendInstance.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Yeti Welding Contact <onboarding@resend.dev>',
      to: [businessEmail],
      replyTo: email,
      subject: `New Contact Form: ${inquiryTypeLabels[inquiryType] || inquiryType} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #DC143C; color: white; padding: 20px; text-align: center; }
              .content { background-color: #f9f9f9; padding: 20px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #DC143C; }
              .value { margin-top: 5px; }
              .message-box { background-color: white; padding: 15px; border-left: 4px solid #DC143C; margin-top: 10px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                ${phone ? `
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value"><a href="tel:${phone}">${phone}</a></div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Inquiry Type:</div>
                  <div class="value">${inquiryTypeLabels[inquiryType] || inquiryType}</div>
                </div>
                ${projectType ? `
                <div class="field">
                  <div class="label">Project Type:</div>
                  <div class="value">${projectType}</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Preferred Contact Method:</div>
                  <div class="value">${preferredContactLabels[preferredContact] || preferredContact}</div>
                </div>
                <div class="field">
                  <div class="label">Urgency:</div>
                  <div class="value">${urgencyLabels[urgency] || urgency}</div>
                </div>
                ${file ? `
                <div class="field">
                  <div class="label">Attachment:</div>
                  <div class="value">${file.name} (${(file.size / 1024).toFixed(2)} KB)</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from the Yeti Welding contact form.</p>
                <p>You can reply directly to this email to respond to ${name}.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission from Yeti Welding Website

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Inquiry Type: ${inquiryTypeLabels[inquiryType] || inquiryType}
${projectType ? `Project Type: ${projectType}` : ''}
Preferred Contact: ${preferredContactLabels[preferredContact] || preferredContact}
Urgency: ${urgencyLabels[urgency] || urgency}
${file ? `Attachment: ${file.name} (${(file.size / 1024).toFixed(2)} KB)` : ''}

Message:
${message}
      `.trim(),
      attachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        {
          error: 'Failed to send email. Please try again later.',
        },
        { status: 500 }
      );
    }

    console.log('Contact form submission sent successfully:', {
      name,
      email,
      inquiryType,
      messageId: data?.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received. We\'ll get back to you within 24 hours.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while processing your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}







