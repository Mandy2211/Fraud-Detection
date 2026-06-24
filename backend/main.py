import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
import joblib

from database.session import SessionLocal
from database.models import Prediction

from schemas.transaction import RawTransaction

from services.feature_engineering import create_features
from services.prediction_service import save_prediction

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
import shap

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(
    os.path.join(BASE_DIR, "models", "xgboost_v3.pkl")
)

feature_names = joblib.load(
    os.path.join(BASE_DIR, "models", "feature_names_v3.pkl")
)

explainer = shap.TreeExplainer(model)


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

    # Generate SHAP Values
    shap_values = explainer.shap_values(features_df)
    if isinstance(shap_values, list):
        shap_row = shap_values[1][0]
    else:
        shap_row = shap_values[0]

    # Pair Features With SHAP Scores
    feature_impacts = []
    for feature, value in zip(feature_names, shap_row):
        feature_impacts.append({
            "feature": feature,
            "impact": float(value)
        })

    # Sort by Importance (highest absolute impact)
    feature_impacts = sorted(
        feature_impacts,
        key=lambda x: abs(x["impact"]),
        reverse=True
    )

    # Make Feature Names Human Friendly
    feature_labels = {
        "sender_balance_diff": "Large Sender Balance Change",
        "amount_to_balance": "Large Amount Relative To Balance",
        "type_TRANSFER": "Transfer Transaction",
        "receiver_balance_diff": "Large Receiver Balance Change",
        "dest_zero": "New Destination Account",
        "step": "Time/Hour of Transaction",
        "amount": "High Transaction Amount",
        "oldbalanceOrg": "Initial Sender Balance",
        "oldbalanceDest": "Initial Recipient Balance",
        "amount_log": "Log-Scale Transaction Amount",
        "origin_zero": "Zero Balance Origin Account",
        "type_CASH_IN": "Cash In Transaction",
        "type_CASH_OUT": "Cash Out Transaction",
        "type_DEBIT": "Debit Transaction",
        "type_PAYMENT": "Payment Transaction"
    }

    # Keep Top 3 Reasons
    top_reasons = []
    for item in feature_impacts[:3]:
        feature_key = str(item["feature"])
        top_reasons.append({
            "reason": feature_labels.get(feature_key, feature_key),
            "impact": round(item["impact"], 3)
        })

    save_prediction(
        amount=transaction.amount,
        transaction_type=transaction.transaction_type,
        fraud_probability=probability,
        prediction=prediction
    )

    return {
        "fraud_probability": probability,
        "prediction": prediction,
        "top_reasons": top_reasons
    }


@app.get("/predictions")
def get_predictions():

    db = SessionLocal()

    try:

        rows = db.query(Prediction).all()

        result = []

        for row in rows:

            result.append({
                "id": row.id,
                "amount": row.amount,
                "transaction_type": row.transaction_type,
                "fraud_probability": row.fraud_probability,
                "prediction": row.prediction
            })

        return result

    finally:

        db.close()


@app.get("/stats")
def get_stats():

    db = SessionLocal()

    try:

        total = db.query(Prediction).count()

        fraud = db.query(Prediction)\
                  .filter(
                      Prediction.prediction == 1
                  )\
                  .count()

        return {
            "total_transactions": total,
            "fraud_transactions": fraud,
            "fraud_rate": (
                fraud / total * 100
                if total > 0
                else 0
            )
        }

    finally:

        db.close()