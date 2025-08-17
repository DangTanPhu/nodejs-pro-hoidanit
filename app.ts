// const express = require('express');
import express from "express";
const app = express();
const port = 7000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/hoidanit', (req, res) => {
  res.send('Hello fsa')
})
app.listen(port, () => {
  console.log(`My app listening on port ${port}`)
})
