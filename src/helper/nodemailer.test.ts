import { sendInvite, close } from "./nodemailer";

describe('Send mail', () => {
    const users = ['idla18@student.bth.se']
    const docName = 'Test Doc'
    
    it('Should send mail', async () => {
        const sent = await sendInvite(users, docName)
        close()

        expect(sent).toBe('Sent')
    })

    it('Should not send mail', async () => {
        try {
            const sent = await sendInvite(['test'], docName)
            close()

        } catch(err) {
            expect(err).toBeInstanceOf(Error)
        }
    })
})