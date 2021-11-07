import fs from "fs"
import url from "url"
import qs from "qs"
import express from "express"
import {template} from "./lib/template.js"

const app = express();

//VIEW(HOME)
app.get("/", (req, res) => {
    const title = "Web";
    const description = "Hello, Web!";
    const fileList = fs.readdirSync("./data");

    res.status(200).send(template.template(title, template.list(fileList), description));
});

//VIEW
app.get("/view/:title", (req, res) => {
    const title = req.params.title;
    const description = fs.readFileSync(`./data/${title}`);
    const fileList = fs.readdirSync("./data");
    
    res.status(200).send(template.template(title, template.list(fileList), description));
});

//CREATE
app.get("/create", (req, res) => {
    const title = "Create"
    const description = `
        <form method="post" action="/create-submit">
            <p>
            <input type="text" name="title" placeholder="Title"/>
            <p/>
        
            <p>
            <textarea name="description" placeholder="Description"></textarea>
            <p/>
        
            <input type="submit"/>
        <form/>
    `
    const fileList = fs.readdirSync("./data");
    
    res.status(200).send(template.template(title, template.list(fileList), description));
});

//CREATE SUBMIT
app.post("/create-submit", (req, res) => {
    let createData = "";
    req.on("data", (data) => {
        createData += data;
    });
    req.on("end", () => {
        const post = qs.parse(createData);
        console.log(post);

        const title = post.title;
        const description = post.description;
        const fileList = fs.readdirSync("./data");
        
        fs.writeFileSync(`./data/${title}`, description);

        res.set({Location: `/?id=${title}`});
        res.status(302).send();
    });
});

//UPDATE
app.get("/update/:title", (req, res) => {
    const title = "Update"
    const description = `
        <form method="post" action="/update_submit">
            <input type="hidden" name="id" value="${title}">
    
            <p>
            <input type="text" name="title" placeholder="Title" value="${title}"/>
            <p/>

            <p>
            <textarea name="description" placeholder="Description">${description}</textarea>
            <p/>

            <input type="submit"/>
        <form/>
    `;
    const fileList = fs.readdirSync("./data");

    res.status(200).send(template.template(title, template.list(fileList), description));
});

//DELETE
app.get("/delete/:title", (req, res) => {
    const title = req.params.title;

    fs.unlink(`./data/${title}`, () => {
        res.set({Location: "/"});
        res.status("302").send();
    })
});

app.listen(80, console.log("Listening on Port 80"));

/*
import http from "http"
import fs from "fs"
import url from "url"
import qs from "querystring"
import {template} from "./lib/template.js";

http.createServer(function(req, res){
    const reqURL = req.url;
    const query = url.parse(reqURL, true).query;
    const pathname = url.parse(reqURL, true).pathname;
    let title = query.id;

    switch(pathname) {
        case "/":
            if(title === undefined) {
                fs.readdir("./data", (err, fileList) => {
                    fs.readFile(`./data/${title}`, (err, description) => {
                        res.writeHead(200);
                        res.end(template.template("Web", template.list(fileList), description));
                    })
                })
            } else {
                fs.readdir("./data", (err, fileList) => {
                    fs.readFile(`./data/${title}`, (err, description) => {
                        res.writeHead(200);
                        res.end(template.template(title, template.list(fileList), description));
                    })
                })
            }
            break;
        case "/create":
            fs.readdir("./data", (err, fileList) => {
                const body = `
                    <form method="post" action="/create_submit">
                        <p>
                        <input type="text" name="title" placeholder="Title"/>
                        <p/>

                        <p>
                        <textarea name="description" placeholder="Description"></textarea>
                        <p/>

                        <input type="submit"/>
                    <form/>
                `;
                res.writeHead(200);
                res.end(template.template("Create", template.list(fileList), body));
            });
            break;
        case "/create_submit":
            let createData = "";
            req.on("data", (data) => {
                createData += data;
            });
            req.on("end", () => {
                let post = qs.parse(createData);
                let title = post.title;
                let description = post.description;

                fs.writeFile(`./data/${title}`, description, (err) => {
                    res.writeHead(302, {Location: `/?id=${title}`});
                    res.end();
                });
            });
            break;
        case "/update":
            fs.readdir("./data", (err, fileList) => {
                fs.readFile(`./data/${title}`, (err, description) => {
                    const body = `
                    <form method="post" action="/update_submit">
                        <input type="hidden" name="id" value="${title}">
                        <p>
                        <input type="text" name="title" placeholder="Title" value="${title}"/>
                        <p/>
    
                        <p>
                        <textarea name="description" placeholder="Description">${description}</textarea>
                        <p/>
    
                        <input type="submit"/>
                    <form/>
                    `;
                    res.writeHead(200);
                    res.end(template.template("Update", template.list(fileList), body));
                });
            });
            break;
        case "/update_submit":
            let updateData = ""
            req.on("data", (data) => {
                updateData += data
            });
            req.on("end", () => {
                let post = qs.parse(updateData);
                let id = post.id;
                let title = post.title;
                let description = post.description;

                fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
                    fs.writeFile(`./data/${title}`, description, (err) => {
                        res.writeHead(302, {Location: `/?id=${title}`});
                        res.end();
                    });
                });
            });
            break;
        case "/delete_submit":
            fs.unlink(`./data/${title}`, () => {
                res.writeHead(302, {Location: "/"});
                res.end()
            })
            break;
        default:
            res.writeHead(404);
            res.end("Not Found");
    }
}).listen(80, console.log("Listening on Port 80"));
*/