const express = require('express');
const { execFile } = require('child_process'); // Using execFile for better security with arguments
const crypto = require('crypto'); // For comparing secrets safely

const app = express();
const PORT = 3005; // Choose an unused port for this listener
const DEPLOY_SCRIPT_PATH = 'BUILD_AND_DEPLOY_SCRIPT.sh';
const WEBHOOK_SECRET = 'SECCRET';

// Middleware to parse JSON request bodies (Strapi webhooks send JSON)
app.use(express.json());

// The endpoint Strapi will send POST requests to
app.post('/rebuild-astro-prod', (req, res) => {
    console.log(`[${new Date().toISOString()}] Webhook received for /rebuild-astro-prod`);

    // 1. Verify the secret (if you set one in Strapi)
    const signature = req.headers['x-strapi-webhook-secret']; // Or whatever header name you used
    if (!signature) {
        console.warn('Webhook received without signature. Ignoring.');
        return res.status(401).send('Unauthorized: Missing signature.');
    }

    // Basic constant-time comparison for secrets
    // For more robust HMAC signature verification, Strapi might offer it or you'd implement it.
    // This simple check is better than direct string comparison for timing attacks, but HMAC is best.
    const expectedSignatureBuffer = Buffer.from(WEBHOOK_SECRET);
    const receivedSignatureBuffer = Buffer.from(signature);

    if (expectedSignatureBuffer.length !== receivedSignatureBuffer.length ||
        !crypto.timingSafeEqual(expectedSignatureBuffer, receivedSignatureBuffer)) {
        console.warn('Webhook received with invalid signature. Ignoring.');
        return res.status(401).send('Unauthorized: Invalid signature.');
    }

    console.log('Webhook signature verified.');

    // Optional: Log the payload for debugging (be mindful of sensitive data)
    // console.log('Payload:', JSON.stringify(req.body, null, 2));

    // 2. Execute the deployment script
    console.log(`Executing deployment script: ${DEPLOY_SCRIPT_PATH}`);

    // Using execFile is generally safer than exec if you don't need shell features
    execFile(DEPLOY_SCRIPT_PATH, (error, stdout, stderr) => {
        if (error) {
            console.error(`[${new Date().toISOString()}] Deployment script execution failed:`);
            console.error(`Error Code: ${error.code}`);
            console.error(`Error Signal: ${error.signal}`);
            console.error(`Stderr: ${stderr}`);
            // You might want to send a notification (email, Slack) here on failure
            return res.status(500).send('Deployment script execution failed.');
        }
        console.log(`[${new Date().toISOString()}] Deployment script executed successfully:`);
        console.log(`Stdout: ${stdout}`);
        if (stderr) {
            console.warn(`Stderr (during success): ${stderr}`);
        }
        res.status(200).send('Webhook received and deployment process initiated.');
    });
});

app.listen(PORT, '127.0.0.1', () => { // Listen only on localhost
    console.log(`Webhook listener started on http://127.0.0.1:${PORT}`);
});