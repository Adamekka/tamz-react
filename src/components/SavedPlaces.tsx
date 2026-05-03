import React from "react";
import { IonItem, IonLabel, IonList, IonListHeader } from "@ionic/react";

export interface SavedPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface SavedPlacesProps {
  places: SavedPlace[];
  onSelectPlace: (place: SavedPlace) => void;
}

const SavedPlaces: React.FC<SavedPlacesProps> = ({ places, onSelectPlace }) => {
  return (
    <IonList inset>
      <IonListHeader>
        <IonLabel>Saved places</IonLabel>
      </IonListHeader>

      {places.length === 0 ? (
        <IonItem lines="none">
          <IonLabel color="medium">You have not saved any places yet.</IonLabel>
        </IonItem>
      ) : (
        <>
          {places.map((place) => (
            <IonItem
              button
              detail
              key={place.id}
              onClick={() => onSelectPlace(place)}
            >
              <IonLabel>
                <h2>{place.name}</h2>
                <p>
                  Latitude: {place.latitude.toFixed(7)}, Longitude:{" "}
                  {place.longitude.toFixed(7)}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </>
      )}
    </IonList>
  );
};

export default SavedPlaces;
