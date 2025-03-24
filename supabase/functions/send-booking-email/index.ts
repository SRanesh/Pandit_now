import { serve } from 'https://deno.fresh.dev/std@0.177.0/http/server.ts';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')!;
const SENDGRID_FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL')!;

function getEmailTemplate(template: string, details: any) {
  switch (template) {
    case 'booking-request':
      return `
        Dear Pandit Ji,

        You have received a new booking request:

        Devotee: ${details.devoteeName}
        Ceremony: ${details.ceremony}
        Date: ${details.date}
        Time: ${details.time}
        Location: ${details.location}

        Please log in to your account to accept or decline this booking.

        Best regards,
        PanditJi Team
      `;

    case 'booking-confirmation':
      return `
        Dear Devotee,

        Your booking has been confirmed:

        Pandit: ${details.panditName}
        Ceremony: ${details.ceremony}
        Date: ${details.date}
        Time: ${details.time}
        Location: ${details.location}

        Please log in to your account to view the full booking details.

        Best regards,
        PanditJi Team
      `;

    case 'booking-cancellation':
      const userType = details.userType === 'devotee' ? 'Pandit' : 'Devotee';
      return `
        Dear ${userType},

        A booking has been cancelled:

        ${userType}: ${details.counterpartyName}
        Ceremony: ${details.ceremony}
        Date: ${details.date}
        Time: ${details.time}

        Please log in to your account for more information.

        Best regards,
        PanditJi Team
      `;

    default:
      throw new Error('Invalid email template');
  }
}

serve(async (req) => {
  try {
    const { to, subject, template, bookingDetails } = await req.json();
    const emailContent = getEmailTemplate(template, bookingDetails);

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: SENDGRID_FROM_EMAIL },
        subject,
        content: [{ type: 'text/plain', value: emailContent }],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});