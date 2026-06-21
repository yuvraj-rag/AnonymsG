import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
    process.env.MJ_API_KEY!,
    process.env.MJ_SECRET_KEY!
);

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {

    await mailjet
        .post("send", { version: "v3.1" })
        .request({
            Messages: [
                {
                    From: {
                        Email: "your_verified_email@gmail.com",
                        Name: "AnonyMsg",
                    },

                    To: [
                        {
                            Email: to,
                        },
                    ],

                    Subject: subject,

                    HTMLPart: html,
                },
            ],
        });
}