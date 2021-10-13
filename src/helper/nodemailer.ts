import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendInvite = (users: string[], documentName: string) => {
    const recipients = users.join(", ")
    return new Promise((resolve, reject ) => {
        transporter.sendMail({
            from: '"jsramverk app" <testmail.idal@gmail.com>', // sender address
            to: recipients, // list of receivers
            subject: `Invited to document: ${documentName}`, // Subject line
            html: `
                <h1>You have beein invited to edit the document: ${documentName}</h1>
                <a href="https://www.student.bth.se/~idla18/editor/" target="__BLANK">Sign in here</a>
            `,
          }, (err) => {
            if (err) {
                return reject(err)
            }
            return resolve('Sent')
          });
    })
}