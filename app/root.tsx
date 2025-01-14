import type { LinksFunction, MetaFunction, LoaderFunction } from 'remix';
import {
  Form,
  Meta,
  Links,
  Scripts,
  useLoaderData,
  LiveReload,
  useCatch,
  Outlet,
  Link,
  ScrollRestoration,
  json,
} from 'remix';
import SearchForm from '~/components/SearchForm';
import { categories, platforms } from '~/meta';
import stylesUrl from '~/styles/tailwind.css';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Guide',
    description: 'An interactive list of awesome stuffs about Remix',
    viewport: 'width=device-width, initial-scale=1',
  };
};

export let loader: LoaderFunction = async ({ context }) => {
  const { languages } = await context.query('meta', 'data');
  const user = await context.auth.isAuthenticated();

  return json(
    {
      versions: [],
      categories,
      languages,
      platforms,
      user,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
};

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="dark:bg-black dark:text-gray-200">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  let { categories, platforms, languages, versions, user } = useLoaderData();

  return (
    <Document>
      <div className="min-h-screen flex flex-col">
        <header className="px-4 sm:px-16 h-12 sticky top-0 z-40 bg-white dark:bg-black border-b dark:bod dark:border-b-gray-600 flex flex-row items-center text-xs md:text-base shadow-sm">
          <Link
            className="whitespace-nowrap -mx-4 px-4 z-40 dark:text-white"
            to="/"
            prefetch="intent"
          >
            Remix Guide
          </Link>
          <div className="flex flex-grow">
            <SearchForm
              categories={categories}
              platforms={platforms}
              versions={versions}
              languages={languages}
            />
          </div>
          {process.env.NODE_ENV === 'production' ? null : (
            <div className="ml-2">
              {user ? (
                <Form action="/logout" method="post" reloadDocument>
                  <button>Logout</button>
                </Form>
              ) : (
                <Form action="/login" method="post" reloadDocument>
                  <button>Login</button>
                </Form>
              )}
            </div>
          )}
        </header>
        <main className="flex-grow p-4 sm:p-8">
          <Outlet />
        </main>
        <footer className="flex flex-col sm:flex-row justify-between sm:px-16 p-4 text-sm text-center sm:text-left gap-12">
          <p>
            Wanna share something? Submit it{' '}
            <Link className="underline" to="submit">
              here
            </Link>
          </p>
          <p className="flex items-center justify-center">
            <div>
              Made with{' '}
              <a
                className="hover:underline"
                href="https://remix.run"
                target="_blank"
                rel="noopener noreferrer"
              >
                Remix
              </a>{' '}
              by{' '}
              <a
                className="hover:underline"
                href="https://github.com/edmundhung"
                target="_blank"
                rel="noopener noreferrer"
              >
                Edmund Hung
              </a>
            </div>
            <a
              className="ml-2 inline-block text-gray-600 hover:text-black dark:hover:text-white transition-colors"
              href="https://github.com/edmundhung/remix-guide"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">GitHub</span>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="github"
                className="w-4 h-4"
                role="img"
                viewBox="0 0 496 512"
              >
                <path
                  fill="currentColor"
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                ></path>
              </svg>
            </a>
          </p>
        </footer>
      </div>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 404:
      return (
        <Document title={`${caught.status} ${caught.statusText}`}>
          <div className="min-h-screen py-4 flex flex-col justify-center items-center">
            <h1>
              {caught.status} {caught.statusText}
            </h1>
          </div>
        </Document>
      );

    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`
      );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Uh-oh!">
      <div className="min-h-screen py-4 flex flex-col justify-center items-center">
        <h1>Sorry, something went wrong...</h1>
      </div>
    </Document>
  );
}
