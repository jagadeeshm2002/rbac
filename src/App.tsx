// src/App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/index";
import Providers from "./config/Provider";

const App = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
};

export default App;
