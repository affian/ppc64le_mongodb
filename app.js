// Prepare necessary pre-requisites
const express = require('express');
const os = require("os");
// var mongo = require('mongodb'); 
const { MongoClient } = require('mongodb');
const http = require('http');

//const mongoHost = process.env.database_host;
//const mongoPort = process.env.database_port;
//const mongoDatabase = process.env.database_name;
//const mongoUser = process.env.database_user;
//const mongoPassword = process.env.database_password;

// Collect database settings from environment variables
const mongoHost = process.env.MONGO_HOST_IP;
const mongoPort = "27017";
const mongoDatabase = process.env.MONGO_DB_NAME;
const mongoAdminDatabase = "admin";
const mongoCollection = process.env.MONGO_COLLECTION_NAME;
const mongoUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const mongoPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;


//const mongoHost = "mongodb-arm64";
//const mongoPort = "27017";
//const mongoAdminDatabase = "admin";
//const mongoDatabase = "airbnb";
//const mongoCollection = "chicago_listings";
//const mongoUser = "root";
//const mongoPassword = "abc123";

// Build MongoDB connection string
//================================
// Used for OpenShift environment
var url = "mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDatabase
// Used for local testing
// var url = "mongodb://localhost:27017/airbnb"
console.log("MongoDB instance is at: " + url)

// Set Express.js to listen for all connections
const app = express();
const port = 8080;
const hostname = "0.0.0.0";

// Function to clean up the entries from a HTTP query (destringify)
function destringify(query) {
    if (query.id) query.id = parseInt(query.id);
    if (query.beds) query.beds = parseInt(query.beds);
    if (query.bedrooms) query.bedrooms = parseInt(query.bedrooms);
    if (query.host_id) query.host_id = parseInt(query.host_id);
    if (query.accommodates) query.accommodates = parseInt(query.accommodates);
    if (query.coresPerSocket) query.coresPerSocket = parseInt(query.coresPerSocket);
    if (query.totalCores) query.totalCores = parseInt(query.totalCores);
    if (query.frequencyGHz) query.frequencyGHz = parseFloat(query.frequencyGHz);
    return query;
}

// Basic response on /
app.get('/', (req, res) => {
    res.send("ok");
})

// Searches performance collection using query modifier from HTTP query
app.get('/findall', (req, res) => {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    async function findall(findQuery) {
        var result = ""
        try {
            await client.connect();
            console.log("Connected to DB:");
            console.log(mongoDatabase);
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("Using collection:");
            console.log(mongoCollection);
            findQuery = destringify(findQuery);
            console.log("Query is: " + JSON.stringify(findQuery));
            result = await collection.find(findQuery).toArray();
            console.log("Search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        res.send(result);
    }
    findall(req.query).catch(console.dir);
})

// trying a /findId endpoint to retrieve just the ID field
app.get('/findId', (req, res) => {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    async function findId(listingId) {
        var result = ""
        try {
            await client.connect();
            console.log("Connected to DB:");
            console.log(mongoDatabase);
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("Using collection:");
            console.log(mongoCollection);
            listingId = destringify(listingId);
            console.log("Query is: " + JSON.stringify(listingId));
            result = await collection.find(listingId).project({_id: 0, id: 1, host_id: 1}).limit(100).toArray();
            console.log("Search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        res.send(result);
   }
   findId(req.query).catch(console.dir);
})


// findListings selects a few columns that briefly describe the listing on the table
// from the collection to display on the php frontent as opposed to pulling all columns from all listigs.
app.get('/findListings', (req, res) => {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Connected");
    async function findListings(findColumns) {
        var result = ""
        try {
            await client.connect();
            console.log("Connected to DB:");
            console.log(mongoDatabase);
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("Using collection:");
            console.log(mongoCollection);
            findColumns = destringify(findColumns);
            console.log("Query is: " + JSON.stringify(findColumns));
            result = await collection.find(findColumns).project({_id: 0, id: 1, name: 1, neighbourhood_cleansed: 1, host_name: 1, accommodates: 1}).limit(100).toArray();
            console.log("Search Completed");
        } finally {
            await client.close();
            console.log("Client closed.");
        }
        console.log("returning result:");
        console.log(result);
        res.send(result);
    }
    findListings(req.query).catch(console.dir);
})


// Healthcheck on /healthz
app.get('/healthz', (req, res) => {
    res.send('ok');
})

// Shows the URL of the MongoDB instance
app.get('/url', (req, res) => {
    res.send(url);
})

// Deploy web server and log status
app.listen(port, hostname, () => {
    console.log(`MongoDB app listening at http://${hostname}:${port}`)
})

//async function listDatabases(client){
//    databasesList = await client.db().admin().listDatabases();
 
//    console.log("Databases:");
//    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
//}

//async function main(){
//    const uri = "mongodb+srv://root:abc123@172.30.134.34/airbnb?retryWrites=true&w=majority";
    
//    const client = new MongoClient(uri);
 
//    try {
        // Connect to the MongoDB cluster
//        await client.connect();
 
        // Make the appropriate DB calls
//        await  listDatabases(client);
 
//    } catch (e) {
//        console.error(e);
//    } finally {
//        await client.close();
//    }
//}

//main().catch(console.error);
