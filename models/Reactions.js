const { Schema, Types } = require('mongoose');

const reactionsSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionText: {
      type: String,
      required: true,
      maxlength: 140,
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
  },
);

module.exports = reactionsSchema;
