module.exports = function (j) {
    try {
        var x = JSON.parse(j).items;
    } catch (e) {
        console.log("Error Reading JSON");
        return "{}";
    }
    return x;
}