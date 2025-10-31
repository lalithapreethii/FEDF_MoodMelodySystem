import React from 'react';

const Navbar = () => (
  <nav className="navbar">
    <img src={require('../assets/logo.png')} alt="Logo" style={{height: 40}} />
    <h1>Mood Melody</h1>
    {/* Add navigation buttons/links as needed */}
  </nav>
);

export default Navbar;
