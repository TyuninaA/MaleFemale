import Document, { Html, Head, Main, NextScript } from 'next/document';
import Link from 'next/link';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <style>
            {`
              .dropdown-menu {
                display: none;
                position: absolute;
                background-color: white;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 8px 0;
                width: 200px;
                z-index: 1;
              }

              .dropdown-menu a {
                display: block;
                padding: 8px 16px;
                color: #333;
                text-decoration: none;
                transition: background-color 0.3s;
              }

              .dropdown-menu a:hover {
                background-color: #f2f2f2;
              }

              .dropdown:hover .dropdown-menu {
                display: block;
              }

              header {
                background-color: #333;
                color: #fff;
                padding: 10px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }

              header h1 {
                margin: 0;
                font-size: 24px;
              }

              nav ul {
                display: flex;
                list-style-type: none;
              }

              nav ul li {
                margin-right: 20px;
                position: relative;
              }

              nav ul li:hover .dropdown-menu {
                display: block;
              }

              footer {
                text-align: right;
                padding: 20px;
                background-color: #333;
                color: #fff;
                width: 100%;
              }
            `}
          </style>
        </Head>
        <body>
          <header>
            <nav>
              <ul>
                <li className="dropdown">
                  <a href="#">Другие графики</a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link href="/">Население Казахстана</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
            <h1>PDM | Power BI</h1>
          </header>
          <Main />
          <NextScript />
          <footer>
            Made by PDM, KazGU
          </footer>
        </body>
      </Html>
    );
  }
}
