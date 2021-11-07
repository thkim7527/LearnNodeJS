// const http = require('http');
// const fs = require('fs');
// const url = require('url');
// const qs = require('querystring');

import http from "http"
import fs from "fs"
import url from "url"
import qs from "querystring"
import {template} from "./lib/template.js";

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
});

app.listen(80);