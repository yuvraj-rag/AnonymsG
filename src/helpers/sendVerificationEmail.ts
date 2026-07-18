import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmail";


const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY!,
});


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
) {
    try {
        console.log("sending email");

        const html = await render(
            VerificationEmail({
                username,
                verifyCode,
            })
        );


        const sentFrom = new Sender(
            "noreply@test-69oxl5ekzkkl785k.mlsender.net",
            "AnonymsG"
        );


        const recipients = [
            new Recipient(email, username),
        ];


        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("AnonymsG | Verification Code")
            .setHtml(html);


        const response = await mailerSend.email.send(emailParams);


        console.log("verification email sent?", response);

        return {
            success: true,
            message: "Verification Email sent successfully",
        };

    } catch (emailError) {

        console.error(
            "Error sending verification email",
            emailError
        );

        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}