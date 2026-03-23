import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Row from '../components/Row'; // Import our new smart component

const Home = () => {
  return (
    <div className="min-h-screen bg-netflix-black pb-40">
      <Navbar />
      <Hero />
      
      {/* The Movie Rows */}
      {/* Note: Since your backend currently only has one route (/content/movies), 
          all these rows will show the same data for now. We can add filtering later! */}
      <div className="-mt-32 relative z-20">
        <Row title="Trending Now" fetchUrl="/content/movies" isLargeRow={true} />
        <Row title="Top Rated" fetchUrl="/content/movies" />
        <Row title="Action Movies" fetchUrl="/content/movies" />
        <Row title="Comedies" fetchUrl="/content/movies" />
      </div>
    </div>
  );
};

export default Home;