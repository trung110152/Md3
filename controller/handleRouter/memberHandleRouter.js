const fs = require('fs');
const qs = require("qs");
const memberService = require('../../service/memberService')
const cookie = require("cookie");
const postService = require("../../service/postService");

class MemberHandleRouter {
    login(req, res) {
        if (req.method === "GET") {
            fs.readFile('./views/user/login.html', 'utf-8', async (err, loginHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(loginHtml);
                    res.end();
                }
            })
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async (err) => {
                if(err) {
                    console.log(err)
                }
                let member = qs.parse(data)
                let listMember = await memberService.login(member);
                if(listMember.length !== 0){
                    res.setHeader('Set-Cookie', cookie.serialize('name', JSON.stringify(listMember[0]), {
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 * 7 * 365 // 1 year
                    }));
                    // console.log(listMember[0].idMember)
                    res.writeHead(301, {'location' : '/home'});
                    res.end();
                } else {
                    res.writeHead(301, {'location' : '/login'});
                    res.end();
                }


            })
        }
    }



    showMyProfile(req, res){
        const cookies = cookie.parse(req.headers.cookie || '');
        let userCurrent = JSON.parse(cookies.name);
        fs.readFile('./views/myProfile.html', "utf-8", async (err, myProfileHtml) => {
            if (err) {
                console.log(err)
            } else {
                let tbody = '';

                    tbody += `
                        <p1>id: </p1>
                        <p2>${userCurrent.idMember}</p2>
                        <br>
                        <p1>Account Name: </p1>
                         <p2>${userCurrent.accountName}</p2>
                         <br>
                         <p1>Password: </p1>
                         <p2>${userCurrent.password}</p2>
                         <br>
                         <p1>Role: </p1>
                         <p2>${userCurrent.role}</p2>
                    </tr>
                       `

                myProfileHtml = myProfileHtml.replace('{myProfile}', tbody);
                res.writeHead(200, {'location': '/myProfile'});
                res.write(myProfileHtml);
                res.end();
            }
        })
    }

    showMember(req,res){
        const cookies = cookie.parse(req.headers.cookie || '');
        let userCurrent = JSON.parse(cookies.name);
        fs.readFile('./views/management.html', "utf-8", async (err, managementHtml) => {
            if (err) {
                console.log(err)
            } else if(userCurrent.role === "admin") {
                let member = await memberService.findMember();
                let tbody = '';
                member.map((member, index) => {
                    tbody += `
                    <tr>
                        <td>${index}</td>
                        <td>${member.accountName}</td>
                        <td>${member.password}</td>
                        <td>${member.role}</td>
                        <td><a href="/deleteMember/${member.idMember}"><button style="background-color: red; color: white">Delete</button></a></td>
                    </tr>
                       `
                })
                managementHtml = managementHtml.replace('{member}', tbody);
                res.writeHead(200, {'location': '/management'});
                res.write(managementHtml);
                res.end();
            } else{
                res.writeHead(200, {'location': '/home'});
                res.end();
            }
        })
    }


    addMember(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/addMember.html', 'utf-8', async (err, addMemberHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(addMemberHtml);
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
                    const member = qs.parse(data);
                    await memberService.saveMember(member);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }


    async deleteMember(req, res, idMember) {
        if (req.method === 'GET') {
            fs.readFile('./views/deleteMember.html', 'utf-8', (err, deleteMemberHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    deleteMemberHtml = deleteMemberHtml.replace('{idMember}', idMember);
                    // console.log(idMember+'dddddd')
                    res.write(deleteMemberHtml);
                    res.end();
                }
            })
        } else {
            await memberService.removeMember(idMember);
            res.writeHead(301, {'location': '/management'});
            res.end();
        }
    }
}



module.exports = new MemberHandleRouter();