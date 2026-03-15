const express =  require ('express').Router()
const userController = require('../controllers/userController')

router.post("/create",userController.createUser)
router.get("/get",userController.getUsers)
router.get("/get/:id",userController.getUserById)
router.put("/update/:id",userController.updateUser)
router.delete("/delete/:id",userController.deleteUser)

module.exports = router

