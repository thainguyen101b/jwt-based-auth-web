import { useNavigate } from "react-router";
import { TOKEN_KEY, useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { Button } from "./common/Button";

export const Profile = () => {
  const { user, isLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Profile
      </h2>

      <div className="flex flex-col items-center mb-6">
        {user.image ? (
          <img
            src={user.image}
            alt={user.username}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-gray-500">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <div className="border-t pt-4">
        <Button
          onClick={() => {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = "/login";
          }}
          variant="danger"
          fullWidth
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
