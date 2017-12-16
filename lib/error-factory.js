let errorFactory = {
    throwsError(msg) {
        console.log("---------------- template-cli -----------");
        console.log(`template-cli: ${msg}`);
    }
};

module.exports = errorFactory;