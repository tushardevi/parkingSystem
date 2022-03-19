import Koa from 'koa'
import Router from 'koa-router'
import websockify from 'koa-websocket'
import WebSocket from 'ws'

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

