const mongoose = require('mongoose');
const User = require('./models/User');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const user = await User.findOne({ email: 'testuser@example.com' });
  if (user) {
    console.log('User exists');
  } else {
    console.log('User does not exist');
  }
  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
