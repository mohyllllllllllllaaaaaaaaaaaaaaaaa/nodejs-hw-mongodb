import createHttpError from 'http-errors';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
     port: +process.env.SMTP_PORT,
   
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});
export const sendEmail = async ({to, html, subject}) => {
    try{
        await transporter.sendMail({
            to,
            html,
            subject,
            from: process.env.SMTP_FROM,
        });
    }catch(error){
        console.error(error);
        throw createHttpError(500, 'failed to send email');
    }
};