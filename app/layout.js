import "./globals.css";
import { StoreProvider } from "../components/StoreProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

export const metadata = {
  title: "KGN Computer and Services | Neemuch",
  description: "Computers, accessories, repairs and technical support in Neemuch, Madhya Pradesh."
};
export default function RootLayout({children}) {
 return <html lang="en"><body><StoreProvider><Header/><main>{children}</main><Footer/><WhatsAppFloat/></StoreProvider></body></html>;
}
