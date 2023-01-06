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

     checkAccountName(accountName){
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`select * from member where member.accountName = '${accountName}'`, (err,data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

   async saveMember(member) {
        let connect = connection.getConnection();
        let checkAccountName = await this.checkAccountName(member.accountName);
        if (checkAccountName.length !== 0){
            return 'loi'
        } else {
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

    editMember(member) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`update member
                           set idMember      = ${member.idMember},
                               accountName    = '${member.accountName}',
                               password   = '${member.password}',
                               role = '${member.role}'
                           where idMember = ${member.idMember}; `, (err, members) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Success');
                    resolve(members);
                }
            })
        })
    }
}
module.exports = new MemberService();