import { Navigation } from "../components/nav";
import { fetchWeb3eventMap, fetchEvents } from "../api/fetchdata";
import MapView from "./mapView";

export default async function MapPage() {
  const web3eventMap = await fetchWeb3eventMap();
  const events = await fetchEvents();
  console.log(events, "=================events length==============");

  return (
    <div className=" bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Navigation />
      <MapView web3eventMap={events} />
    </div>
  );
}
