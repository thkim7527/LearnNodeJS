const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring')

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
    `
}

function getList(fileList) {
    let listHTML = `<ul>`;
    for(i=0; i < fileList.length; i++) {
        listHTML += `<li><a href="?id=${fileList[i]}">${fileList[i]}</a></li>`
    }
    listHTML += `</ul>`

    return listHTML
}

const app = http.createServer(function(request, response){
    const _url = request.url;
    const query = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    let title = query.id;

    switch(pathname) {
        case "/":
            if(title === undefined) {
                fs.readdir("./data", (err, fileList) => {
                    fs.readFile(`./data/${title}`, (err, description) => {
                        response.writeHead(200);
                        response.end(getTemplate("Web", getList(fileList), description));
                    })
                })
            } else {
                fs.readdir("./data", (err, fileList) => {
                    fs.readFile(`./data/${title}`, (err, description) => {
                        response.writeHead(200);
                        response.end(getTemplate(title, getList(fileList), description));
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
                `
                response.writeHead(200);
                response.end(getTemplate("Create", getList(fileList), description))
            })
            break;
        case "/submit":
            let query = '';
            request.on('data', function(data){
                query += data;
            });
            request.on('end', function(){
                let post = qs.parse(query);
                let title = post.title;
                let description = post.description;

                console.log(title)
                console.log(description)
            });

            response.writeHead(200)
            response.end(getTemplate("Create Success", "", ""))
            break;
        default:
            response.writeHead(404);
            response.end('Not Found');
    }

    // if(pathname === '/') {
    //     if(pathname === undefined) {
    //         fs.readdir("./data", (err, fileList) => {
    //             title = "Web"
    //             const list = getList(fileList)
    //
    //             fs.readFile(`./data/${title}`, (err, description) => {
    //                 response.writeHead(200);
    //                 response.end(getTemplate(title, list, description));
    //             })
    //         })
    //     } else {
    //         fs.readdir("./data", (err, fileList) => {
    //             const list = getList(fileList)
    //
    //             fs.readFile(`./data/${title}`, (err, description) => {
    //                 response.writeHead(200);
    //                 response.end(getTemplate(title, list, description));
    //             })
    //         })
    //     }
    // } else if(pathname === '/create') {
    //     fs.readdir("./data", (err, fileList) => {
    //
    //     })
    // } else {
    //     response.writeHead(404);
    //     response.end('Not Found');
    // }
});

app.listen(80);