export const template = {
    template: (title, list, body) => {
        return `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <title>Web</title>
                </head>
    
                <body>
                    <h1><a href="/">Web</a></h1>
                    ${list}
                    <a href="/create">Create</a>
                    <a href="/update/${title}">Update</a>
                    <a href="/delete/${title}">Delete</a>
                    <h2>${title}</h2>
                    ${body}
                </body>
            </html>
        `;
    },
    list: (fileList) => {
        let listHTML = `<ul>`;
        for(let i = 0; i < fileList.length; i++) {
            listHTML += `<li><a href="/view/${fileList[i]}">${fileList[i]}</a></li>`;
        }
        listHTML += `</ul>`;

        return listHTML;
    }
};