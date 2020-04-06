class Err extends Error {
    constructor({ status, name, message }) {
        super(message);
        this.status = status;
        this.name = name;
    }

    static handler(err, req, res, next) {
        console.log(err);
        if (err.status) {
            res.status(err.status).json({ name: err.name, message: err.message });
        }
        else {
            res.status(500);
        }
    }

    static isEmpty(field) {
        if (field === null || typeof field === 'undefined' || field === '')
            return true;
        return false;
    }
}

module.exports = Err;