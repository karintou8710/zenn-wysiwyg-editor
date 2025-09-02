import { useEffect } from "react";
import ReactGA from "react-ga4";

const usePageTracking = () => {
  useEffect(() => {
    const G_TAG = import.meta.env.VITE_G_TAG;
    if (!G_TAG) return; // ローカルでは起動しない

    ReactGA.initialize(G_TAG);
    ReactGA.send({
      hitType: "pageview",
      page: "/",
    });
  }, []);
};

export default usePageTracking;
