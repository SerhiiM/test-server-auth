const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieSession = require("cookie-session");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["secret"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("http://localhost:3000");
});

app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).send("Unauthorized");
  }
});

const accountData = {
  12345: {
    accountId: "12345",
    ownerFirstName: "John",
    ownerLastName: "Doe",
    ownerAddress: "123 Main St, Springfield",
    dateCreated: "2023-01-01",
    paidAccount: true,
  },
};

app.get("/account/:accountId", (req, res) => {
  const accountId = req.params.accountId;
  const accountInfo = accountData[accountId];
  if (accountInfo) {
    res.json(accountInfo);
  } else {
    res.status(404).send("Account not found");
  }
});

app.put("/account/:accountId", (req, res) => {
  const accountId = req.params.accountId;
  const newAddress = req.body.ownerAddress;
  if (accountData[accountId]) {
    accountData[accountId].ownerAddress = newAddress;
    res.send("Address updated");
  } else {
    res.status(404).send("Account not found");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
