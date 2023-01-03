const connection = require('../model/connection');
connection.connected();

class MemberService {
    login(member) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`select * from member where accountName = '${member.accountName}' and password = '${member.password}'`, (err, listMember) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(listMember)
                }
            })
        })
    }
}
module.exports = new MemberService();