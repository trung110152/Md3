const fs = require('fs');
const postService = require('../../service/postService');
const qs = require('qs');
const {raw} = require("mysql");
const {parse} = require("qs");
const cookie = require("cookie");

class HomeHandleRouter {
    static getHomeHtml(homeHtml, posts) {

        let tbody = '';

        posts.map((post, index) => {
            tbody += `
        <div class="col-4">
          <div class="card">
            <img src="../data/img/${post.image}" class="card-img-top" alt="..." width="100%">
            <div class="card-body">
              <h5 class="card-title">${post.postName}</h5>
              <p class="card-text">${post.content}</p>
              <a href="#" class="btn btn-primary">more...</a>
            </div>
          </div>
        </div>`
        })
        homeHtml = homeHtml.replace('{posts}', tbody);
        return homeHtml;
    }

    showHome(req, res) {
        const cookies = cookie.parse(req.headers.cookie || '');
        let userCurrent = JSON.parse(cookies.name);
        // console.log(userCurrent)
        if (req.method === 'GET') {
            fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    let posts = await postService.findAll()
                    homeHtml = HomeHandleRouter.getHomeHtml(homeHtml, posts);
                    res.writeHead(200, 'text/html');
                    // console.log(homeHtml)
                    res.write(homeHtml);
                    res.end();
                }
            })
        }
        else {                          // Search bằng tên gần đúng
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    let search = qs.parse(data);
                    // console.log(search)
                    fs.readFile('./views/home.html', "utf-8", async (err, indexHtml) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let list = await postService.findByPostName(search.search);
                            // console.log(list)
                            indexHtml = HomeHandleRouter.getHomeHtml(indexHtml, list)
                            res.writeHead(200, {'location': '/home'});
                            res.write(indexHtml);
                            res.end();
                        }
                    })

                }
            })
        }
    }

    showMyPosts(req, res) {
        const cookies = cookie.parse(req.headers.cookie || '');
        let userCurrent = JSON.parse(cookies.name);
        fs.readFile('./views/myPosts.html', "utf-8", async (err, myPostsHtml) => {
            if (err) {
                console.log(err)
            } else {
                let posts = await postService.findByIDUser(userCurrent.idMember)
                // console.log(posts)
                let tbody = '';
                posts.map((post, index) => {
                    tbody += `
                       <div class="col-2">
                       <div class="card">
                        <img src="../data/img/${post.image}" class="card-img-top" alt="..." width="100%">
                         <div class="card-body">
                         <h5 class="card-title">${post.postName}</h5>
                         <p class="card-text">${post.content}</p>
                        <a href="/edit/${post.idPost}"><button style="background-color: green; color: white"> Edit </button></a>
                        <a href="/delete/${post.idPost}"><button style="background-color: red; color: white">Delete</button></a>
                        </div>
                        </div>
                         </div>`
                })
                myPostsHtml = myPostsHtml.replace('{posts}', tbody);
                res.writeHead(200, {'location': '/myPosts'});
                res.write(myPostsHtml);
                res.end();
            }
        })
    }



    addPost(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/add.html', 'utf-8', async (err, addPostHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(addPostHtml);
                    res.end();
                }
            })
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const post = qs.parse(data);
                    await postService.save(post);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }

    async editPost(req, res, idPost) {
        if (req.method === 'GET') {
            fs.readFile('./views/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    // console.log(idPost);
                    let post = await postService.findByID(idPost);
                    // console.log(post)
                    editHtml = editHtml.replace('{postName}', post[0].postName);
                    // editHtml = editHtml.replace('{idMember}', post[0].idMember);
                    editHtml = editHtml.replace('{content}', post[0].content);
                    editHtml = editHtml.replace('{idPost}', idPost)
                    editHtml = editHtml.replace('{image}', post[0].image);
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            })
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const post = qs.parse(data);
                    // console.log(idPost);
                    await postService.edit(post, idPost);
                    res.writeHead(301, {'location': '/myPosts'});
                    res.end();
                }
            })
        }
    }


    async deletePost(req, res, idPost) {
        if (req.method === 'GET') {
            fs.readFile('./views/delete.html', 'utf-8', (err, deleteHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    deleteHtml = deleteHtml.replace('{idPost}', idPost);
                    res.write(deleteHtml);
                    res.end();
                }
            })
        } else {
            await postService.remove(idPost);
            res.writeHead(301, {'location': '/myPosts'});
            res.end();
        }
    }
}

module.exports = new HomeHandleRouter();