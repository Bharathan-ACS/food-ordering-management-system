import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-page">

            {/* Hero Section */}
            {/* <section className="hero-section">

                <div className="hero-content">
                    <p className="hero-small">
                        WELCOME TO FOOD ORDERING
                    </p>

                    <h1>
                        Delicious Food,
                        <br />
                        Delivered To You
                    </h1>
                </div>

            </section> */}

            {/* Call To Action */}
            <section className="cta-section">

                <h2>Hungry?</h2>

                <p>
                    Explore our menu and order your favorite food.
                </p>

                <Link to="/menu" className="primary-btn">
                    Order Now
                </Link>

            </section>

        </div>
    );
}

export default Home;