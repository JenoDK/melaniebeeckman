export default ({ env }) => ({
  // Outgoing mail for booking confirmations and notifications to Melanie.
  // Any SMTP service works (Brevo, Mailjet, Resend, Gmail with an app password).
  // Leave SMTP_HOST empty in local dev: mails are then only written to the log.
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'localhost'),
        port: env.int('SMTP_PORT', 587),
        secure: env.bool('SMTP_SECURE', false),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('MAIL_FROM', 'Melanie Beeckman <noreply@melaniebeeckman.be>'),
        defaultReplyTo: env('MAIL_REPLY_TO'),
      },
    },
  },
});
