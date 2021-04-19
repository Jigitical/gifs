const express = require('express')
const axios = require('axios');
const fs = require('fs');


const app = express()
const port = 3000

app.get('/', (req, res) => {
    axios.get('https://api.giphy.com/v1/gifs/search?api_key=ucUViec7Hn4LMZ3bBqA04ZQ73v6BqaG2&q=ricardo-milos&limit=10&rating=pg-13')
        .then(function (response) {
            const promises = [];

            response.data.data.forEach((item)=>{
                promises.push( new Promise((resolve, reject) =>{
                    axios.get(item.images.original.url, {
                        responseType: 'arraybuffer'
                    }).then(response => resolve(Buffer.from(response.data, 'binary')))
                        .catch((err)=>{
                            reject(err);
                        })
                }));
            })

            const salt= Math.random();
            Promise.all(promises).then((value)=>{
              //  console.log(value, '===========val')
                const promises2 = [];
                value.forEach((item, index)=>{
                    promises2.push(new Promise(((resolve, reject) => {
                        fs.writeFile(`./gifs/gif.${salt}.${index}.gif`, item,function (err) {
                            if (err) return console.log(err);
                            resolve('ok')
                        })
                    })))
                })

                Promise.all(promises2).then(()=>{
                    res.send(`<html><head></head><body><h1>Ricardo gifs</h1><img src="gifs/gif.${salt}.0.gif"><img src="gifs/gif.${salt}.1.gif"><img src="gifs/gif.${salt}.2.gif"><img src="gifs/gif.${salt}.3.gif"><img src="gifs/gif.${salt}.4.gif"><img src="gifs/gif.${salt}.5.gif"><img src="gifs/gif.${salt}.6.gif"><img src="gifs/gif.${salt}.7.gif"><img src="gifs/gif.${salt}.8.gif"><img src="gifs/gif.${salt}.9.gif"></body></html>`)
                    console.log('OK')

                })

            })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
})

app.get('/gifs/*', (req, res) => {
    fs.readFile(`./gifs/${req.params[0]}`, function(err, contents) {
        res.send(contents)
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})