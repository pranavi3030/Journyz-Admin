import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Departments from "./pages/Departments";
import Companies from "./pages/Companies";
import OpAreas from "./pages/OpAreas";
import OpAreaDetails from "./pages/OpAreaDetails";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Home />}>
        <Route index element={<Companies />} />
        <Route path="/company/:companyId" element={<Departments />} />
        <Route
          path="/company/:companyId/department/:departmentId"
          element={<OpAreas />}
        />
        <Route
          path="/company/:companyId/department/:departmentId/opArea/:opAreaId"
          element={<OpAreaDetails />}
        />
      </Route>
    )
  );

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
