import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Menu,
  X,
  Heart,
  Shield,
  Award,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchData, setSearchData] = useState({
    Event: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
  });

  const featuredEvents = [
    {
      name: "Goa",
      properties: 245,
      image:
        "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Beach paradise with luxury resorts",
    },
    {
      name: "Manali",
      properties: 156,
      image:
        "https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Mountain retreats and hill stations",
    },
    {
      name: "Udaipur",
      properties: 89,
      image:
        "https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Royal palaces and lake views",
    },
    {
      name: "Kerala",
      properties: 198,
      image:
        "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Backwaters and tropical escapes",
    },
  ];

  const featuredProperties = [
    {
      id: 1,
      name: "Luxury Beachside Villa",
      location: "Goa, India",
      image:
        "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 8500,
      rating: 4.8,
      reviews: 124,
      amenities: ["Private Pool", "Beach Access", "WiFi", "AC"],
    },
    {
      id: 2,
      name: "Mountain View Resort",
      location: "Manali, Himachal Pradesh",
      image:
        "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 7200,
      rating: 4.9,
      reviews: 89,
      amenities: ["Mountain View", "Spa", "Restaurant", "Fireplace"],
    },
    {
      id: 3,
      name: "Royal Heritage Hotel",
      location: "Udaipur, Rajasthan",
      image:
        "https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 12500,
      rating: 4.7,
      reviews: 156,
      amenities: ["Palace View", "Pool", "Heritage", "Luxury"],
    },
    {
      id: 4,
      name: "Backwater Retreat",
      location: "Alleppey, Kerala",
      image:
        "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 6800,
      rating: 4.6,
      reviews: 92,
      amenities: ["Backwater View", "Boat Ride", "Ayurveda", "Nature"],
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchData);
  };

  return (
    <div className="min-h-screen bg-white">
      //{/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">ECR</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ECR Beach Resorts
                </h1>
                <p className="text-xs text-gray-600">Your Perfect Getaway</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#Events"
                className="text-gray-700 hover:text-orange-600 font-medium"
              >
                Events
              </a>
              <a
                href="#properties"
                className="text-gray-700 hover:text-orange-600 font-medium"
              >
                Properties
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-orange-600 font-medium"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-orange-600 font-medium"
              >
                Contact
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-orange-600 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a
                  href="#Events"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                >
                  Events
                </a>
                <a
                  href="#properties"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                >
                  Properties
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                >
                  Contact
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-left text-gray-700 hover:text-orange-600 font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                {" "}
                Getaway
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing hotels, resorts, and vacation rentals for your
              next adventure. From luxury beachside villas to cozy mountain
              retreats.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Events
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchData.Event}
                      onChange={(e) =>
                        setSearchData((prev) => ({
                          ...prev,
                          Event: e.target.value,
                        }))
                      }
                      placeholder="Select an event?"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={searchData.checkIn}
                      onChange={(e) =>
                        setSearchData((prev) => ({
                          ...prev,
                          checkIn: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={searchData.checkOut}
                      onChange={(e) =>
                        setSearchData((prev) => ({
                          ...prev,
                          checkOut: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={searchData.guests}
                      onChange={(e) =>
                        setSearchData((prev) => ({
                          ...prev,
                          guests: parseInt(e.target.value),
                        }))
                      }
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section id="Events" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Events
            </h2>
            <p className="text-xl text-gray-600">
              Explore our perfect places to celebrate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((Event, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={Event.image}
                    alt={Event.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{Event.name}</h3>
                    <p className="text-sm opacity-90">
                      {Event.properties} properties
                    </p>
                    <p className="text-xs opacity-75">{Event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked accommodations for unforgettable experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                  </button>
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Available
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {property.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {property.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {property.amenities.slice(0, 2).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{property.amenities.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{property.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600"> /night</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {property.reviews} reviews
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the best of hospitality with our carefully curated
              properties and unmatched services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <Shield className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Secure Booking
              </h3>
              <p className="text-gray-600">
                Book with confidence knowing your reservations are protected and
                secure
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <Award className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Best Price Guarantee
              </h3>
              <p className="text-gray-600">
                We ensure you get the best deals and value for your money
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <Globe className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Global Network
              </h3>
              <p className="text-gray-600">
                Access to exclusive properties across India and around the world
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                ECR Beach Resorts
              </h3>
              <p className="text-gray-400">
                Your trusted partner for unforgettable vacations
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#destinations" className="hover:text-white">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#properties" className="hover:text-white">
                    Properties
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>Email: info@ecrresorts.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Chennai, Tamil Nadu</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Create your own account to get special offers and updates
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 rounded-l-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500"
                />
                <button className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 ECR Beach Resorts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
