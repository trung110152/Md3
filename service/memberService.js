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

    findMember(){
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query('select * from  member', (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }

    saveMember(member) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`insert into member (accountName, password,  role)
                           values ('${member.accountName}', '${member.password}', 'member')`, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Create success')
                }
            })
        })
    }


    removeMember(idMember) {
        let connect = connection.getConnection();
        let sql = `delete
                   from member
                   where idMember = ${idMember}`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Success')
                }
            })
        })
    }
}
module.exports = new MemberService();