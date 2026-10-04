import {Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/customer/Home";

import Menu from "../pages/customer/Menu";
import Cart from "../pages/customer/Cart";
import MyOrders from "../pages/customer/MyOrder";
import Dashboard from "../pages/admin/Dashboard";

// function Home() {
//   return (
//     <div>
//       <h1>Home Page</h1>
//     </div>
//   );
// }

// // function Login() {
// //   return (
// //     <div>
// //       <Login />
// //     </div>
// //   );
// // }

// function Register() {
//   return (
//     <div>
//       <h1>Register Page</h1>
//     </div>
//   );
// }

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/my-orders" element={<MyOrders/>} />
        <Route path="/admin" element={<Dashboard/>} />
      </Routes>
  );
}

export default AppRoutes;