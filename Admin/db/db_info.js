module.exports = (function () {
    return {
        local: { // localhost
            host: 'localhost',
            port: '3306',
            user: 'bowon',
            password: 'kobo724**',
            database: 'my_db'
        },
        real: { // real server db info
            host: '',
            port: '',
            user: '',
            password: '!',
            database: ''
        },
        dev: { // dev server db info
            host: '',
            port: '',
            user: '',
            password: '',
            database: ''
        }
    }
})();
