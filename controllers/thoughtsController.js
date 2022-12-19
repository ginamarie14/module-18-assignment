const { Reactions, Thoughts, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thoughts.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
        ? res.status(404).json({message: "This thought doesn't exist."})
        : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thoughts.create(req.body)
      .then((thought) => {
        console.log(thought);
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
    .then((user) => {
      console.log(user);
      if (!user) {
        res.status(404).json({
          message: "User not found, thought created without user",
        });
        return;
      }
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },
  // Delete a thought
  deleteThought(req, res) {
    Thoughts.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.deleteMany({ _id: { $in: thought.users } })
      )
      .then(() => res.json({ message: 'Thought and user(s) desleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((updateThought) =>
        !updateThought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  
  // Create a reaction
  createReaction(req, res) {
    if (req.body.reactionText && req.body.username) {
        Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $push: { reactions: { ...req.body }} },
            {runValidators: true, new: true }
        )
        .then((thought) => thought ? res.status(200).json(thought) : res.status(404).json({ message: "No thought found with that id!" }))
        .catch((err) => res.status(500).json(err));
    }
    else {
        res.status(404).json({ message: "Request body must contain reactionBody and username" });
    }
  },

  // Delete a reaction by its ID
  deleteReaction(req, res) {
  Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: {reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
  )
  .then((thought) =>
    thought ? res.status(200).json(thought)
    : res.status(404).json({ message: "No thought found with that id!" }))
  .catch((err) =>
    res.status(500).json(err));
  }
};
