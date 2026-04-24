import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";

type Gender = "male" | "female";

type BMIResult = {
  value: string;
  category: string;
  profile: string;
};

const Home: React.FC = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [height, setHeight] = useState(185);
  const [weight, setWeight] = useState(45);
  const [error, setError] = useState("");
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);
  const [history, setHistory] = useState<BMIResult[]>([]);

  function calculateBMI() {
    if (!username) {
      setError("Enter your username before calculating BMI.");
      setBmiResult(null);
      return;
    }

    if (age === null || !Number.isFinite(age) || age < 1) {
      setError("Enter a valid age greater than zero.");
      setBmiResult(null);
      return;
    }

    if (gender === null) {
      setError("Select a gender to complete the profile.");
      setBmiResult(null);
      return;
    }

    const bmi = weight / ((height / 100) * (height / 100));
    let category = "";

    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi < 25) {
      category = "Normal weight";
    } else if (bmi < 30) {
      category = "Overweight";
    } else {
      category = "Obesity";
    }

    const nextResult = {
      value: bmi.toFixed(1),
      category,
      profile: `${username}, ${age} years, ${gender[0].toUpperCase()}${gender.slice(
        1,
      )}`,
    };

    setError("");
    setBmiResult(nextResult);
    setHistory((currentHistory) => [nextResult, ...currentHistory]);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>BMI Calculator</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          label="Username"
          placeholder="Enter username"
          value={username}
          onIonInput={(event) =>
            setUsername(String(event.detail.value ?? "").trim())
          }
        />

        <IonInput
          inputmode="numeric"
          label="Age"
          min="1"
          placeholder="Enter age"
          type="number"
          step="1"
          value={age ?? ""}
          onIonInput={(event) => {
            const nextValue = String(event.detail.value ?? "").trim();
            const nextAge = Number(nextValue);

            setAge(
              nextValue === "" || !Number.isFinite(nextAge) ? null : nextAge,
            );
          }}
        />

        <IonRadioGroup
          value={gender ?? undefined}
          onIonChange={(event) => {
            const nextValue = event.detail.value;

            setGender(
              nextValue === "male" || nextValue === "female" ? nextValue : null,
            );
          }}
        >
          <IonItem>
            <IonRadio slot="start" value="male" />
            <IonLabel>Male</IonLabel>
          </IonItem>

          <IonItem>
            <IonRadio slot="start" value="female" />
            <IonLabel>Female</IonLabel>
          </IonItem>
        </IonRadioGroup>

        <IonRange
          label={`Height: ${height} cm`}
          max={220}
          min={120}
          pin={true}
          step={1}
          value={height}
          onIonInput={(event) => {
            if (typeof event.detail.value === "number") {
              setHeight(event.detail.value);
            }
          }}
        />

        <IonRange
          className="ion-margin-top"
          label={`Weight: ${weight} kg`}
          max={180}
          min={30}
          pin={true}
          step={1}
          value={weight}
          onIonInput={(event) => {
            if (typeof event.detail.value === "number") {
              setWeight(event.detail.value);
            }
          }}
        />

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <IonButton
          className="ion-margin-top"
          expand="block"
          onClick={calculateBMI}
        >
          Calculate BMI
        </IonButton>

        {bmiResult && (
          <IonCard className="ion-margin-top bmi-result-card">
            <IonCardContent>
              <h2 className="bmi-value">Calculated BMI: {bmiResult.value}</h2>
              <p className="bmi-category">
                Category: <strong>{bmiResult.category}</strong>
              </p>
              <IonRange
                min={10}
                max={40}
                value={parseFloat(bmiResult.value)}
                disabled
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p>10</p>
                <p>40</p>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {history.length > 0 && (
          <IonCard className="ion-margin-top bmi-history-card">
            <IonCardContent>
              <h2 className="bmi-history-title">Measurement History</h2>

              <div className="bmi-history-list">
                {history.map((historyItem, index) => (
                  <div
                    className="bmi-history-item"
                    key={`${historyItem.profile}-${historyItem.value}-${index}`}
                  >
                    <IonRow>
                      BMI: <strong>{historyItem.value}</strong>
                    </IonRow>
                    <IonRow>{historyItem.category}</IonRow>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
