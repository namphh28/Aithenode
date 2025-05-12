import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">EduConnect</h3>
            <p className="text-gray-400 mb-4">Connecting learners with expert educators for personalized learning experiences.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">For Students</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/find-educators">
                  <a className="text-gray-400 hover:text-white">Find an Educator</a>
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works">
                  <a className="text-gray-400 hover:text-white">How It Works</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Pricing</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">FAQs</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">For Educators</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/signup">
                  <a className="text-gray-400 hover:text-white">Apply as an Educator</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Teacher Resources</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Success Stories</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Educator Support</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} EduConnect. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
