/**
*  LKN =- protocol
*
*  LKN mongo rest utiltiy
* @class mongoUtil
*
* @package    LKN - mongo server
* @copyright  Copyright (c) 2017 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

var http = require('http');
var MongoClient = require('mongodb').MongoClient;

var mongoUtil = function() {

  this.Mongolive = MongoClient;
	this.murl = "mongodb://localhost:27017/lknwearable";
  //this.createnewDB();
  //this.createCollection();
  //this.insertCollection();
  //this.retrieveCollection();
  //this.retrieve24hrcollection();

};

/**
* create a new database
* @method createnewDB
*/
mongoUtil.prototype.createnewDB = function () {

  this.Mongolive.connect(this.murl, function(err, db) {
    if (err) throw err;
console.log("Database created!");
    db.close();
  })

};

/**
* create a new collection (table)
* @method createCollection
*/
mongoUtil.prototype.createCollection = function () {

  this.Mongolive.connect(this.murl, function(err, db) {
    if (err) throw err;
    db.createCollection("heartrate", function(err, res) {
      if (err) throw err;
      console.log("Table created!");
      db.close();
    });
  });

};

/**
*  insert data into a collection
* @method createCollection
*/
mongoUtil.prototype.insertCollection = function (dataIN) {
//console.log(dataIN);
	this.Mongolive.connect(this.murl, function(err, db) {
    if (err) throw err;
    var myobj = dataIN;//{ device: "mio", hr: "73" };
    db.collection("amiigodata").insertOne(myobj, function(err, res) {
      if (err) throw err;
      //console.log("1 record inserted");
      db.close();
    });
  });

};

/**
*  insert data into a collection  individual Average
* @method insertAverageCollection
*/
mongoUtil.prototype.insertAverageCollection = function (dataIN) {

  this.Mongolive.connect(this.murl, function(err, db) {
    if (err) throw err;
    var myobj = dataIN;//{ daystart: "UTC", hravg: "73", cover: 79% };

    db.collection("heartrateaverage").insertOne(myobj, function(err, res) {
      if (err) throw err;
console.log("1 record inserted");
      db.close();
    });
  });

};

/**
*  insert data into a collection  Network Average
* @method insertNetworkAverageCollection
*/
mongoUtil.prototype.insertNetworkAverageCollection = function (dataIN) {

  this.Mongolive.connect(this.murl, function(err, db) {
    if (err) throw err;

    var myobj = dataIN;//{ daystart: "UTC", hravg: "73", cover: 79% };

    db.collection("heartratenetworkaverage").insertOne(myobj, function(err, res) {
      if (err) throw err;
console.log("1 record inserted");
      db.close();
    });
  });

};

/**
*  retrieve data from a collection
* @method retrieveCollection
*/
mongoUtil.prototype.retrieveCollection = function (cleandata, fullpath,  response, origin) {

  var returnData;
  this.Mongolive.connect(this.murl, function(err, db) {

    if (err) throw err;
    var query = { "author": fullpath[3] };
    db.collection("heartrate").find(query).toArray(function(err, result) {
console.log(err);
      if (err) throw err;
      db.close();
      // return data and success to REST caller
      response.setHeader("access-control-allow-origin", origin);
    	response.writeHead(200, {"Content-Type": "application/json"});
    	response.end(JSON.stringify(result));

    });
  });

};

/**
*  retrieve data from a collection
* @method retrieve24hrcollection
*/
mongoUtil.prototype.retrieve24hrcollection = function (cleandata, fullpath,  response, origin) {

  this.Mongolive.connect(this.murl, function(err, db) {

    if (err) throw err;
    var query = { "author": fullpath[3] };
    db.collection("heartrateaverage").find(query).toArray(function(err, result) {
console.log(err);
      if (err) throw err;

      db.close();
      // last or whole list of averages
      if(fullpath[4] == 'last')
      {
        returnData = result.slice(-1);

      }
      else {
        returnData = result;
      }
      // return data and success to REST caller
      response.setHeader("access-control-allow-origin", origin);
    	response.writeHead(200, {"Content-Type": "application/json"});
    	response.end(JSON.stringify(returnData));
    });
  });

};

/**
*  retrieve data from a collection
* @method retrievenetwork24hrcollection
*/
mongoUtil.prototype.retrievenetwork24hrcollection = function (cleandata, fullpath,  response, origin) {

  this.Mongolive.connect(this.murl, function(err, db) {

    if (err) throw err;
    var query = { };
    db.collection("heartratenetworkaverage").find(query).toArray(function(err, result) {
console.log(err);
      if (err) throw err;

      db.close();
      // last or whole list of averages
      if(fullpath[4] == 'last')
      {
        returnData = result.slice(-1);

      }
      else {
        returnData = result;
      }
      // return data and success to REST caller
      response.setHeader("access-control-allow-origin", origin);
    	response.writeHead(200, {"Content-Type": "application/json"});
    	response.end(JSON.stringify(returnData));
    });
  });

};

module.exports = mongoUtil;
