import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddService(props) {
  const navigateTo = useNavigate();

  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [priceText, setPriceText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [error, setError] = useState("");

  const categories = [
    "Academic & Tutoring",
    "Beauty & Personal Care",
    "Tech & Digital",
    "Health & Wellness",
    "Creative & Entertainment",
    "Home & Event",
    "Miscellaneous & Other",
  ];

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;

    setSelectedCategories((prev) =>
      checked
        ? [...prev, value]
        : prev.filter((category) => category !== value),
    );
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (priceText <= 0) {
      setError("Please enter a valid price");
      return;
    }

    if (selectedCategories.length === 0) {
      setError("You must select at least one category.");
      return;
    }

    // set up the data to POST
    const formData = new FormData();
    formData.append("title", titleText);
    formData.append("description", descriptionText);
    formData.append("price", Number(priceText));
    selectedCategories.forEach((category) =>
      formData.append("categories", category),
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();

      navigateTo("/home"); // Redirect to home on success
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  // username: String,
  // profile_picture: String,
  // title: String,
  // description: String,
  // price: Number,
  // created_at: String,
  // catergories: [String],
  // image: String
  return (
    <div className="flex flex-col justify-center items-center min-h-screen mx-96">
      {/* Gradient Title */}
      <h1
        className="text-5xl font-bold mb-4 w-full text-center"
        style={{
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "inline-block",
        }}
      >
        Add Your Service
      </h1>

      <div className="flex flex-col bg-white px-24 py-12 rounded-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Title"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              required
              className="border w-full py-2 rounded-md pl-3"
            />
            <textarea
              placeholder="Description"
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              required
              className="border w-full py-2 rounded-md pl-3 h-28"
            />
            <input
              type="number"
              placeholder="Price"
              value={priceText}
              onChange={(e) => setPriceText(e.target.value)}
              required
              className="border w-full py-2 rounded-md pl-3"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Categories:</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <label key={index} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={handleCategoryChange}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border w-full py-2 rounded-md pl-3"
              required
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md mt-4"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}
