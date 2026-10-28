import { capsule, endpoint, text } from "lakebed/server";
export default capsule({
  name: "Neo Geo Bootstrap",
  auth: { requireSignIn: false },
  schema: {},
  endpoints: {
    status: endpoint({ method: "GET", path: "/api/status" }, () => text("neo-geo-bootstrap · Bootstrap 6.0.0-alpha.1")),
  },
});
