import Services from "../components/Services";
import "../App.css";

export default function HomePage(props) {
  return (
    <div className="flex flex-col justify-center items-center mt-0 pt-4">
      {/* Gradient Title */}
      <h1
        className="text-5xl font-bold mb-4 w-full text-center"
        style={{
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Posts Feed
      </h1>
      <Services />
    </div>
  );
}
