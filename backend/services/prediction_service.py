from database.session import SessionLocal

from database.models import Prediction


def save_prediction(
    amount,
    transaction_type,
    fraud_probability,
    prediction
):

    db = SessionLocal()

    try:

        row = Prediction(
            amount=amount,
            transaction_type=transaction_type,
            fraud_probability=fraud_probability,
            prediction=prediction
        )

        db.add(row)

        db.commit()

    finally:

        db.close()