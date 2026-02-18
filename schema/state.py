from pydantic import BaseModel


class ProOutput(BaseModel):
    pro_argument: str


class ConOutput(BaseModel):
    con_argument: str


class ProRebuttalOutput(BaseModel):
    pro_rebuttal: str


class JudgeOutput(BaseModel):
    winner: str
    analysis: str
    ethical_soundness_pro: str
    unethical_soundness_pro: str
    ethical_soundness_con: str
    unethical_soundness_con: str
