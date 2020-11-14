# Sample Express Project

---

ExpressJS and MongoDB Sample Project

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Test](https://github.com/safakoks/sample-express/workflows/Testing/badge.svg)

## Overview

> Compatible with NodeJS version 10.x , 12.x and 13.x

Testable on [Swagger](https://sample-express-api.herokuapp.com/docs)

## Get Started

1 - Install packages

```bash
yarn install
```

2 - Start Server

```bash
yarn start
```

3 - Documentation

Swagger will be start on `http://localhost:3000/docs`

> 3000 is a sample port, it will be `PORT` env on .env

## Set Environment

| ENV NAME  | DESCRIPTION                   |
| --------- | ----------------------------- |
| PORT      | Server Port                   |
| MONGO_URI | Mongo connection string (URI) |

## Error Code

| CODE | DESCRIPTION |
| ---- | ----------- |
| 0    | Success     |
| 1    | Validation  |
| 2    | System      |
