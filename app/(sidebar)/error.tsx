"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="card error-state"><h1>We couldn’t load this page</h1><p>Please check the database connection and try again.</p><button className="primary" onClick={reset}>Try again</button></section>;
}
