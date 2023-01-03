const connection = require('../model/connection');
connection.connected();

class PostService {
    findAll() {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query('select * from post p join member m on p.idMember = m.idMember', (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }

    findByIDUser(idMember) {
        let connect = connection.getConnection();
        let sql = `select *
                   from member m
                            join post p on m.idMember = p.idMember
                   where p.idMember = ${idMember}`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Success');
                    resolve(list);
                }
            })
        })
    }

    findByID(idPost) {
        let connect = connection.getConnection();
        let sql = `select *
                   from member m
                            join post p on m.idMember = p.idMember
                   where p.idPost = ${idPost}`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Success');
                    resolve(list);
                }
            })
        })
    }


    findByPostName(postName) {
        let connect = connection.getConnection();
        let sql = `select *
                   from post p
                            join member m on p.idMember = m.idMember
                   where p.postName like '%${postName}%';`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err , list) => {
                if (err) {
                    reject(err)
                } else {
                    // console.log(list);
                    resolve(list);
                }
            })
        })
    }


    save(post) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`insert into post (postName, content, image, idMember)
                           values ('${post.postName}', '${post.content}', '${post.image}', ${post.idMember})`, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Create success')
                }
            })
        })
    }


    edit(post, idPost) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`update post
                           set postName      = '${post.postName}',
                               content     = '${post.content}',
                               image   = '${post.image}'
                           where idPost = ${idPost}; `, (err, post) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Success');
                    resolve(post);
                }
            })
        })
    }

    remove(idPost) {
        let connect = connection.getConnection();
        let sql = `delete
                   from post
                   where idPost = ${idPost}`;
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

const postService = new PostService();
module.exports = postService;