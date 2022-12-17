const { Schema, model } = require('mongoose');

// Schema to create Student model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email"]
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'thoughts'
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
    }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false
  }
);

userSchema.virtual('friendCount')
  .get(function() {
    return this.friends.length;
  });

  
const User = model('user', userSchema);

module.exports = User;
