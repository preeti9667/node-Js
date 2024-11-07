function getUser(req, res, next){
    return res.status(200).json({
        status: 200,
        message: 'user details'
    })
}


module.exports = {
    getUser,
}