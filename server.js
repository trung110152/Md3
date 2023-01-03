const http = require('http');
const url = require('url');
const router = require('./controller/router');
const notFound = require('./controller/handleRouter/notFound');
const fs = require("fs");

const typeFile = {
    'jpg': 'images/jpg',
    'png': 'images/png',
    'js': 'text/javascript',
    'css': 'text/css',
    'svg': 'image/svg+xml',
    'ttf': 'font/tff',
    'woff': 'font/woff',
    'woff2': 'font/woff',
    'eot': 'application/vnd.ms-fontobject'
}

const server = http.createServer((req, res) => {
    let pathName = url.parse(req.url, true).pathname; // '/home'
    const checkPath = pathName.match(/\.js|\.css|\.png|\.jpg|\.ttf|\.woff|\.woff2|\.eot/);
    if (checkPath) {
        const contentType = typeFile[checkPath[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': contentType});
        fs.createReadStream(__dirname + req.url).pipe(res);
    } else {
        const arrPath = pathName.split('/');
        // console.log(arrPath)
        let trimPath ;
        let id = '';
        if (arrPath.length <3 ) {
            trimPath = arrPath[arrPath.length - 1];
        } else {
            trimPath = arrPath[arrPath.length - 2];
            id = +arrPath[arrPath.length - 1];
        }
        let chosenHandle;
        if (typeof router[trimPath] === 'undefined') {
            chosenHandle = notFound.handleNotFound;
        } else {
            chosenHandle = router[trimPath];
        }
        // console.log(id);
        chosenHandle(req, res, id);
    }
});
server.listen(8080, () => {
    console.log('Server is running!')
})