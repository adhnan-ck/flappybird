import React from 'react';
import './About.css'; // Regular CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About</h1>
      <p className="about-description">
        Flappy Bird Online made by Adhnan ck. Press Space , Arrow Up or X to jump in desktop devices, touch the screen in mobile devices.Thanks for playing 
      </p>
      <ul className="about-list">
        <li>💻 Email at <a href="mailto:adhnanck07@gmail.com?subject=Hello&body=I would like to connect with you."> adhnanck07@gmail.com </a> for game related queries</li>
        <li>🌱 Game built with react js</li>
        <li>🚀 More features coming soon </li>
        <p>&copy; 2024 flappybirdonline.fun . All Rights Reserved.</p>
        {/* <li>📚 </li> */}
      </ul>
    </div>
  );
};

export default About;
