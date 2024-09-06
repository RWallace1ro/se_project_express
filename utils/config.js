// const {JWT_SECRET = process.JWT_SECRET || "secret_key"} = process.env

const { JWT_SECRET = "super-strong-secret" } = process.env;
//"dev-secret"

module.exports = { JWT_SECRET };
