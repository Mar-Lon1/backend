const mongoose = require('mongoose');
const schema = new mongoose.Schema({ name: String });
schema.pre('save', async function(next, options) {
  console.log('typeof next:', typeof next);
});
const Model = mongoose.model('Test', schema);
const m = new Model({ name: 'test' });
m.save().catch(e => console.error(e.message));
