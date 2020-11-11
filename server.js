const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const db = process.env.DATABASE_MT;

mongoose.connect(db, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('DATABASE CONNECTED');
}).catch((err) => {
    console.log(err)
    console.log('SOMETHING WENT WRONG WITH THE DATABASE');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`App running at port ${PORT}`);
})