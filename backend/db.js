const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const mongoURI = "mongodb://localhost:27017/inotesdata"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Mongo Successfully");
    }).then(() => {
        // If connection is successful, start the server.
        console.log("sucessfully connected to database ");
    })
        .catch(() => {
            console.log("Error found try again");
        });
}

module.exports = connectToMongo;