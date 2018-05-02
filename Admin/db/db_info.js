module.exports = (function () {
    return {
        local: { // localhost
            //DB 계정 작성
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'aju1218**',
            database: 'volma'
        },
        real: { // real server db info
            host: 'dev_volma',
            port: '3306',
            user: 'dev_volma',
            password: 'volma!1team@2',
            database: 'volma'
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
