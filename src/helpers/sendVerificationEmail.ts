import Mailjet from "node-mailjet";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmail";

const mailjet = Mailjet.apiConnect(
    process.env.MJ_API_KEY!,
    process.env.MJ_SECRET_KEY!
);


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


        const emailResponse = await mailjet
            .post("send", { version: "v3.1" })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "academicstudywork@gmail.com",   
                            Name: "AnonymsG",
                        },
                        To: [
                            {
                                Email: email,
                            },
                        ],

                        Subject: "AnonymsG | Verification Code",
                        HTMLPart: html,
                    },
                ],
            });

        console.log("verification email sent?", emailResponse);
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