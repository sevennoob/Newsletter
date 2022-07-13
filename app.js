//jshint esversion:6

const express = require("express");
const body_parser = require("body-parser");
const https = require("https");
const api = require(__dirname + "/api.js");

const app = express();

app.use(express.static("static"));
app.use(body_parser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: f_name,
        LNAME: l_name
      }
    }]
  };

  const json_data = JSON.stringify(data);
  const url = "https://us18.api.mailchimp.com/3.0/lists/" + api.getDate.list_id;
  console.log(api.getDate.api_key);
  const options = {
    method: "POST",
    auth: "brian:" + api.getDate.api_key
  };

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(json_data);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
})
