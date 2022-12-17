const { Schema, model } = require('mongoose');
const reactionsSchema = require('./Reactions');

// Schema to create a course model
const thoughtsSchema = new Schema(
  {
    thoughtPost: {
      type: String,
      required: true,
      maxlength: 300,
      minlength: 2
    },
    user: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => {
        if (date) {
            return date.toLocaleDateString();
        }
      }
    },
    reactions: [reactionsSchema]
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

thoughtSchema.virtual("reactionCount")
    .get(function() {
        return this.reactions.length;
    });

const Thoughts = model('thoughts', thoughtsSchema);

module.exports = Thoughts;
