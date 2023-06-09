import React from 'react';
import Banner from './Banner';
import About from './About';
import Services from './Services';
import ContactHero from './ContactHero';
import PopularProduct from './PopularProduct';

const Home = () => {
    document.title = 'Home - Car doctor '
    return (
        <div>
            <Banner /> 
            <About /> 
            <Services />
            <ContactHero /> 
            <PopularProduct />
        </div>
    );
};

export default Home;