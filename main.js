const http = require('http');
const fs = require('fs');
const url = require('url');

//ToDo
const indexList = fs.readdir("./data", (err, fileList) => {
    let indexList = `<ul>`;
    for(i=0; i < fileList.length; i++) {
        indexList += `<li><a href="?id=${fileList[i]}">${fileList[i]}</a></li>`;
    }
    indexList += `</ul>`
    
    return indexList;
});

function templateHTML(title) {
    fs.readFile(`./data/${title}`, (err, description) => {
        const template = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Web</title>
                <link rel="stylesheet" href="style.css">
            </head>
    
            <body>
                <h1><a href="/">Web</a></h1>
                ${indexList}
                <h2>${title}</h2>
                <button onclick="toggleDarkmode()">Darkmode</button>
                ${description}
                <script src="script.js"></script>
            </body>
        </html>
        `;
        return template;
    });
}

const app = http.createServer(function(request,response){
    const _url = request.url;
    const query = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    let title = query.id;

    if(pathname === '/') {
        if(title === undefined) {
            title = 'Web';
            const template = templateHTML(title);    
            response.writeHead(200);
            response.end(template);
        } else {
            const template = templateHTML(title);
            response.writeHead(200);
            response.end(template);
        }
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

app.listen(80);