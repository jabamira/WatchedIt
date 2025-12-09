const User = require("./User");
const Poll = require("./Poll");
const PollOption = require("./PollOption");
const PollVote = require("./PollVote");

// User → Poll
User.hasMany(Poll, { foreignKey: "userId", onDelete: "CASCADE" });
Poll.belongsTo(User, { foreignKey: "userId" });


Poll.hasMany(PollOption, { foreignKey: "pollId", onDelete: "CASCADE" });
PollOption.belongsTo(Poll, { foreignKey: "pollId" });

// Poll → PollVote
Poll.hasMany(PollVote, { foreignKey: "pollId", onDelete: "CASCADE" });
PollVote.belongsTo(Poll, { foreignKey: "pollId" });

// PollOption → PollVote
PollOption.hasMany(PollVote, { foreignKey: "optionId", onDelete: "CASCADE" });
PollVote.belongsTo(PollOption, { foreignKey: "optionId" });

// User → PollVote   (может быть null при анонимном)
User.hasMany(PollVote, { foreignKey: "userId", onDelete: "SET NULL" });
PollVote.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  User,
  Poll,
  PollOption,
  PollVote,
};
