const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');

const actions = require('./actions');
const port = process.env.PORT || 3001;
const app = express();

// parsery 
app.use(bodyParser.json());
app.use(cors());

//obsługa requestów
app.use('/', router);

//GET odczyt z bazy - kwerenda
router.get('/apiGET', actions.getData);

//POST odczyt z bazy - kwerenda
router.post('/apiPOST', actions.postData);


// log server
app.listen(port, () => {
  console.log(`listening to... http://localhost: ${port}`);
});