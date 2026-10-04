import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/navbar";

function  App() {
  return (
    <>
      <Navbar />
      {/* <div>
        <h1>Food ordering </h1>
      </div> */}
      <AppRoutes />
    </>
  );
}

export default App;