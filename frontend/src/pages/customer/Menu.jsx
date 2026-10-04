import { useEffect, useState } from "react";
import api from "../../services/api";

function Menu() {
    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            const response = await api.get("/foods/");
            setFoods(response.data);
        } catch (error) {
            setMessage("Failed to load food items");
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (foodId) => {
        try {
            await api.post("/cart/items", {
                food_id: foodId,
                quantity: 1
            });

            setMessage("Food added to cart successfully!");

            setTimeout(() => {
                setMessage("");
            }, 2000);

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Failed to add food to cart"
            );
        }
    };

    const filteredFoods = foods.filter((food) =>
        food.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loading">
                Loading menu...
            </div>
        );
    }

    return (
        <div className="menu-container">

            <div className="menu-header">
                <div>
                    <p className="menu-subtitle">
                        EXPLORE OUR MENU
                    </p>

                    <h2>Delicious Food</h2>

                    <p>
                        Choose from our freshly prepared dishes.
                    </p>
                </div>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for food..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            {message && (
                <div className="menu-message">
                    {message}
                </div>
            )}

            {filteredFoods.length === 0 ? (
                <div className="empty-menu">
                    <div>🍽️</div>
                    <h3>No food found</h3>
                    <p>
                        Try searching for another food item.
                    </p>
                </div>
            ) : (

                <div className="food-grid">

                    {filteredFoods.map((food) => (

                        <div
                            className="food-card"
                            key={food.id}
                        >

                            <div className="food-content">

                                <div className="food-title-row">

                                    <h3>
                                        {food.name}
                                    </h3>

                                    <span
                                        className={
                                            food.is_available
                                                ? "available-badge"
                                                : "unavailable-badge"
                                        }
                                    >
                                        {food.is_available
                                            ? "Available"
                                            : "Unavailable"}
                                    </span>

                                </div>

                                <p className="food-description">
                                    {food.description ||
                                        "Delicious food prepared with quality ingredients."}
                                </p>

                                <div className="food-bottom">

                                    <span className="food-price">
                                        ₹{food.price}
                                    </span>

                                    <button
                                        onClick={() =>
                                            addToCart(food.id)
                                        }
                                        disabled={
                                            !food.is_available
                                        }
                                    >
                                        {food.is_available
                                            ? "Add to Cart"
                                            : "Unavailable"}
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Menu;