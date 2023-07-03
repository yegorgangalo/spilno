import nodemailer from 'nodemailer'

interface ISendEmail {
    subject: string
    toEmail: string
    html: string
    // text: string
}

//-----------------------------------------------------------------------------
export const sendMail = async ({ subject, toEmail, html }: ISendEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: toEmail,
      subject: subject,
      attachDataUrls: true, //to accept base64 content in messsage
      html,
    }

    const sendResult = await transporter.sendMail(mailOptions)
    console.log('sendMail result', sendResult);
    return true
  } catch (error) {
    console.log('sendMail error', (error as Error).message)
    return false
  }
}
