import fs from "fs";

function list() {
    let listHTML = `<ul>`;
    fs.readdirSync("./data").forEach(file => {
        listHTML += `<li><a href="/${file}">${file}</a></li>`;
    });
    listHTML += `</ul>`;

    return listHTML;
}

function template(title, article) {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <link rel="icon" href="/favicon.ico" type="image/x-icon">
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
                <title>Web</title>
            </head>

            <body>
                <h1><a href="/">Web</a></h1>
                ${list()}
                <a href="/create">Create</a>
                <a href="/update/${title}">Update</a>
                <a href="/delete/${title}">Delete</a>
                <h2>${title}</h2>
                ${article}
            </body>
        </html>
    `;
};

export default template;