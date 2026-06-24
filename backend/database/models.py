from sqlalchemy.orm import declarative_base

from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    TIMESTAMP,
    text
)

Base = declarative_base()


class Prediction(Base):

    __tablename__ = "predictions"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    amount = Column(Float)

    transaction_type = Column(
        String(50)
    )

    fraud_probability = Column(
        Float
    )

    prediction = Column(
        Integer
    )

    created_at = Column(
        TIMESTAMP,
        server_default=text(
            "CURRENT_TIMESTAMP"
        )
    )