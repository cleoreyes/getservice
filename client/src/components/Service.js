import React, { useEffect, useState } from "react";
import moment from "moment";
import "../App.css";
import useUserIdentity from "../utils/Identity.js";
import Review from "./Review.js";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Service = (props) => {
  const {
    serviceId,
    username,
    useremail,
    categories,
    service_name,
    price,
    description,
    date,
    reviews,
    onDelete,
  } = props;

  const [imageSrc, setImageSrc] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const { userIdentity } = useUserIdentity();

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/services/image?id=${serviceId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Image not found");
        }
        return response.blob();
      })
      .then((blob) => {
        if (isMounted) {
          setImageSrc((prev) => {
            if (prev) {
              URL.revokeObjectURL(prev); // Clean up the previous image
            }
            return URL.createObjectURL(blob);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  useEffect(() => {
    fetchProfilePicture(useremail);
  }, [useremail]);

  const fetchProfilePicture = async (userEmail) => {
    if (!userEmail) return;

    try {
      const response = await fetch(
        `/api/users/profilePicture?email=${userEmail}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile picture");
      }

      const blob = await response.blob();
      setProfilePicture(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  const TimeAgo = ({ date }) => {
    return <span>{moment(date).fromNow()}</span>;
  };

  const categoryColors = {
    "Academic & Tutoring": "bg-indigo-400",
    "Beauty & Personal Care": "bg-yellow-400",
    "Tech & Digital": "bg-blue-400",
    "Health & Wellness": "bg-red-400",
    "Creative & Entertainment": "bg-pink-400",
    "Home & Event": "bg-green-400",
    "Miscellaneous & Other": "bg-gray-400",
  };

  let navigate = useNavigate();
  const routeChange = () => {
    navigate(
      `/otherprofile?userName=${encodeURIComponent(username)}&userEmail=${encodeURIComponent(useremail)}`,
    );
  };

  return (
    <div className="flex flex-col bg-white p-5 rounded-lg justify-items-center service drop-shadow-md hover:shadow-xl transition duration-300">
      <div className="flex flex-row items-center justify-between border-b-2 pb-2">
        <div className="flex flex-row items-center">
          {profilePicture ? (
            <button className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={profilePicture}
                alt="Profile"
                className="object-cover w-full h-full"
                onClick={routeChange}
              />
            </button>
          ) : (
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src="https://github.com/user-attachments/assets/08522b1f-bdec-4656-aac5-734c3bae1a56"
                alt="Default Profile"
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="pl-2">
            <button>
              <h2
                className="text-lg hover:text-gray-500 hover:underline"
                onClick={routeChange}
              >
                {username}
              </h2>
            </button>
            <p className="text-sm">
              <TimeAgo date={new Date(date)} />
            </p>
          </div>
        </div>
        {userIdentity === useremail ? (
          <button
            onClick={() => onDelete(serviceId)}
            className="flex flex-row mt-4 hover:bg-red-700 hover:text-white text-gray-400 p-2 rounded-lg absolute top-0 right-5 transition duration-300"
          >
            <FaRegTrashCan className="text-lg" />
          </button>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col pt-4 gap-5">
        <div className="text-base">
          <div className="flex flex-row justify-between text-left text-2xl">
            <strong>{service_name}</strong>
            <p>${price}</p>
          </div>
          <div className="flex flex-wrap py-3 text-sm">
            {categories &&
              categories.map((category, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs text-white ${categoryColors[category]} mr-2`}
                >
                  {category}
                </span>
              ))}
          </div>
          <p>{description}</p>
        </div>
        <div className="flex items-center justify-center">
          <img
            src={imageSrc}
            alt={service_name}
            className="w-64 border-slate-500 border"
          />
        </div>
      </div>

      <Review
        userIdentity={userIdentity}
        reviews={reviews}
        service_name={service_name}
      />
    </div>
  );
};

export default Service;
