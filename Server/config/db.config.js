module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "rootroot",
    DB: "justeat",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        azquire: 30000,
        idle: 10000
    }
}