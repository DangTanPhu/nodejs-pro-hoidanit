/// <reference path ="./types/index.d.ts"/>
import express from "express";
import 'dotenv/config';
import webRoutes from "src/routes/web";
import initDatabase from "config/seed";
import passport from "passport";
import configPassportLocal from "src/middleware/passport.local";
import session from "express-session";
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = process.env.PORT || 7000;

//config view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config static file
app.use(express.static('public'));

//config session
app.use(session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // ms
  },
  secret: 'a santa at nasa',
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod: 2 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}))


//config passport
app.use(passport.initialize());
app.use(passport.session());
configPassportLocal();

//config global
app.use((req, res, next) => {
    res.locals.user = req.user || null; // Pass user object to all views
    next();
});

//config routes
webRoutes(app);

//seeding data
initDatabase();

//handle 404 not fount
app.use((req, res) => {
  res.render("status/404.ejs")
})

app.listen(port, () => {
  console.log(`My app listening on port ${port}`);
})
