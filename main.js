var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var query = url.parse(_url, true).query;
    var title = query.id;

    if(_url == '/'){
        title = 'Welcome';
    }
    if(_url == '/favicon.ico'){
        return response.writeHead(404);
    }

    var template = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Web</title>
                <link rel="stylesheet" href="style.css">
            </head>
        
            <body>
                <h1><a href="/">Web</a></h1>
        
                <div id="grid">
                    <div id="index">
                        <ol>
                            <li><a href="?id=HTML">HTML</a></li>
                            <li><a href="?id=CSS">CSS</a></li>
                            <li><a href="?id=JavaScript">JavaScript</a></li>
                        </ol>
                    </div>
        
                    <div id="article">
                        <h2>${title}</h2>
                        <button onclick="toggleDarkmode()">Darkmode</button>
        
                        <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="HTML Speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for creating web pages and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.</p>
        
                        <img src="HTML.jpg" width="500px">
        
                        <p>HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.</p>
                    </div>
                </div>
        
                <script src="script.js"></script>
            </body>
        </html>    
    `;

    response.writeHead(200);
    response.end(template);
});

app.listen(80);