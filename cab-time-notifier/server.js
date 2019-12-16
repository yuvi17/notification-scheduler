const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const cors = require('cors');
const app = express();
const axios = require('axios');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs')
const moment = require('moment-timezone')
const stepfunctions = new AWS.StepFunctions({region: 'us-east-1'});

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json({ extended: true }));
app.use(cors());
dotenv.config({path: '.env.development.local'});
var stream = fs.createWriteStream("log.txt", {flags:'a', encoding: 'utf8'});

// log all requests to a file
axios.interceptors.request.use(request => {
  let options = Object.assign({}, request.params)
  options['key'] = "XXXXXXXXXXXXXXXX"
  const logData = JSON.stringify({url: request.url, params: options})
  stream.write(logData + "\n")
  return request
})

app.post('/when-to-book', function(req, res) {
  body = req.body
  stream.write(JSON.stringify(body) + "\n")
  console.log(body)
  const arrivalDate = moment.tz(body['time'], body['timeZone'])
  body['arrivalDate']= arrivalDate

  notify_user(body)

  return res.send({
    response: "OK"
  });
});

app.get('/logs', function(req, res){
  var contents = fs.readFileSync('log.txt', 'utf8');
  return res.send({
    data: contents
  });
});


// Ideally this can be moved to a service/util
function notify_user(options) {
  fetch_times(options).then(function(values) {
    const travel_time = parseInt(values[0].data.rows[0].elements[0].duration.value)
    const cab_time = parseInt(values[1].data.times[0].estimate)
    const dueDate = options['arrivalDate'].subtract(travel_time + cab_time, 'seconds')
    const destination_address = values[0].data.destination_addresses[0]
    const source_address = values[0].data.origin_addresses[0]

    mail_options = generate_mail_options(dueDate, destination_address, source_address,travel_time, cab_time, options['email'])
    trigger_scheduler(mail_options)
      .then(function(data){
        console.log(data)
      })
      .catch(function(err) {
        console.log(err)
      })
  }).catch((err) => {
    console.log(err)
  })
};

const fetch_times = async(options) => {
  return Promise.all([travel_time(options), cab_booking_time(options)]).then(function(values){
    return values
  });
}


const travel_time = (options) => {
  const url = "https://maps.googleapis.com/maps/api/distancematrix/json"

  params = {
    origins: options['source'],
    destinations: options['destination'],
    arrival_time: options['arrivalDate'].unix(),
    key: process.env.GOOGLE_MAPS_KEY // puts your key in ENV
  }
  return axios.get(url, {params: params})
}

const cab_booking_time = (options) => {
  [source_lat, source_long] = options['source'].split(",")
  const url = 'https://rr1iky5f5f.execute-api.us-east-1.amazonaws.com/api/estimate/time'

  return axios.get(url,{
    params: {
      start_longitude: source_long,
      start_latitude: source_lat
    }
  })
}

const trigger_scheduler = (options) => {
    const stateMachineArn = process.env.STATE_MACHINE_ARN; // PUT ARN IN ENV
    return stepfunctions.startExecution({
        stateMachineArn,
        input: JSON.stringify(options),
    }).promise()
    
}

function generate_mail_options(dueDate, destination_address, source_address, travel_time, cab_time, email) {
  const leaveBy = dueDate.toString()
  return {
    dueDate: dueDate.toISOString(),
    body: {
      to: email,
      subject: mail_subject(leaveBy),
      body_text: mail_body_text(leaveBy, destination_address, source_address, travel_time, cab_time),
      body_html: mail_body_html(leaveBy, destination_address, source_address, travel_time, cab_time),
    }
  }
}


function mail_body_text(leaveBy, destination_address, source_address, travel_time, cab_time) {
  return "Please leave by " + leaveBy + " from " + source_address +
  " since booking a Uber will take around " + Math.ceil(cab_time/60) + " minutes and it takes around " 
  + Math.ceil(travel_time/60)+ " minutes" +
  " to reach " + destination_address  + " ."
}

function mail_body_html(leaveBy, destination_address, source_address, travel_time, cab_time) {
  return "<p>Please leave by " + leaveBy + " from " + source_address +
  " since booking a Uber will take around " + Math.ceil(cab_time/60) + " minutes and it takes around " 
  + Math.ceil(travel_time/60) + " minutes" +
  " to reach " + destination_address + "</p>"
}

function mail_subject(leaveBy) {
  return "Please leave by " + leaveBy
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8888);

