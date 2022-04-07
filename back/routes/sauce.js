const express = require('express');

const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');


router.post('/', auth, multer, sauceCtrl.createSauce);

router.get('/:id', auth, sauceCtrl.getSauce);

router.put('/:id', auth, multer, sauceCtrl.updateSauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.get('/', auth, sauceCtrl.getSauces);

router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;