import { Hatch } from "ldrs/react";
import "ldrs/react/Hatch.css";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#FAF8F5]">
      <Hatch size="28" stroke="4" speed="3.5" color="#C4A96B" />
    </div>
  );
};

export default Loader;
