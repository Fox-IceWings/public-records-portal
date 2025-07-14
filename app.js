const express = require('express')
const pg = require('pg')

//express middlewere
const bodyParser = require('body-parser')
const path = require('path');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded()
const cors = require("cors")

//express config
const app = express()
const port = 3000
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

console.log('running')
//postgress information
const pool = new pg.Pool({
    host: 'localhost',
    user: 'alyx_dev',
    password: "WolfFlyer@80",
    database: 'record_simple_dev',
    port: 5433,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60
})


app.get('/:agency/embeded-request-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', req.params['agency'] + '.html'))
})

//goverment pages
app.get('/goverment/sign-up', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(__dirname, 'public', 'gov-sign-up.html'))
})

app.get('/goverment/client/:id/admin-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'goverment-admin-page.html'))

})


//dev pages
app.get('/dev/agency-list', (req,res) => { res.sendFile(path.join(__dirname, 'public', 'agency-list.html'))})

app.get('/', (req,res) => { res.sendFile(path.join(__dirname, 'public', 'home.html'))})

//api end points
app.post('/api/embed/submit-records-request', urlencodedParser, function (req, res) {

    res.sendFile(path.join(__dirname, 'public', agency + '.html'))

})

app.post('/api/enroll/agency', jsonParser, function (req, res, next) {

    const req_JSON = req.body
    const active_alert_text = `${req_JSON['agency']} in ${req_JSON['city']}, ${req_JSON['county']}, ${req_JSON['state']}, ${req_JSON['country']} SUBMITED A QUOTE REQUEST\n\nContact details:\nName:\t${req_JSON['pname']}\nPhone:\t${req_JSON['pnumber']}\nEmail:\t${req_JSON['pemail']}\n\nRequest details:\n${req_JSON['text']}`

    //send alert that there is a new enrollment to alyx and cal
    try {
        sendTelegramMessage(active_alert_text)
    } catch {
        console.error("TG send failed")
    }

    const query_text = 'INSERT INTO clients(name, municipal_location, district_location, province_name, country_name, primary_contact, primary_number, primary_email, service_request) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id'
    const query_values = [req_JSON['agency'],req_JSON['city'],req_JSON['county'],req_JSON['state'],req_JSON['country'],req_JSON['text'],req_JSON['pname'],req_JSON['pnumber'],req_JSON['pemail']]
    
    pool.query(query_text, query_values)
        .then((database_response) => {
            console.log(`new client added to DB ${database_response.rows[0]['id']}`)
            res.send("we have your request")
        })
        .catch((err) => {
            console.log("CAUGHT ERROR")
            console.log(err)
            res.send('error')
        })
})

app.get('/api/agency-list', (req, res) => {

    pool.query('SELECT id, name FROM clients')
    .then((db_res) => {
        res.send(db_res.rows)
    })
    .catch((err) => {
        console.error(err)
        res.send({error: err})
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


async function sendTelegramMessage(text) {

    console.log(text)
    const users_to_alert = ["1020049254"]//, "199882460"] //Alyx, Calixte

    for (const tg_user of users_to_alert) {
        fetch("https://api.telegram.org/bot7809926443:AAFLSHPR8IM2MTszOXIeeAiDtft94oyGDSc/sendMessage", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "chat_id": "1020049254",
                "text": text
            })
        })
        .catch((err) => {
            console.log('TG send error')
            console.log(err)
        })
    }
    console.log("Sent a Telegram Alert to Alyx")

}