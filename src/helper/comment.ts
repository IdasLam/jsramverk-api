import { CommentData } from "../app";
import * as document from '../database/models/documents'

export const addComentToText = async (id: string, data: CommentData, usernamne: string) => {
    // insert end then front
    const doc = await document.findDocument(id)
    let content = (doc).content

    let contentNoHtml = content.replace(/<\/comment[^>]*>/gi, '')
    contentNoHtml = contentNoHtml.replace(/<\/ol[^>]*>/gi, '')
    contentNoHtml = contentNoHtml.replace(/<[^>]*><br><\/[^>]*>/gi, '\n')
    contentNoHtml = contentNoHtml.replace(/<\/[^>]*>/gi, '\n')
    contentNoHtml = contentNoHtml.replace(/<br>/gi, '\n')
    contentNoHtml = contentNoHtml.replace(/&nbsp; ?/g, ' ')
    contentNoHtml = contentNoHtml.replace(/<[^>]*>/g, '')
    let noHtmlIndexes: number[] = []

    while (contentNoHtml.indexOf(data.selected) != -1) {
        const index = contentNoHtml.indexOf(data.selected)
        contentNoHtml = contentNoHtml.slice(index + data.selected.length)

        const afterLastWord = noHtmlIndexes[noHtmlIndexes.length - 1] ?? 0
        noHtmlIndexes.push(index + (afterLastWord != 0 && afterLastWord + data.selected.length))
    }

    const wordIndex = noHtmlIndexes.indexOf(data.start)

    let contentHtml = content
    let htmlIndexes: number[] = []

    while (contentHtml.indexOf(data.selected) != -1) {
        const index = contentHtml.indexOf(data.selected)

        contentHtml = contentHtml.slice(index + data.selected.length)

        const afterLastWord = htmlIndexes[htmlIndexes.length - 1] ?? 0
        htmlIndexes.push(index + (afterLastWord != 0 && afterLastWord + data.selected.length))
    }

    const startIndex = htmlIndexes[wordIndex]
    const endIndex = htmlIndexes[wordIndex] + data.selected.length
    const foundWord = content.slice(startIndex, endIndex)

    if (foundWord === data.selected) {

        const left = content.slice(0, startIndex)
        const right = content.slice(endIndex)


        const commentId = await document.saveComment(id, {selected: data.selected, y: data.start, comment: data.comment, user: usernamne, date: (new Date()).toString()})
        // add id
        const insert = `<comment id="${commentId}">${foundWord}</comment>`
        
        const newContent = left + insert + right

        await document.saveDocument({_id: id, title: doc.title, content: newContent, code: doc.code})

        return
    }

    throw new Error("Something went wrong :(");
}
