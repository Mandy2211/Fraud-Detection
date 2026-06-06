import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
import joblib

from schemas.transaction import RawTransaction

from services.feature_engineering import create_features

app = FastAPI()

model = joblib.load(
    "models/xgboost_v3.pkl"
)

feature_names = joblib.load(
    "models/feature_names_v3.pkl"
)


@app.get("/")
def home():

    return {
        "status": "running"
    }


@app.get("/health")
def health():

    return {
        "model": "xgboost_v3",
        "features": len(feature_names)
    }


@app.post("/predict")
def predict(transaction: RawTransaction):

    data = transaction.model_dump()

    features_df = create_features(data)

    features_df = features_df[
        feature_names
    ]

    probability = float(
        model.predict_proba(
            features_df
        )[0][1]
    )

    prediction = int(
        probability > 0.5
    )

    return {
        "fraud_probability": probability,
        "prediction": prediction
    }