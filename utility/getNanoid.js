const { nanoid } = require("nanoid");


function getNanoid (numberOfCharacters) {
    const transactionId = nanoid(numberOfCharacters);
    return transactionId;
}

module.exports = {
    getNanoid
}