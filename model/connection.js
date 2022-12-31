const mysql = require('mysql');

class Connection {
    configToMysql = {
        host: 'localhost',
        user: 'root',
        password: 'khoqua1996',
        charset: 'utf8_general_ci',
        database: 'blog'
    }

    getConnection() {
        return mysql.createConnection(this.configToMysql);
    }

    connected() {
        this.getConnection().connect(err => {
            if (err) {
                console.log(err)
            } else {
                console.log('Connection success')
            }
        })
    }
}
// new Connection().connected();
module.exports = new Connection();