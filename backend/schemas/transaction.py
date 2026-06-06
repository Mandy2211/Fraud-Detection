from pydantic import BaseModel

class RawTransaction(BaseModel):

    step: int

    amount: float

    oldbalanceOrg: float

    newbalanceOrig: float

    oldbalanceDest: float

    newbalanceDest: float

    transaction_type: str