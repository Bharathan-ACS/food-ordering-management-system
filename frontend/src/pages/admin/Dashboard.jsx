import { useEffect, useState } from "react";
import api from "../../services/api";

function Dashboard() {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);

    // Food form
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        is_available: true
    });

    const [editingId, setEditingId] = useState(null);

    // Category form
    const [categoryForm, setCategoryForm] = useState({
        name: "",
        description: ""
    });

    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    // =========================
    // FETCH DATA
    // =========================

    const fetchData = async () => {
    try {
        const foodsResponse = await api.get("/foods/");
        const categoriesResponse = await api.get("/categories/");
        const ordersResponse = await api.get("/admin/orders");
        const customersResponse = await api.get("/admin/customers");

        setFoods(foodsResponse.data);
        setCategories(categoriesResponse.data);
        setOrders(ordersResponse.data);
        setCustomers(customersResponse.data)

    } catch (error) {
        setMessage(
            error.response?.data?.detail ||
            "Failed to load data"
        );
    }
};

    // =========================
    // FOOD MANAGEMENT
    // =========================

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                category_id: Number(form.category_id),
                is_available: form.is_available
            };

            if (editingId) {
                await api.put(`/foods/${editingId}`, data);
                setMessage("Food updated successfully");
            } else {
                await api.post("/foods/", data);
                setMessage("Food added successfully");
            }

            resetForm();
            fetchData();

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Food operation failed"
            );
        }
    };

    const editFood = (food) => {
        setEditingId(food.id);

        setForm({
            name: food.name,
            description: food.description || "",
            price: food.price,
            category_id: food.category_id,
            is_available: food.is_available
        });
    };

    const deleteFood = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this food?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/foods/${id}`);

            setMessage("Food deleted successfully");

            fetchData();

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Failed to delete food"
            );
        }
    };

    const resetForm = () => {
        setEditingId(null);

        setForm({
            name: "",
            description: "",
            price: "",
            category_id: "",
            is_available: true
        });
    };

    // =========================
    // CATEGORY MANAGEMENT
    // =========================

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;

        setCategoryForm({
            ...categoryForm,
            [name]: value
        });
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                name: categoryForm.name,
                description: categoryForm.description
            };

            if (editingCategoryId) {
                await api.put(
                    `/categories/${editingCategoryId}`,
                    data
                );

                setMessage("Category updated successfully");
            } else {
                await api.post("/categories/", data);

                setMessage("Category added successfully");
            }

            resetCategoryForm();
            fetchData();

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Category operation failed"
            );
        }
    };

    const editCategory = (category) => {
        setEditingCategoryId(category.id);

        setCategoryForm({
            name: category.name,
            description: category.description || ""
        });
    };

    const deleteCategory = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/categories/${id}`);

            setMessage("Category deleted successfully");

            fetchData();

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Failed to delete category"
            );
        }
    };

    const resetCategoryForm = () => {
        setEditingCategoryId(null);

        setCategoryForm({
            name: "",
            description: ""
        });
    };

    // =========================
    // UI
    // =========================

    const updateOrderStatus = async (orderId, status) => {
    try {
        await api.put(
            `/admin/orders/${orderId}/status?status=${status}`
        );

        setMessage("Order status updated successfully");

        fetchData();

    } catch (error) {
        setMessage(
            error.response?.data?.detail ||
            "Failed to update order status"
        );
    }
};

    return (
        <div className="admin-dashboard">

            <h2>Admin Dashboard</h2>

            {message && (
                <p>{message}</p>
            )}

            {/* =========================
                CATEGORY MANAGEMENT
            ========================= */}

            <hr />

            <h3>
                {editingCategoryId
                    ? "Edit Category"
                    : "Add Category"}
            </h3>

            <form onSubmit={handleCategorySubmit}>

                <div>
                    <label>Category Name</label>
                    <br />

                    <input
                        type="text"
                        name="name"
                        value={categoryForm.name}
                        onChange={handleCategoryChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Description</label>
                    <br />

                    <textarea
                        name="description"
                        value={categoryForm.description}
                        onChange={handleCategoryChange}
                    />
                </div>

                <br />

                <button type="submit">
                    {editingCategoryId
                        ? "Update Category"
                        : "Add Category"}
                </button>

                {editingCategoryId && (
                    <button
                        type="button"
                        onClick={resetCategoryForm}
                        style={{ marginLeft: "10px" }}
                    >
                        Cancel
                    </button>
                )}

            </form>

            <br />

            <h3>Categories</h3>

            {categories.length === 0 ? (
                <p>No categories found.</p>
            ) : (
                <table border="1" cellPadding="10">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {categories.map((category) => (
                            <tr key={category.id}>

                                <td>{category.id}</td>

                                <td>{category.name}</td>

                                <td>

                                    <button
                                        onClick={() =>
                                            editCategory(category)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteCategory(category.id)
                                        }
                                        style={{
                                            marginLeft: "4px"
                                        }}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            )}

            {/* =========================
                FOOD MANAGEMENT
            ========================= */}

            <hr />

            <h3>
                {editingId
                    ? "Edit Food"
                    : "Add Food"}
            </h3>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Food Name</label>
                    <br />

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Description</label>
                    <br />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Price</label>
                    <br />

                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        // step="0.01"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Category</label>
                    <br />

                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select Category
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="is_available"
                            checked={form.is_available}
                            onChange={handleChange}
                        />

                        {" "}Available
                    </label>
                </div>

                <br />

                <button type="submit">
                    {editingId
                        ? "Update Food"
                        : "Add Food"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={resetForm}
                        style={{ marginLeft: "10px" }}
                    >
                        Cancel
                    </button>
                )}

            </form>

            <hr />

            <h3>Food Items</h3>

            {foods.length === 0 ? (
                <p>No food items found.</p>
            ) : (

                <table border="1" cellPadding="10">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {foods.map((food) => {

                            const category = categories.find(
                                (cat) =>
                                    cat.id === food.category_id
                            );

                            return (
                                <tr key={food.id}>

                                    <td>{food.id}</td>

                                    <td>{food.name}</td>

                                    <td>
                                        ₹{food.price}
                                    </td>

                                    <td>
                                        {category
                                            ? category.name
                                            : "Unknown"}
                                    </td>

                                    <td>
                                        {food.is_available
                                            ? "Yes"
                                            : "No"}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                editFood(food)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteFood(food.id)
                                            }
                                            style={{
                                                marginLeft: "8px"
                                            }}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

            )}

            <div>
                <hr />

<h3>Order Management</h3>

{orders.length === 0 ? (
    <p>No orders found.</p>
) : (
    <table border="1" cellPadding="10">

        <thead>
            <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update Status</th>
            </tr>
        </thead>

        <tbody>

            {orders.map((order) => (
                <tr key={order.id}>

                    <td>
                        #{order.id}
                    </td>

                    <td>
                        {order.user_id}
                    </td>

                    <td>
                        ₹{order.total_amount}
                    </td>

                    <td>
                        {order.status}
                    </td>

                    <td>

                        <select
                            value={order.status}
                            onChange={(e) =>
                                updateOrderStatus(
                                    order.id,
                                    e.target.value
                                )
                            }
                        >
                            <option value="PLACED">
                                PLACED
                            </option>

                            <option value="CONFIRMED">
                                CONFIRMED
                            </option>

                            <option value="PREPARING">
                                PREPARING
                            </option>

                            <option value="OUT_FOR_DELIVERY">
                                OUT FOR DELIVERY
                            </option>

                            <option value="DELIVERED">
                                DELIVERED
                            </option>

                            <option value="CANCELLED">
                                CANCELLED
                            </option>

                        </select>

                    </td>

                </tr>
            ))}

        </tbody>

    </table>
)}
            </div>
            <div>
                <hr />

<h3>Customer Management</h3>

{customers.length === 0 ? (
    <p>No customers found.</p>
) : (
    <table border="1" cellPadding="10">

        <thead>
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Active</th>
                <th>Created At</th>
            </tr>
        </thead>

        <tbody>

            {customers.map((customer) => (
                <tr key={customer.id}>

                    <td>
                        {customer.id}
                    </td>

                    <td>
                        {customer.username}
                    </td>

                    <td>
                        {customer.email}
                    </td>

                    <td>
                        {customer.is_active
                            ? "Yes"
                            : "No"}
                    </td>

                    <td>
                        {customer.created_at
                            ? new Date(
                                customer.created_at
                              ).toLocaleString()
                            : "-"}
                    </td>

                </tr>
            ))}

        </tbody>

    </table>
)}
            </div>

        </div>

        
    );
}

export default Dashboard;