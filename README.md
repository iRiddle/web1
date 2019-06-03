# Driscroll's Grower Portal Web

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

> React 16, Redux 4, babel, Webpack 4, Material UI

## Table of Contents

- [Installation](#installation)
- [Deployment](#deployment)
---

## Installation

### Clone

Clone this repo to your local machine using

```shell
$ git clone https://github.com/muthuks2020/Driscollsweb.git
```

### Install

```shell
$ npm install
```

```shell
$ npm run dev
```

---

## Deployment

### SSH to AWS server

**gpa-driscolls-useast2.pem** file is required. Please contact Apratim Buragoain for this file.

```shell
$ ssh -i gpa-driscolls-useast2.pem ubuntu@18.191.102.15
```
```shell
$ cd gpa-web
```
**DO NOT MISS**  this step as we have server related config modified here.
```shell
$ git stash 
```
```shell
$ git pull
```
```shell
$ git stash pop  //resolve conflicts, if any
```
```shell
$ npm install
```
```shell
$ pm2 restart webpack-dev-server
```
---


