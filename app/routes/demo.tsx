import type { MetaFunction, LoaderFunction, HeadersFunction } from "@remix-run/node";
import { useRouteError, isRouteErrorResponse } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Authentication Demo" },
    { name: "description", content: "Welcome to the Secret Page" },
  ];
};

function fail() {
  return new Response(null, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Page", charset="UTF-8"',
    },
  });
}

export const headers: HeadersFunction = ({
  errorHeaders,
}) => {
  if (errorHeaders) return errorHeaders;
  else return {};
};

export const loader: LoaderFunction = ({
  request,
}) => {
  const auth = request.headers.get("Authorization");
  const [scheme, credentials] = (auth || "").split(" ");

  try {
    const [username, password] = atob(credentials).split(":");

    if (!auth || scheme !== "Basic") {
      throw fail();
    }
    else if (username !== import.meta.env.VITE_USERNAME || password !== import.meta.env.VITE_PASSWORD) {
      throw fail();
    }

    else return {};
  }

  catch (e) {
    throw fail();
  }
};

export default function Index() {
  return <>
    <h1>
      Hello!
    </h1>
    <p>
      If you see this, you have pass the authentication.
    </p>
  </>;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        Something went wrong: {error.status}{" "}
        {error.statusText}
      </div>
    );
  }

  else return (
    <div>
      Something went wrong:{" "}
      {error?.message || "Unknown Error"}
    </div>
  );
}
