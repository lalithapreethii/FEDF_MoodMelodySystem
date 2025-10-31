import React from 'react';

const Profile = ({ user }) => (
  <div className="card">
    <h2>My Profile</h2>
    <div>Email: {user?.email}</div>
    {/* Show mood stats, playlists, etc. */}
  </div>
);

export default Profile;
