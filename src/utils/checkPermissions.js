const CustomError = require('./errors');

const checkPermissions = (requestUser, resourceUserId) => {
    if(requestUser.role === 'admin') return;
    if(requestUser.userId === resourceUserId.toString()) return;

    throw new CustomError.UnauthenticatedError('You are not allowed to perform this action');
};

module.exports = checkPermissions;
