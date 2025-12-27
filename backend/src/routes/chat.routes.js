const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');

const router=express.Router();


router.post('/',authMiddleware.authUser,chatController.createChat);



// new changes 


/* GET /api/chat/ */
router.get('/', authMiddleware.authUser, chatController.getChats)


/* GET /api/chat/messages/:id */
router.get('/messages/:id', authMiddleware.authUser, chatController.getMessages)




/* DELETE /api/chat/:id */
router.delete('/:id', authMiddleware.authUser, chatController.deleteChat);









module.exports=router;