const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const elasticsearch = require("elasticsearch")

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));

const esClient = elasticsearch.Client({
    host: "https://elastic:v3+G0ARyN_2Ot7O8Jih9@resumes.arivani.com:9200",
    log: "trace"
})


app.get("/resumes", (req, res) => {
    const searchText = req.query.text
    esClient.search({
        index: "resumes",
        body: {
            query: {
                match: {"content": searchText.trim()}
            }
        }
    })
    .then(response => {
        return res.json(response)
    })
    .catch(err => {
        return res.status(500).json({"message": "Error"})
    })
})


app.use(express.static('public'));
//set headers
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Token");

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};




app.use(allowCrossDomain);
/* configure body-parser */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


/* listen for requests */
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});