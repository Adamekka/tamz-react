import React, { FormEvent, useEffect, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonToolbar,
} from "@ionic/react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import SavedPlaces, { SavedPlace } from "../components/SavedPlaces";
import "./Home.css";

type ActiveTab = "form" | "map";
type Position = [number, number];

interface NominatimSearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

// CRA fingerprints image imports, so Leaflet needs explicit marker asset URLs.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapClickSelectorProps {
  onSelectPosition: (position: Position) => void;
}

const MapClickSelector: React.FC<MapClickSelectorProps> = ({
  onSelectPosition,
}) => {
  useMapEvents({
    click: (event) => {
      onSelectPosition([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
};

interface MapFocusProps {
  position: Position;
}

const MapFocus: React.FC<MapFocusProps> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    // MapContainer only applies center on mount; keep it synced with list/map selection.
    map.setView(position, Math.max(map.getZoom(), 13), { animate: true });
  }, [map, position]);

  return null;
};

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("form");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaceName, setSelectedPlaceName] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<Position>([
    49.8209, 18.2625,
  ]);
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const searchMap = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length === 0) {
      setSearchMessage("Enter a place or address to search.");
      return;
    }

    setIsSearching(true);
    setSearchMessage("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
          trimmedQuery,
        )}`,
      );

      if (!response.ok) {
        setSearchMessage("Search failed. Please try again.");
        return;
      }

      const results = (await response.json()) as NominatimSearchResult[];
      const result = results[0];
      if (!result) {
        setSearchMessage("No results found.");
        return;
      }

      const latitude = Number(result.lat);
      const longitude = Number(result.lon);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        setSearchMessage("Search result coordinates are unavailable.");
        return;
      }

      setSelectedPosition([latitude, longitude]);
      setSelectedPlaceName(result.display_name);
      setSearchQuery(result.display_name);
      setSearchMessage("Result selected. Use Save selected place to store it.");
      setActiveTab("map");
    } catch {
      setSearchMessage("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const saveSelectedPlace = () => {
    const trimmedName = selectedPlaceName.trim();
    if (trimmedName.length === 0) {
      setSearchMessage("Search for a place before saving it.");
      return;
    }

    setPlaces((currentPlaces) => [
      ...currentPlaces,
      {
        id: Date.now(),
        name: trimmedName,
        latitude: selectedPosition[0],
        longitude: selectedPosition[1],
      },
    ]);
    setSearchQuery("");
    setSelectedPlaceName("");
    setSearchMessage("Place saved.");
  };

  const selectPlace = (place: SavedPlace) => {
    setSearchQuery(place.name);
    setSelectedPlaceName("");
    setSearchMessage("");
    setSelectedPosition([place.latitude, place.longitude]);
    setActiveTab("map");
  };

  const selectPositionFromMap = (position: Position) => {
    setSelectedPosition(position);
    setSelectedPlaceName("");
    setSearchMessage(
      "Map coordinates selected. Search for a place before saving.",
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonSegment
            mode="md"
            onIonChange={(event) => {
              const nextTab = event.detail.value;
              if (nextTab === "form" || nextTab === "map") {
                setActiveTab(nextTab);
              }
            }}
            value={activeTab}
          >
            <IonSegmentButton value="form">
              <IonLabel>FORM AND PLACES</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="map">
              <IonLabel>MAP</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {activeTab === "form" ? (
          <main className="ion-padding">
            <form onSubmit={searchMap}>
              <IonList inset>
                <IonSearchbar
                  onIonInput={(event) =>
                    setSearchQuery(event.detail.value ?? "")
                  }
                  placeholder="Search for a place or address"
                  value={searchQuery}
                />
                <IonItem lines="none">
                  <IonLabel>Selected coordinates</IonLabel>
                  <IonNote slot="end">
                    {selectedPosition[0].toFixed(7)},{" "}
                    {selectedPosition[1].toFixed(7)}
                  </IonNote>
                </IonItem>
              </IonList>

              <IonButton disabled={isSearching} expand="block" type="submit">
                {isSearching ? "Searching..." : "Search map"}
              </IonButton>
              <IonButton
                disabled={selectedPlaceName.trim().length === 0}
                expand="block"
                onClick={saveSelectedPlace}
                type="button"
              >
                Save selected place
              </IonButton>
            </form>

            {searchMessage.length > 0 && (
              <IonText color="medium">
                <p>{searchMessage}</p>
              </IonText>
            )}

            <SavedPlaces places={places} onSelectPlace={selectPlace} />
          </main>
        ) : (
          <MapContainer
            center={selectedPosition}
            className="leaflet-map"
            zoom={13}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickSelector onSelectPosition={selectPositionFromMap} />
            <MapFocus position={selectedPosition} />
            {places.map((place) => (
              <Marker
                key={place.id}
                position={[place.latitude, place.longitude]}
              >
                <Popup>
                  <strong>{place.name}</strong>
                  <br />
                  Latitude: {place.latitude.toFixed(7)}, Longitude:{" "}
                  {place.longitude.toFixed(7)}
                </Popup>
              </Marker>
            ))}
            <Marker position={selectedPosition}>
              <Popup>Selected coordinates for a new place</Popup>
            </Marker>
          </MapContainer>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
