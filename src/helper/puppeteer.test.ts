import generatePdf from "./puppeteer";

describe('Puppeteer test', () => {
    it('Should generate a buffer', async () => {
        const html = '<p>hello friend</p>'

        const buffer = await generatePdf(html)

        expect(buffer).toBeInstanceOf(Buffer)
    })
})