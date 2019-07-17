const serverless = require("serverless-http");
const express = require("express");
const fetch = require("node-fetch");

const app = express();
const mustacheExpress = require("mustache-express");
const fs = require("fs");

const rawdata = fs.readFileSync(__dirname + "/views/stations.json");
const stations = JSON.parse(rawdata);

//console.log(stations);
// Get User endpoint
app.engine("html", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.get("/:itemId", async function(req, res) {
  const id = Number(req.params.itemId);
  if (req.params.itemId < 100) {
    let response = await fetch(
      `https://feeds.rasset.ie/livelistings/playlist/?source=rte.ie&platform=webradio&channelid=${id}&id=9&autoStart=false&thumbnail=&playertype=flash&header=auto&mainHeader=progTitle&subHeader=broadcastDate&highlightHeader=off&radioUI=true`
    );
    let data = await response.json();
    let show = data[0];
    let selectedStation = stations.filter(r => {
      return r.id === id;
    });
    res.render("socialTags.html", {
      id: "",
      title: show.progName,
      picture: show.imageRef,
      category: show.genre,
      caption: show.description,
      station: selectedStation[0].station_name
    });
  } else {
    try {
      let response = await fetch(
        `https://feeds.rasset.ie/rteavgen/getplaylist/?id=${id}&type=radio&format=json`
      );
      const { status } = response;
      let data = await response.json();
      let show = data.shows[0];
      let selectedStation = stations.filter(r => {
        return r.id === show.channelid;
      });
      const params = {
        Key: {
          itemId: id
        }
      };
      res.render("socialTags.html", {
        id: id,
        title: show.ptitle,
        picture: show.thumbnailref,
        category: show.genre,
        caption: show.description,
        station: selectedStation[0].station_name
      });
    } catch (e) {
      var response = {
        statusCode: 404,
        headers: {
          "Content-Type": "text/html"
        },
        body: "not Found"
      };
      return response;
    }
  }
});

module.exports.handler = serverless(app);
