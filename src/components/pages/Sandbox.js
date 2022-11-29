import { useEffect, useState } from "react";
import Loader from "../graphics/Loader";

export default function Sandbox() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 9999);
  });
  return (
    <div id="sandbox" className="flex col center">
      <Loader isLoading={isLoading} />
    </div>
  );
}
