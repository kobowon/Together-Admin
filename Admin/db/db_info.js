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
            host: '210.89.188.132',
            port: '3306',
            user: 'dev_volma',
            password: 'volma!1team@2',
            database: 'volma'
        },
        dev: { // dev server db info
            host: '210.89.188.132',
            port: '3306',
            user: 'dev_volma',
            password: 'volma!1team@2',
            database: 'volma'
        }
    }
})();
