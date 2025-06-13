import Lottie from 'lottie-react';
import React from 'react';
import cat from '../assets/cat.json';

const HomePage = () => {
  return (
    <div className='mt-10 rounded-lg' style={{
      backgroundColor: '#87CEEB',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div className="flex justify-center">
        <Lottie animationData={cat} loop={true} className="w-52 h-52" />
      </div>
      <h1 style={{ color: 'red', fontSize: '24px' }}>
        Home Page de PetMatch
      </h1>
      <p>En construccion</p>
    </div>
  );
};

export default HomePage;