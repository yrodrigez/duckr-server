import express from "express";
import cors from "cors";
import {createServer} from "https";
import configureApollo from "./apollo/ApolloConfiguration";
import {LOGIN_STRATEGY, passport} from "./passport";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fs from "fs"
import path from "path";

const cert = fs.readFileSync('cert.pem')
const key = fs.readFileSync('key.pem')
const devOrigin = "http://localhost:8080";

const nextPath = () => process.cwd() + `/webapp/.next/server/pages/`
const routes = {
  register: path.resolve(nextPath() + `register.html`),
  login: path.resolve(nextPath() + `login.html`)
}


const configureServer = async () => {
  const app = express();
  const PORT = parseInt(process.env.PORT) || 8080;

  app.use(passport.initialize());
  app.use(passport.session({}));
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(bodyParser.urlencoded({extended: true}));

  app.get("/", (req, res) => {
    res.sendFile(routes.login);
  });

  app.get('/register', (_, res) => res.sendFile(routes.register))

  /**
   *Facebook Login
   */
  app.get("/auth/facebook", passport.authenticate(LOGIN_STRATEGY.FACEBOOK));

  app.get(
    "/auth/facebook/callback",
    (req, res, next) => passport.authenticate(LOGIN_STRATEGY.FACEBOOK, {
      successRedirect: "/graphql",
      failureRedirect: "/login",
    }, (error, token) => {
      req.login(token, err => {
        if (err)
          return res
            .status(500)
            .send("Authentication failure due to an internal server error");

        if (!token) return res.redirect("/login");
        res.setHeader("Authorization", token);
        res.cookie("__sessionToken", token, {httpOnly: true});

        return res.redirect(`/graphql`);
      });
    })(req, res, next)
  );

  /**
   *Google Login
   */
  app.get(
    "/auth/google",
    passport.authenticate(LOGIN_STRATEGY.GOOGLE, {
      scope: "https://www.google.com/m8/feeds",
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate(LOGIN_STRATEGY.GOOGLE, {
      successRedirect: "/graphql",
      failureRedirect: "/login",
    })
  );

  /**
   *Local Login
   */
  app.post("/login", (req, res, next) =>
    passport.authenticate(
      LOGIN_STRATEGY.LOCAL,
      {successRedirect: "/graphql", failureRedirect: "/login"},
      (err, token) => {
        req.login(token, err => {
          if (err)
            return res
              .status(500)
              .send("Authentication failure due to an internal server error");

          if (!token) return res.redirect("/login");
          res.setHeader("Authorization", token);
          res.cookie("__sessionToken", token, {httpOnly: true});

          return res.send({token});
        });
      }
    )(req, res, next)
  );

  if (process.env.__MODE__ === "development") {
    app.use(
      cors((origin, callback) => {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, {});
        if (devOrigin.startsWith(origin)) return callback(null, {});
        return callback(null, {});
      })
    );
  }

  const server = createServer({key, cert}, app);
  const apolloServer = await configureApollo({app}, server);
  return {
    server,
    apolloServer,
    PORT,
  };
};

export default configureServer;