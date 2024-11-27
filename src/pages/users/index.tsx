
import { 
  Shield, 
  CloudCog, 
  Monitor, 
  Lock, 
  BarChart, 
  Globe, 
  Code, 
  CheckCircle 
} from 'lucide-react';

const UserPage = () => {
  const services = [
    {
      icon: <Code className="w-12 h-12 text-blue-500" />,
      title: "AI-Dependent VAPT",
      description: "Comprehensive Vulnerability Assessment and Penetration Testing leveraging artificial intelligence."
    },
    {
      icon: <CloudCog className="w-12 h-12 text-green-500" />,
      title: "Cloud Infrastructure VAPT",
      description: "Secure cloud environments with robust defense mechanisms for sensitive data and applications."
    },
    {
      icon: <Monitor className="w-12 h-12 text-purple-500" />,
      title: "Threat Monitoring & SOC",
      description: "24/7 threat monitoring, incident response, and real-time analytics against evolving cyber threats."
    },
    {
      icon: <Lock className="w-12 h-12 text-red-500" />,
      title: "Infrastructure VAPT",
      description: "Tailored security strategies to protect complex enterprise infrastructure and prevent breaches."
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 text-blue-900 dark:text-white">
              VRV Security: Redefining Cybersecurity
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              AI-driven cybersecurity solutions protecting digital assets globally since 2020.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#services" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Our Services
              </a>
              <a 
                href="#contact" 
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <Shield className="w-64 h-64 text-blue-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Globe className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-3xl font-bold text-blue-900 dark:text-white">12+</h3>
              <p className="text-gray-600 dark:text-gray-300">Countries</p>
            </div>
            <div>
              <BarChart className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-3xl font-bold text-blue-900 dark:text-white">$400M</h3>
              <p className="text-gray-600 dark:text-gray-300">Company Valuation</p>
            </div>
            <div>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-3xl font-bold text-blue-900 dark:text-white">200+</h3>
              <p className="text-gray-600 dark:text-gray-300">International Clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-blue-900 dark:text-white">
            Our Cybersecurity Solutions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-blue-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-blue-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-900 dark:text-white">
            Our Mission
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-700 dark:text-gray-300">
              At VRV Security, we aim to redefine cybersecurity by delivering adaptive, AI-driven solutions that anticipate and mitigate threats before they materialize. Our commitment to innovation has earned us a 95% client retention rate, setting the gold standard in proactive threat management.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">VRV Security</h4>
            <p className="text-gray-400">Founded in Chennai, Tamil Nadu</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Contact</h4>
            <p className="text-gray-400">Email: info@vrvsecurity.com</p>
            <p className="text-gray-400">Phone: +91 123 456 7890</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserPage;