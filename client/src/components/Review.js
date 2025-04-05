import React, { useState } from "react";
import moment from "moment";
import { FaRegTrashCan } from "react-icons/fa6";

import "../App.css";

export default function Review(props) {
  const [newReview, setNewReview] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { userIdentity, service_name, reviews } = props;

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!userIdentity) {
      alert("You must be logged in to leave a review.");
      return;
    }

    const username = userIdentity;
    const review = newReview;

    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        newReview: review,
        serviceName: service_name,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setNewReview("");
          alert("Review submitted successfully!");
          fetch(`/api/reviews?serviceName=${service_name}`)
            .then((response) => response.json())
            .then((reviews) => window.location.reload())
            .catch((error) =>
              console.error("Error fetching reviews after submission:", error),
            );
        } else {
          alert(data.error || "Failed to submit review.");
        }
      })
      .catch((err) => console.error("Error submitting review:", err));
  };

  const TimeAgo = ({ date }) => {
    return <span>{moment(date).fromNow()}</span>;
  };

  const toggleReviews = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      window.location.reload();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <>
      {/* Reviews Section */}
      <div className="reviews-section mt-4">
        <h3 className="text-sm font-medium">Reviews</h3>
        <button
          onClick={toggleReviews}
          className="mt-2 text-gray-600 border-t-2 p-2 rounded-lg w-full hover:bg-slate-200 transition duration-300"
        >
          {isExpanded ? "Hide Reviews" : "Show Reviews"}
        </button>
        {isExpanded && (
          <>
            {reviews && reviews.length > 0 ? (
              <ul className="text-sm">
                {reviews.map((review, index) => (
                  <li key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
                    <div className="flex flex-row justify-between">
                      <strong>{review.username}</strong>
                      {userIdentity === review.useremail ? (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="flex flex-row mt-4 hover:bg-red-700 hover:text-white text-gray-400 p-2 rounded-lg  transition duration-300 absolute top-50 right-10"
                        >
                          <FaRegTrashCan className="text-lg" />
                        </button>
                      ) : (
                        // <>this is your review</>
                        <></>
                      )}
                    </div>
                    <p>{review.review}</p>
                    <TimeAgo date={review.created_date} />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet. Be the first to leave a review!</p>
            )}
            {/* Review Form */}
            {userIdentity ? (
              <div className="mt-4">
                <h4 className="text-sm">Leave a Review</h4>
                <form onSubmit={handleReviewSubmit}>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Write your review..."
                    rows="1"
                    className="w-full p-2 border rounded-lg"
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white p-2 rounded-lg"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            ) : (
              <p>Please log in to leave a review.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
