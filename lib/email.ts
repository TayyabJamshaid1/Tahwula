import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email: string, link: string) {
    console.log(email,link);
    
  await resend.emails.send({
from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${link}">Reset Password</a>
    `,
  }).then(()=>console.log("done")
  ).catch(err=>console.log(err)
  )
}
