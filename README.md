# Edx -- NodeJS

LinuxFoundationX LFW111x - Introduction to Node.js

[Link](https://learning.edx.org/course/course-v1:LinuxFoundationX+LFW111x+2T2022)

# Install NodeJS use NVM

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash`

# 1. Quick File Server with Serve dependency

```
/1-mock-static-server
  /static
    /app.js
    /index.html
```

## Install Serve dependency globally

`npm install -g serve`

## Run

```bash
cd 1-mock-static-server/
serve -p 5050 static
```

# 2. Quick File Server Zero-Dependency

```
/2-mock-zero-dependency
  /server.js
  /static
    /app.js
    /index.html
```

## Run

```bash
cd 2-mock-zero-dependency/
node server.js
```

> The frontend application starting with serve

```bash
cd 2-mock-zero-dependency/
serve -p 5050 static
```

# 3. Quick File Server with Fastify

[Fastify](https://www.fastify.io/)

```
/3-mock-fastify
  /mock-srv
    (scaffolding create with `npm init fastify`)
  /static
    /app.js
    /index.html
```

## Install Fastify dependency

```
cd 3-mock-fastify/mock-srv
npm install
```

## Run

```bash
cd 3-mock-fastify/mock-srv
npm start
```

> The frontend application starting with serve

```bash
cd 3-mock-fastify/
serve -p 5050 static
```

# 4. Realtime

the key concept is Web Socket

- [WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [WebSocket Fastify](https://github.com/fastify/fastify-websocket)

```
/4-realtime
  /mock-srv
    (scaffolding create with `npm init fastify`)
  /static
    /app.js
    /index.html
```

## Install Fastify dependency

```
cd 4-realtime/mock-srv
npm install
```

## Run

```bash
cd 4-realtime/mock-srv
npm start
```

> The frontend application starting with serve

```bash
cd 4-realtime/
serve -p 5050 static
```

# 4.1 Bidirectional Communication

testing from terminal

```bash
node -e "http.request('http://localhost:3000/orders/A1', { method: 'POST', headers: {'content-type': 'application/json'}}, (res) => res.pipe(process.stdout)).end(JSON.stringify({amount: 10}))"
```

> the frontend application retrieve the updated data for the order A1

# 5. Command Line Tool

Create a CLI tool to send request to the server and update the order

```
/5-cli-tool
  /mock-srv
    (scaffolding create with `npm init fastify`)
  /static
    /app.js
    /index.html
```

## Installing the CLI

```bash
cd 5-cli
npm link
```

## Usage

To use the CLI you need started the server and the frontend application as described in the previous sections.
Next you can try the cli to automate the update of the order.

```bash
5-cli <id> <amount>

# Example
5-cli A1 10
```
