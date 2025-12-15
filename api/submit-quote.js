// api/submit-quote.js

const { Resend } = require('resend');
const { formidable } = require('formidable');
const fs = require('fs');

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENTS = ['csproles02@gmail.com', 'carsonrsproles@gmail.com']; 
const SENDER = 'Quote Form <support@trustydahorse.com>';

module.exports = async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const form = formidable({
        allowEmptyFiles: true,
        maxFileSize: 10 * 1024 * 1024,
    });

    try {
        const [fields, files] = await form.parse(req);
        
        const name = fields.name?.[0] || 'N/A';
        const email = fields.email?.[0] || 'N/A';
        const phone = fields.phone?.[0] || 'N/A';
        const message = fields.message?.[0] || 'N/A';
        const uploadedFile = files.project_file?.[0];

        const emailBody = `
            New Quote Request from Website:
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Message: ${message}
            File Attached: ${uploadedFile ? uploadedFile.originalFilename : 'No file attached'}
        `;

        let attachments = [];
        if (uploadedFile && uploadedFile.filepath) {
            const fileData = fs.readFileSync(uploadedFile.filepath);
            attachments.push({
                filename: uploadedFile.originalFilename,
                content: fileData.toString('base64'),
            });
        }

        const data = await resend.emails.send({
            from: SENDER,
            to: RECIPIENTS,
            subject: `NEW QUOTE: ${name} (${email})`,
            text: emailBody,
            attachments: attachments,
        });

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ success: true, message: 'Quote submitted successfully!' });

    } catch (error) {
        console.error('Error processing quote submission:', error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ 
            success: false, 
            message: 'There was an error submitting your quote. Please call us directly.' 
        });
    }
};