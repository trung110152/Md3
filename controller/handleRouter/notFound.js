const fs = require('fs');

class NotFound {
    handleNotFound(req , res) {
        fs.readFile('./views/err/notFound.html', 'utf-8', (err, notFoundHtml) => {
            if (err) {
                console.log(err.message)
            } else {
                res.writeHead(200, 'text/html');
                res.write(notFoundHtml);
                res.end();
            }
        })
    }
}
module.exports = new NotFound();