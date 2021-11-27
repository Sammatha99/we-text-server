const allRoles = {
  user: ['manageChatrooms', 'manageUsers', 'manageUsers', 'managePlaylists', 'manageSongs', 'manageMessages'],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
