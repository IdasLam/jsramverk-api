import puppeteer from 'puppeteer'

const puppet = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
        ]
    })

    const page = await browser.newPage()

    return {page, browser}
} 

const generatePdf = async (html: string) => {
    const {browser, page} = await puppet()

    await page.setContent(html, 
        {
            waitUntil: 'domcontentloaded'
        }
    )

    const pdfBuffer = await page.pdf({
        format: 'A4'
    })

    await browser.close()

    return pdfBuffer
}

export default generatePdf