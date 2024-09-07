import localFont from "next/font/local";
import "./globals.css";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <div id="root"></div>
        {children}
      </body>
    </html>
  );
}
