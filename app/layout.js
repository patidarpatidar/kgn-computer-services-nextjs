import "./globals.css";
import { StoreProvider } from "../components/StoreProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

export const metadata = {
  title: "New K.G.N Computer Neemuch | Computer Repair Service",
  description: "Contact New K.G.N Computer Neemuch for computer repair service at Dhaniram Sagar Complex, Neemuch, Madhya Pradesh."
};
export default function RootLayout({children}) {
 return <html lang="en"><body><StoreProvider><Header/><main>{children}</main><Footer/><WhatsAppFloat/></StoreProvider></body></html>;
}
