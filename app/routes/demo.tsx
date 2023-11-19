import type { MetaFunction, LoaderFunction, HeadersFunction } from "@remix-run/node";
import { useRouteError, isRouteErrorResponse } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Authentication Demo" },
    { name: "description", content: "Welcome to the Secret Page" },
  ];
};

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
  if (!auth) throw new Response(null, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Page", charset="UTF-8"',
    },
  });

  const [scheme, credentials] = (auth).split(" ");

  try {
    if (!credentials || scheme !== "Basic") throw new Error();
    const [username, password] = atob(credentials).split(":");

    if (username !== import.meta.env.VITE_USERNAME || password !== import.meta.env.VITE_PASSWORD) {
      throw new Response(null, {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Page", charset="UTF-8"',
        },
      });
    }

    else return {};
  }

  catch (e) {
    if (e instanceof Error) throw new Response(null, {
      status: 400,
    });

    else throw e;
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
