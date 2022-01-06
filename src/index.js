import fs from "fs";
import template from "../lib/template.js";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    const title = "Web";
    const article = "The World Wide Web (WWW), commonly known as the Web, is an information system where documents and other web resources are identified by Uniform Resource Locators (URLs, such as https://example.com/), which may be interlinked by hyperlinks, and are accessible over the Internet. The resources of the Web are transferred via the Hypertext Transfer Protocol (HTTP), may be accessed by users by a software application called a web browser, and are published by a software application called a web server. The World Wide Web is not synonymous with the Internet, which pre-dated the Web in some form by over two decades and upon the technologies of which the Web is built.";
    
    res.status(200).send(template(title, article));
});

//CREATE
app.get("/create", (req, res) => {
    const title = "Create";
    const article = `
    <form method="post" action="/create">
        <input type="text" name="title" placeholder="Title"/>

        <textarea name="article" placeholder="Article"></textarea>

        <input type="submit"/>
    </form>
    `

    res.status(200).send(template(title, article));
});

app.post("/create", (req, res) => {
    const title = req.body.title;
    const article = req.body.article;
    fs.writeFileSync(`./data/${title}`, article);

    res.set({ Location: `/${title}` });
    res.status(302).send();
});

//READ
app.get("/:title", (req, res) => {
    const title = req.params.title;
    const article = fs.readFileSync(`./data/${title}`);

    res.status(200).send(template(title, article));
});

//UPDATE
app.get("/update/:title", (req, res) => {
    const title = req.params.title;
    const article = `
    <form method="post" action="/update/${title}">
        <input type="text" name="title" value="${title}" placeholder="Title"></title>

        <textarea name="article" placeholder="Article">${fs.readFileSync(`./data/${title}`)}</textarea>

        <input type="submit"/>
    </form>
    `

    res.status(200).send(template(title, article));
});

app.post("/update/:title", (req, res) => {
    const title = req.body.title;
    const article = req.body.article;
    fs.writeFileSync(`./data/${title}`, article);
    
    res.set({ Location: `/${title}` });
    res.status(302).send();
});

//DELETE
app.get("/delete/:title", (req, res) => {
    const title = req.params.title;
    fs.unlinkSync(`./data/${title}`);

    res.set({ Location: "/" });
    res.status(302).send();
});

//ERROR
app.use((req, res, next) => {
    res.status(404).send("404 Not Found");
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("500 Internal Server Error");
});

//LISTEN
app.listen(80);