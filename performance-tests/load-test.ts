import http from "k6/http";
import { check, sleep } from "k6";

interface Property {
  id: number;
}

export const options = {
  stages: [
    { duration: "5s", target: 15 },
    { duration: "5", target: 15 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get("http://backend:8000/api/property/");
  check(res, {
    "retrieved property list": (r) => r.status === 200,
  });

  try {
    const properties = res.json() as Property[];
    if (properties && properties.length > 0) {
      const randomProperty =
        properties[Math.floor(Math.random() * properties.length)];

      sleep(Math.random() * 3 + 1);

      const detailRes = http.get(
        `http://backend:8000/api/property/${randomProperty.id}/`
      );
      check(detailRes, {
        "retrieved single property": (r) => r.status === 200,
      });
    }
  } catch (e) {
    console.log(`Failed to parse property list: ${e}`);
  }

  sleep(1);
}
