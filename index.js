/*  ##################### Backrnd Part #################
    Titel : NodeJs API With MongoDB
    Author : Feggaa Laid
    Date : 16/06/2022

    To : MIHTAB GENERAL TRADING
*/
const mongoose = require('mongoose');
const path     = require('path')
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, '/')));
const dbName = "TestDB"                               // DataBase Name
const dbUrl  = "mongodb://localhost:27017/"+dbName;


/* Start to Connect database */
mongoose.connect(dbUrl)
.then(()=> console.log('Connected to MongoDB...'))
.catch(err => console.error('could not connect to MongoDB!!!',err))


/* Create Phone Schema */
const PhonesSchema = new mongoose.Schema({
    Model        : String,
    Company    : String,
    Released     : {type : Date ,default : Date.now},
    Versions      : [String],
    Colors     : [String],
    isHidden   : Boolean,
})

/* Create Company Schema */
const CompaniesSchema = new mongoose.Schema({
    _id             :String, 
    Name        : String,
    Contry    : String,
    Logo     : String,
})

const Phone = mongoose.model('phones',PhonesSchema)
const Company = mongoose.model('companies',CompaniesSchema)

var ErrorGet = {Result : "failed",msg : "",search : ""} // response if the request was not processed correctly
var response = {Data : false,insert: false, Items : 0}

app.use(express.json())  // Receive data as JSON format

/* Load Home Page */
app.get('/',(req,res)=> {
    res.sendFile('index.html')
})


/* Get Devices Only */
app.get('/api/Device/:Permission/:Device',(req,res)=> {
    const dev = req.params.Device
    const Permission = req.params.Permission
    if(dev == "" || Permission == ""){
        ErrorGet.msg = "Nothing has been passed"
        res.status(404).send(ErrorGet)
        return
    }

    var qMatch = {Model: dev,isHidden : "false"} // default search template

    if(Permission == "admin") delete qMatch.isHidden
    if(typeof dev === 'undefined' || dev == "") delete qMatch.Model


    getDevices(qMatch).then(Result => {
        res.json(Result)
    }).catch(err => {
        ErrorGet.msg = "The Device is not exist"
        ErrorGet.search = dev
        res.status(404).send(ErrorGet)
        })
})

/* Get Devices with Compny Info */
app.get('/api/DeviceWithCompany/:Permission?/:Device?',(req,res)=> {
    var dev = req.params.Device
    const Permission = req.params.Permission
    if(Permission == ""){
        ErrorGet.msg = "Please Pass UserName"
        res.status(404).send(ErrorGet)
        return
    }
    var qMatch = {Model: dev,isHidden : "false"} // default search template

    if(Permission == "admin") delete qMatch.isHidden
    if(typeof dev === 'undefined' || dev == "") delete qMatch.Model

    Phone.aggregate([{
        $match: qMatch,
      },{
        $lookup:{
            from : "companies",
            localField:'Company',
            foreignField:'_id',
            as : "Brand" // Get Sub Item as Brand
        },
    },]).exec((err,copm)=>{
        if(err) throw err;
        res.json(copm)

    })
})

/* Get Companies only */
app.get('/xapi/Companies',(req,res)=> {
    getCompanies().then(Result => {
        res.json(Result)
    })
    
})
/* add Devices */
app.post('/api/Devices',(req,res)=> {
    var data = req.body
    response.Items = data.length
    if(data.length == 0) res.json(response)
    response.Data = true;
    insertToDB(Phone,data,res)

})

/* add Companies */
app.post('/api/Companies',(req,res)=> {
    var data = req.body
    
    if(data.length == 0) res.json(response)
    response.Data = true;
    console.log(data.length,data)
    insertToDB(Company,data,res)
    
})
/* Start The server on Port 8080 */
app.listen("8080",()=>{
    console.log("start Server")
})

/* Insert One Or Many Document */
function insertToDB(Table,jData,res){
    if(jData.length == 1){
        Table.collection.insertOne(jData[0], function (err, docs) {
        if (err){ 
            res.json(response)
            return console.error(err);
        } else {
           response.insert = true
           res.json(response)
        }
      });
    } else {
        Table.collection.insertMany(jData, function (err, docs) {
            if (err){ 
                res.json(response)
                return console.error(err);
            } else {
              response.insert = true
              res.json(response)
            }
          });
    }
    
}

/* Devices Search */
async function getDevices(findArg){
    const phones = await Phone.find(findArg)
    return phones
}

/* Companies Search */
async function getCompanies(){
    const Companys = await Company.find()
    return Companys
}
