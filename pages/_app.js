import "../styles/globals.css";
import { RobinhoodProvider } from "../context/RobinhoodContext";
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }) {
    return (
        
        <MoralisProvider
            serverUrl={`${process.env.MORALIS_SERVER_URL}`}
            appId="ZvbMuJ6mmveXfHfrmh4RCMW6pFxjYmEHGfBxwcAI"
        >
            <RobinhoodProvider>
                <Component {...pageProps} />
            </RobinhoodProvider>
        </MoralisProvider>
    );
}

export default MyApp;
