import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="admin-shell">
      <div className="card center">
        <h1>Page not found</h1>
        <p>The route you requested does not exist.</p>
        <Link to="/">Go to home</Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
