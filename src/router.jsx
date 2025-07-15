import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home/Home";
import Authentication from "./pages/Security-mechanisms/Authentication";
import Authorization from "./pages/Security-mechanisms/Authorization";
import CORS from "./pages/Security-mechanisms/CORS";
import DataProtection from "./pages/Security-mechanisms/DataProtection";
import SecretsManagement from "./pages/Security-mechanisms/SecretsManagement";
import HtmlEncoder from "./pages/Security-mechanisms/HTMLEncoder";
import HTTPS from "./pages/Security-mechanisms/HTTPS";
import AntiForgeryTokens from "./pages/Security-mechanisms/AntiForgeryTokens";
import Appendices from "./pages/Appendices/Appendices";
import RecommendedResources from "./pages/RecommendedResources/RecommendedResources";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "authentication",
        element: <Authentication />,
      },
      {
        path: "authorization",
        element: <Authorization />,
      },
      {
        path: "cors",
        element: <CORS />,
      },
      {
        path: "data-protection",
        element: <DataProtection />,
      },
      {
        path: "secrets-management",
        element: <SecretsManagement />,
      },
      {
        path: "html-encoder",
        element: <HtmlEncoder />,
      },
      {
        path: "https",
        element: <HTTPS />,
      },
      {
        path: "anti-forgery-tokens",
        element: <AntiForgeryTokens />,
      },
      {
        path: "glossary",
        element: <Appendices />,
      },
      {
        path: "recommended-resources",
        element: <RecommendedResources />,
      },
    ],
  },
]);

export default router;
