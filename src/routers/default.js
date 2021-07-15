const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.render('pages/default');
});

router.get('/login', (req, res) => {
   res.send(`Hello ${req.params.id}!`);
});



module.exports = router;