import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div id="unauthorized">
      <h1>Unauthorized</h1>
      <p>You do not have access to this content.</p>
      <button className="flex center" onClick={goBack}>
        Back
      </button>
    </div>
  );
}
