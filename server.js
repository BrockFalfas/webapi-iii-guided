const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

function methodLogger() {
    return (req, res, next) => {
    console.log( `${req.method} Request`);
    next();
  }
}

function brockGateKeeper(req, res, next) {
  const seconds = new Date().getSeconds();

  if (seconds % 3 === 0) {
    res.status(403).json({ you: "shall not pass"});
  } else {
    next();
  }
}

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));

server.use(methodLogger());
server.use(brockGateKeeper);

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
