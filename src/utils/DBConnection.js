// const mongoose = require ('mongoose');
// require('dotenv').config();

// const DBConnection = () => {
//     mongoose.connect(process.env.MONGO_URI)
//     .then(() => {       
//         console.log('Connected to MongoDB');
//     })
//     .catch((err) => {
//         console.error('Error connecting to MongoDB:', err);
//     });
// };

// module.exports = DBConnection;
const mongoose = require("mongoose");

const DBConnection = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error(err);
  }
};

module.exports = DBConnection;