import { Link } from "react-router";
import { TOKEN_KEY, useAuth } from "../../contexts/AuthContext";
import { Button } from "../common/Button";

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
              <Button outline to="/profile">
                Profile
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  localStorage.removeItem(TOKEN_KEY);
                  window.location.href = "/login";
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button outline to="/login">
                Login
              </Button>
              <Button to="/signup">Sign up</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
