import { Link } from "react-router";
import { TOKEN_KEY, useAuth } from "../../contexts/AuthContext";

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          thainguyen.io
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                Profile
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem(TOKEN_KEY);
                  window.location.href = "/login";
                }}
                className="text-gray-700 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
