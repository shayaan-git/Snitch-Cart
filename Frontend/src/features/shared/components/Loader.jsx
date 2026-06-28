import { Hatch } from "ldrs/react";
import "ldrs/react/Hatch.css";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Hatch size="28" stroke="4" speed="3.5" color="#C4A96B" />
    </div>
  );
};

export default Loader;
