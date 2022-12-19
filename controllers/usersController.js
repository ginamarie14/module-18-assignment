const { Thoughts, User } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) =>
        res.status(200).json(users))
      .catch((err) =>
        res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findById(req.params.userId)
        .then(user =>
          user ? res.status(200).json(user)
          : res.status(404).json({ message: 'No user found with this id' }))
        .catch(err => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a student and remove them from the course
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Course.findOneAndUpdate(
              { users: req.params.userId },
              { $pull: { users: req.params.userId } },
              { new: true }
            )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: 'User deleted, but no thoughts found',
            })
          : res.json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // update user
  updateUser(req, res) {
    User.findByIdAndUpdate(
        req.params.userId,
        { $set: req.body },
        { runValidators: true, new: true }
    )
    .then((user) =>
      user ? res.status(200).json(user)
      : res.status(404).json({ message: 'No such user exists' }))
    .catch((err) =>
      res.status(500).json(err));
  },

  // Add a friend
  addFriend(req, res) {
    User.findByIdAndUpdate(req.params.userId, {$addToSet: {friends: req.params.friendId}}, {runValidators: true, new: true})
  .then((user) =>
    user ? res.status(200).json(user)
    : res.status(404).json({ message: 'No such user exists' }))
  .catch((err) =>
    res.status(500).json(err));
  },

  // Remove a friend from user's friend list
  removeFriend(req, res) {
    User.findByIdAndUpdate(req.params.userId, {$pull: {friends: req.params.friendId}}, {runValidators: true, new: true })
    .then((user) =>
      user ? res.status(200).json(user) : res.status(404).json({message: 'No such user exists'}))
    .catch((err) =>
      res.status(500).json(err));
  },
};
