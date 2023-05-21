
exports.userDetail = function (user) {
    return {
        id: user._id,
        username: user.username
    }
}