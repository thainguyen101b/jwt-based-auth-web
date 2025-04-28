import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/common/Button";

export const HomePage = () => {
  const { user, isLoading } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Welcome to thainguyen.io
      </h1>

      <p className="text-xl text-center text-gray-600 mb-8">
        A modern, beautiful React application with authentication.
      </p>

      <div className="flex justify-center mt-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : user ? (
          <div className="text-center">
            <p className="text-lg mb-4">
              Welcome back,{" "}
              <span className="font-semibold">{user.username}</span>!
            </p>
            <Button to="/profile" fullWidth>Go to Profile</Button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white border border-blue-600 text-blue-600 py-2 px-6 rounded-md hover:bg-gray-50"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
