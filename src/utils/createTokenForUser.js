const createTokenForUser = (user) => {
	return { name: user.name, userId: user._id, role: user.role };
  };
  
  module.exports = createTokenForUser;
  