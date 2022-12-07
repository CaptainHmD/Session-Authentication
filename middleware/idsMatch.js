
const isIdsMatch = (req, res, next) => {
    console.log("middle: "+req.cookies["connect.sid"]);
    console.log("middle: " +req.session.id);
    if (!req.session.id || !req.cookies["connect.sid"]) return res.sendStatus(406)
    const c = req.cookies["connect.sid"] + ''
    console.log(c.includes(req.session.id));

    if (!c.includes(req.session.id)) return res.sendStatus(401)
        next()
}

module.exports = isIdsMatch
