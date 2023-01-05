

const tasksModel = require("../model/taskModel")
const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")
const validation = require('../validation/validator')


const createTasks = async function (req, res) {

    
    try {
        const data = req.body
        const userId = req.params.userId
        const { title, body, latitude, longitude } = data

        if (!validation.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please provide correct userId" })
        }
        req.body.userId = userId
        // title
        if (!validation.isValid(title)) {
            return res.status(400).send({ status: false, message: "Please provide user title" })
        }

        if (!validation.isValid(body)) {
            return res.status(400).send({ status: false, message: "Please provide user body" })
        }

        if (!validation.isValid(latitude)) {
            return res.status(400).send({ status: false, message: "Please provide user latitude" })
        }
        if (!validation.isValidlatitude(latitude)) {
            return res.status(400).send({ status: false, message: "Please provide correct latitude" })
        }

        if (!validation.isValid(longitude)) {
            return res.status(400).send({ status: false, message: "Please provide user longitude" })
        }
        if (!validation.isValidlongitude(longitude)) {
            return res.status(400).send({ status: false, message: "Please provide correct longitude" })
        }


        if (req.decodedToken.userId == userId) {
            const users = await tasksModel.create(data)
            console.log(users)
            return res.status(201).send({ status: true, message: "product created successfully", data: users })
        }
        else { return res.status(403).send({ Status: false, message: "User is not authorized" }) }  // if user is not authorized


    } catch (err) {
        return res.status(500).send({
            status: false,
            Error: err.message
        })
    }
}

//GET ALL TASK 

const getTask = async function (req, res) {

    try {
        const userId = req.params.userId

        if (!validation.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please provide correct userId" })
        }

        if (req.decodedToken.userId == userId) {
            const tasks = await tasksModel.find({ userId: userId, isActive: false }).limit(10)
          console.log(tasks)
            if (tasks == null) {
                return res.status(400).send({ status: false, message: "No task found" })
            }

            res.status(200).send({ status: true, message: "successful", data: tasks })
        } else {
            return res.status(403).send({ Status: false, message: "User is not authorized" })
        }

    } catch (err) {
        return res.status(500).send({
            status: false,
            Error: err.message
        })
    }
}


//update task


const updateTasks = async function (req, res) {
    try {
        const data = req.body

        let obj = {}

        const { title, body, latitude, longitude } = data
        const {userId} = req.params
        const taskId = req.params.taskId
        if(!validation.isValidObjectId(userId)) {
            return res.status(400).send({status: false, message: "Please provide userID "})
        }

        if(!validation.isValidObjectId(taskId)) {
            return res.status(400).send({status: false, message: "Please provide taskId"})
        }

        const task = await tasksModel.findById(taskId)
        if (!task) { return res.status(400).send({ status: false, message: "No task Exist with This User" }) }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(401).send({ status: false, message: 'unauthorised access! owner info does not match' })
        }

        if (validation.isValid(title)) {
            obj['title'] = title
        }

        if (validation.isValid(body)) {
            obj['body'] = body
        }

        if (validation.isValid(latitude)) {
            obj['latitude'] = latitude
        }

        if (validation.isValid(longitude)) {
            obj['longitude'] = longitude
        }

        if (req.decodedToken.userId == userId) {
            console.log(obj)
            const updateTask = await tasksModel.findOneAndUpdate({ _id: taskId }, { $set: obj }, { new: true })
            return res.status(200).send({
                status: true,
                message: "successful",
                Data: updateTask
            })
        } else {
            return res.status(403).send({ status: false, message: "authorization denied" })
        }

    } catch (err) {
        return res.status(500).send({
            status: false,
            Error: err.message
        })
    }

}





const taskDelete = async function (req, res) {

    try {   //const data = req.body
        const userId = req.params.userId
        const taskId = req.params.taskId

        if(!validation.isValidObjectId(userId)) {
            return res.status(400).send({status: false, message: "Please provide userID "})
        }

        if(!validation.isValidObjectId(taskId)) {
            return res.status(400).send({status: false, message: "Please provide taskId"})
        }

        const task = await tasksModel.findById(taskId)
        if (!task) { return res.status(400).send({ status: false, message: "No task Exist with This User" }) }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(401).send({ status: false, message: 'unauthorised access! owner info does not match' })
        }

        if (req.decodedToken.userId == userId) {
            if (task.isActive == false) {
                const deleteTak = await tasksModel.findByIdAndUpdate({ _id: taskId }, { $set: { isActive: true } }, { new: true })
                return res.status(200).send({
                    status: true,
                    message: "successfully deleted"
                })
            } else {
                return res.status(403).send({
                    status: true,
                    message: "Already deleted",
                })
            }
        } else {
            return res.status(403).send({ status: false, message: "authorization denied" })

        }


    } catch (err) {
        return res.status(500).send({
            status: false,
            Error: err.message
        })
    }
}



const RetriveLatitutedLongitude = async function(req,res){
    try{
       const data = req.body
       const {latitude, longitude} = data

       
       if (!validation.isValid(latitude)) {
        return res.status(400).send({ status: false, message: "Please provide user latitude" })
    }
    if (!validation.isValidlatitude(latitude)) {
        return res.status(400).send({ status: false, message: "Please provide correct latitude" })
    }

    const fetch = await tasksModel.find({latitude:latitude,longitude:longitude}).limit(10)

    if(fetch == null){
        return res.status(400).send({ status: false, message: "No task found" })
    }
    return res.status(200).send({
        status: true,
        message: "successfully",
        data:fetch
    })

    }catch(err){
        return res.status(500).send({
            status: false,
            Error: err.message
        })
    }
}

const fetchCount = async function(req,res){
    try{

        const data = req.body.isActive
        if (!validation.isValid(req.body.isActive)) {
            return res.status(400).send({ status: false, message: "Please provide isActive" })
        }
        
        const count = await tasksModel.find({isActive:data}).count()
        return res.status(200).send({
            status: true,
            message: "successfully",
            data:count
        })


    }catch(err){
        return res.status(500).send({
            status: false,
            Error: err.message
        })
    }
}

module.exports = {
    createTasks,
    getTask,
    updateTasks,
    taskDelete,
    RetriveLatitutedLongitude,
    fetchCount
}