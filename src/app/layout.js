import './globals.css'; // Import global CSS

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <header className="bg-gray-800 text-white py-4">
          {/* Add your header content here */}
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* This is where the content for this category will be rendered */}
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-4 mt-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">&copy; 2024 Your Store. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
