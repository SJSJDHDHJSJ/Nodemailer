const nodeMailer = require('nodemailer')
const emails = ['renjishavj@gmail.com']
const dotenv = require("dotenv").config()
const pass = process.env.PASS

const sendMail = async (emails, otp) => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'idrkgngfr55@gmail.com',
            pass: `${pass}`
        }
    })
    const info = await transporter.sendMail({
        from: '"NodeMailer"<idrkgngfr55@gmail.com>',
        to: emails,
        subject: 'testing',
        html: `<h2>${otp}</h2>`,
    })
}

module.exports = sendMail