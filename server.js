const http = require('http')
const fs = require('fs')
const path = require('path')

http
    .createServer(function (request, response) {
        if (request.url === '/') {
            fs.readFile('index.html', function (error, data) {
                if (error) {
                    response.end(error)
                } else {
                    response.writeHead(200, { "content-type": "text/html" })
                    response.write(data)
                    response.end()
                }
            })
        } else if (request.url === "/create-directory" && request.method === "POST") {
            let body = ""
            request.on("data", function (data) {
                body += data.toString()
            })
            request.on("end", function () {
                fs.mkdir(path.join(__dirname, 'content'), { recursive: true }, (error) => {
                    if (error) {
                        response.end(error)
                    } else {
                        response.end("Content Folder Created.")
                    }
                })
            })
        } else if (request.url === "/create-text" && request.method === "POST") {
            fs.writeFile(path.join(__dirname, 'randomText.txt'), 'This is some random text', (error) => {
                if (error) {
                    response.end(error)
                } else {
                    response.end("randomText.txt created.")
                }
            })
        } else if (request.url === "/new-folder-and-file" && request.method === "POST") {
            const randomTextPath = path.join(__dirname, 'randomText.txt');
            const verbagePath = path.join(__dirname, 'content', 'verbage.txt');

            fs.readFile(randomTextPath, 'utf8', (error, data) =>{
                if(error) {
                    response.end(error);
                    return;
                }
            })
            fs.writeFile(verbagePath, data, (error) =>{
                if(error) {
                    response.end(error);
                    return;
                }
                response.end("verbage.txt created.");

                setTimeout(() => {
                    fs.rmdir(path.join(__dirname, 'content'), {recursive: true}, (error) => {
                        if (error) {
                            console.error('Error deleting content directory:', error);
                        }else{
                            console.log('Content folder deleted.');
                        }
                    })
                })
            })
        } else {
            return response.end();
        }

    })
    .listen(3000, function () {
        console.log("Server Started!")
    })