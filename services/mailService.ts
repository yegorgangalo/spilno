import nodemailer from 'nodemailer'
import * as aws from '@aws-sdk/client-ses'

interface ISendEmail {
    subject: string
    toEmail: string
    html: string
}

const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_KEY_AWS,
  },
})

//-----------------------------------------------------------------------------
export const sendMail = async ({ subject, toEmail, html }: ISendEmail) => {
  try {
    const transporter = nodemailer.createTransport({ SES: { ses, aws } })
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.NODEMAILER_USER,
    //     pass: process.env.NODEMAILER_PASSWORD,
    //   },
    // })

    const mailOptions = {
      from: `mail@${process.env.BASE_URL}`,
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
