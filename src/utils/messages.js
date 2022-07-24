const generateMessage = (name, text) => {
    return {
        name,
        text,
        timeStamp: new Date().getTime(),
    }
}

const generateLocationMessage = (name, url) => {
    return {
        name,
        url,
        timeStamp: new Date().getTime(),
    }
}

module.exports = { generateMessage, generateLocationMessage }