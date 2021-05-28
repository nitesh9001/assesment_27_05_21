const mongoose = require("mongoose");

process.env.SUPPRESS_NO_CONFIG_WARNING = "Done";

const connection = async () => {
  const conn = await mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connection;
