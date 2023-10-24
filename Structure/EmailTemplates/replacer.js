
const replaceHandler = (content, wordsToReplace) => {
    return Object.keys(wordsToReplace).reduce(
        (f, s, i) =>
            `${f}`.replace(new RegExp(s, 'ig'), wordsToReplace[s]),
        content
    )
}

module.exports = { replaceHandler }
