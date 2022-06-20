const {getEvents,addEvent,deleteEvent,editEvent,} = require('../controllers/')
const express = require('express')
const {banners} = require('../services')
const Router = express.Router()
Router.post('/addEvent',banners,addEvent)
Router.get('/getEvents',getEvents)
Router.delete('/deleteEvent',deleteEvent)
Router.put('/editEvent',banners,editEvent)

module.exports = Router