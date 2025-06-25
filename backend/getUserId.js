const mongoose = require('mongoose');
const User = require('./models/User');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const user = await User.findOne();
  if (user) {
    console.log(user._id.toString());
  } else {
    console.log('No user found');
  }
  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
