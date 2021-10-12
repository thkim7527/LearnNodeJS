const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

function getTemplate(title, list, body) {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>Web</title>
            </head>

            <body>
                <h1><a href="?id=Web">Web</a></h1>
                ${list}
                <a href="/create">Create</a>
                <h2>${title}</h2>
                ${body}
            </body>
        </html>
    `;
}

function getList(fileList) {
    let listHTML = `<ul>`;
    for(i=0; i < fileList.length; i++) {
        listHTML += `<li><a href="?id=${fileList[i]}">${fileList[i]}</a></li>`;
    }
    listHTML += `</ul>`;

    return listHTML;
}

const app = http.createServer(function(req, res){
    const reqURL = req.url;
    const query = url.parse(reqURL, true).query; //url.parse is Deprecated!
    const pathname = url.parse(reqURL, true).pathname; //url.parse is Deprecated!
    let title = query.id;

    switch(pathname) {
        case "/":
            if(title === undefined) {
                fs.readdir("./data", (err, fileList) => {
                    fs.readFile(`./data/${title}`, (err, description) => {
                        res.writeHead(200);
                        res.end(getTemplate("Web", getList(fileList), description));
                    })
                })
            } else {
                fs.readdir("./data", (err, fileList) => {
                    fs.readFile(`./data/${title}`, (err, description) => {
                        res.writeHead(200);
                        res.end(getTemplate(title, getList(fileList), description));
                    })
                })
            }
            break;
        case "/create":
            fs.readdir("./data", (err, fileList) => {
                const description = `
                    <form method="post" action="/submit">
                        <input type="text" name="title" placeholder="Title"/>
                        <input type="text" name="description" placeholder="Description"/>
                        <input type="submit"/>
                    <form/>
                `;
                res.writeHead(200);
                res.end(getTemplate("Create", getList(fileList), description));
            })
            break;
        case "/submit":
            let query = '';
            req.on('data', function(data){
                query += data;
            });
            req.on('end', function(){
                let post = qs.parse(query);
                let title = post.title;
                let description = post.description;

                console.log(title);
                console.log(description);
            });

            res.writeHead(200);
            res.end(getTemplate("Create Success", "", ""));
            break;
        default:
            res.writeHead(404);
            res.end('Not Found');
    }
});

app.listen(80);