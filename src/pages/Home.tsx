import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="home bg-gray-100 min-h-screen py-10 text-gray-700">
      <div className="bg-white shadow rounded-lg w-10/12 mx-auto p-10">
        <h1 className="text-2xl text-blue-500 font-bold text-center pb-5">
          Journyz Assessment Data
        </h1>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
