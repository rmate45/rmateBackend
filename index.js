const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDB = require('./src/config/db.config');
const { PORT } = require('./src/config/env.config');

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/test_retiremate',async(req,res)=>{ res.send('Working...')})

const apiRoutes = require('./src/routes/v1/api.routes')
app.use('/api/v1', apiRoutes);

connectDB()


app.listen(PORT, () => console.log(`Backend running on PORT ${PORT}`))