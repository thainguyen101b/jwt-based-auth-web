export const Footer = () => {
    return (
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg font-bold text-gray-800">nguyen.io</h2>
              <p className="text-sm text-gray-600">Welcome to thainguyen.io</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                About
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Contact
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Terms
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} thainguyen.io. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };