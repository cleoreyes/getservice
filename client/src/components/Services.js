import React, { useEffect, useState } from "react";
import "../App.css";
import Service from "./Service.js";

// take userIdentitiy as optional,
// under profile, it takes identity and show user's service
// under honepage, it shows all the services
function Services({ userIdentity }) {
  const [backendData, setBackendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsData, setReviewsData] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [selectedCategory, setSelectedCategory] = useState(""); // State to store the selected category

  const url = userIdentity
    ? `/api/services?useremail=${encodeURIComponent(userIdentity)}`
    : "/api/services";

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setBackendData(data);
        setLoading(false);
        fetchReviews(data.services);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  const fetchReviews = async (services) => {
    const promises = services.map((service) =>
      fetch(`/api/reviews?serviceName=${service.title}`)
        .then((response) => response.json())
        .then((reviews) => ({ serviceId: service._id, reviews })),
    );

    const results = await Promise.all(promises);
    const reviewsData = results.reduce(
      (acc, { serviceId, reviews }) => ({ ...acc, [serviceId]: reviews }),
      {},
    );
    setReviewsData(reviewsData);
  };

  const handleDeleteService = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setBackendData((prevData) => ({
        ...prevData,
        services: prevData.services.filter(
          (service) => service._id !== serviceId,
        ),
      }));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  // Filter services based on the search query and selected category
  const filteredServices = backendData.services?.filter((service) => {
    const matchesSearchQuery = service.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || service.categories.includes(selectedCategory);
    return matchesSearchQuery && matchesCategory;
  });

  return (
    <div>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-row w-full gap-5">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 p-2 border text-sm rounded-full w-4/5"
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mb-4 p-2 border text-sm rounded-xl"
          >
            <option value="">All Categories</option>
            <option value="Academic & Tutoring">Academic & Tutoring</option>
            <option value="Beauty & Personal Care">
              Beauty & Personal Care
            </option>
            <option value="Tech & Digital">Tech & Digital</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Creative & Entertainment">
              Creative & Entertainment
            </option>
            <option value="Home & Event">Home & Event</option>
            <option value="Miscellaneous & Other">Miscellaneous & Other</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <ul className="flex flex-col-reverse gap-8 items-center justify-center w-full">
            {filteredServices.map((service, index) => (
              <li key={index} className="w-full flex justify-center">
                <Service
                  serviceId={service._id}
                  profile_picture={service.profile_picture}
                  username={service.username}
                  useremail={service.useremail}
                  categories={service.categories}
                  service_name={service.title}
                  price={service.price}
                  description={service.description}
                  date={service.created_at}
                  reviews={reviewsData[service._id] || []}
                  onDelete={handleDeleteService}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Services;
