/**
 * A simulated service for sending emails.
 * In a real application, this would use an email API provider like SendGrid, AWS SES, or Mailgun.
 */
const EmailService = {
  /**
   * Sends an email.
   * @param {string} to - The recipient's email address.
   * @param {string} subject - The email subject.
   * @param {string} body - The email body (can be HTML).
   * @param {object} options - Additional options like 'fromName', 'fromEmail'.
   */
  async send(to, subject, body, options = {}) {
    const from = options.fromEmail || 'noreply@curling.ca';
    const fromName = options.fromName || 'Curling Canada';

    console.log(`[EMAIL SERVICE] Simulating sending email:`);
    console.log(`  - From: "${fromName}" <${from}>`);
    console.log(`  - To: ${to}`);
    console.log(`  - Subject: ${subject}`);
    // Do not log the body in production for privacy reasons, but we do for simulation.
    console.log(`  - Body: ${body.substring(0, 100)}...`);

    // In a real implementation:
    // await sendgrid.send({
    //   to: to,
    //   from: { email: from, name: fromName },
    //   subject: subject,
    //   html: body,
    // });

    return { success: true, messageId: `simulated_${Date.now()}` };
  }
};

export default EmailService;