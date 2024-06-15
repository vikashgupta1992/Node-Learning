const express = require('express');
const app = express();
const cluster = require('node:cluster');
const numCpus = require('node:os');

const port = process.env.PORT || 3000;

const delay = (delay) => {
    const startTime = Date.now();

    while(Date.now() - startTime < delay) {
        //event loop is blocked
    }
}

app.get('/', (req, res) => {
    res.send(`running fast ${process.pid}`);
})

app.get('/delay', (req, res) => {
    delay(15000);
    res.send(`delay ${process.pid}`);
})

if(cluster.isPrimary) {
    for (let i = 0; i < numCpus.cpus().length; i++) {
        cluster.fork();
    }
} else {
    app.listen(port)
    console.log(`Worker ${process.pid} started`);
}

// app.listen(port)
