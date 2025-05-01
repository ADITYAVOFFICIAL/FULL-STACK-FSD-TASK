
import { Navigate } from "react-router-dom";

// This component simply redirects to the home page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
