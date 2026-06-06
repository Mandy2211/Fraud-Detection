import numpy as np
import pandas as pd


def create_features(data):

    sender_balance_diff = (
        data["oldbalanceOrg"]
        - data["newbalanceOrig"]
    )

    receiver_balance_diff = (
        data["newbalanceDest"]
        - data["oldbalanceDest"]
    )

    amount_log = np.log1p(
        data["amount"]
    )

    amount_to_balance = (
        data["amount"]
        /
        (data["oldbalanceOrg"] + 1)
    )

    origin_zero = int(
        data["oldbalanceOrg"] == 0
    )

    dest_zero = int(
        data["oldbalanceDest"] == 0
    )

    features = {
        "step": data["step"],
        "amount": data["amount"],
        "oldbalanceOrg": data["oldbalanceOrg"],
        "oldbalanceDest": data["oldbalanceDest"],

        "sender_balance_diff": sender_balance_diff,
        "receiver_balance_diff": receiver_balance_diff,

        "amount_log": amount_log,

        "amount_to_balance": amount_to_balance,

        "origin_zero": origin_zero,

        "dest_zero": dest_zero,

        "type_CASH_IN": 0,
        "type_CASH_OUT": 0,
        "type_DEBIT": 0,
        "type_PAYMENT": 0,
        "type_TRANSFER": 0
    }

    tx_type = data["transaction_type"]

    if f"type_{tx_type}" in features:
        features[f"type_{tx_type}"] = 1

    return pd.DataFrame([features])