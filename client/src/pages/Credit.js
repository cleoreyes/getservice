import React from "react";
import { FaLinkedin } from "react-icons/fa6";

const developers = [
  {
    name: "Cleo Reyes",
    linkedin: "https://www.linkedin.com/in/cleoreyes/",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQFRu4Di2azH0A/profile-displayphoto-shrink_800_800/B56ZSSQN7fHsAc-/0/1737620512873?e=1747267200&v=beta&t=r-55m6TvE9dOQ05eouetoJIoNYzFKpnnmFnA4kF-SpY",
  },
  {
    name: "Ella Kim",
    linkedin: "https://www.linkedin.com/in/ellakim913/",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQEJtRCRxy8yGw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1695682301846?e=1747267200&v=beta&t=FdKvo1JTT5vSYR2jIGZraHqQS_vRArPIoJJa1BBfEfY",
  },
  {
    name: "Devanshi Desai",
    linkedin: "https://www.linkedin.com/in/arushiagarwal1/",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQGLk2sbXqh9RQ/profile-displayphoto-shrink_800_800/B56ZQU2sbxGQAg-/0/1735516670028?e=1747267200&v=beta&t=jjb_Nf7FTHjMLG_M31pN6y21Ka-j4LOD9GRUetdQQxw",
  },
  {
    name: "Arushi Agarwal",
    linkedin: "https://www.linkedin.com/in/devanshidesai25/",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQFfkeFTA0AzHw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731875783584?e=1747267200&v=beta&t=9aFD-UHS9jVB5XZtScM-gREzHjHYcqkUL5QnJsqD_do",
  },
];

const Credit = () => {
  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1
        className="text-5xl font-bold mb-8 w-full text-center"
        style={{
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "inline-block",
        }}
      >
        Meet the Developers
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {developers.map((developer, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md"
          >
            <img
              src={developer.image}
              alt={developer.name}
              className="w-32 h-32 rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{developer.name}</h2>
            <a
              href={developer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mt-2 flex flex-row items-center gap-1 text-2xl"
            >
              <FaLinkedin />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credit;
