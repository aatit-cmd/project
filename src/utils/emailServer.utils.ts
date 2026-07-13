import transporter from "../config/nodemailer.config";
import ENV_CONFIG from "../config/env.config";

export const sendEmail = async () => {
    try {
        await transporter.sendMail({
            // email options
            from: ENV_CONFIG.SMTP_FROM_EMAIL,
            to: "atittulachan6072@gmail.com",
            subject: "Test Email",
            html: "<h1>Welcome to E-commerce</h1>"
        });
        console.log("mail sent");
    }
    catch (error) {
        console.log(error);
    }
}