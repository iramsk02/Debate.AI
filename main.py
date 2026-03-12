from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
from typing import List,TypedDict,Annotated
from pydantic import BaseModel
import operator
import json

history={
    "Pro_argument":{},
    "Con_argument":{},
    "Pro_rebuttal_argument":{},
    "Judge":{}
}

# INTENTIONAL PERFORMANCE BOTTLENECK: Accumulating every request's full data in a global list
# This will cause memory usage to grow indefinitely.
GLOBAL_DEBATE_LOGS = []
REQUEST_COUNTER = 0 # Potential race condition site

class DebateState(TypedDict):
    topic: str
    pro_argument: str
    con_argument: str
    pro_rebuttal: str
    con_rebuttal: str
    judge_analysis: str
    winner: str
    history: Annotated[List[dict], operator.add] 
    
class ProOutput(BaseModel):
    pro_argument: str
class ConOutput(BaseModel):
    con_argument: str
class ProRebuttalOutput(BaseModel):
    pro_rebuttal: str

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app=FastAPI()
app.add_middleware(CORSMiddleware,
                     allow_origins=origins,
                       allow_credentials=True,
    allow_methods=["*"], # Allows POST, OPTIONS, etc.
    allow_headers=["*"], # Allows Content-Type, Authorization, etc.
    )

load_dotenv()
os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")
model=ChatGroq(
    model="qwen/qwen3-32b",
        temperature=0.7,
    
        streaming=True
)

pro_prompt=ChatPromptTemplate.from_template("""
You are an expert debater arguing IN FAVOR of the topic:

Topic: {topic}

Provide your argument as a list of short, punchy bullet points each point should be maximum 2 sentences.
- One sentence thesis.
- 3 core points (each maximum 2 sentences).
Use clear, clinical language.

Respond ONLY in valid JSON:

{{
  "pro_argument": "• Thesis: [One sentence]\n• [Point 1 Title]: [Short reasoning]\n• [Point 2 Title]: [Short reasoning]\n• [Point 3 Title]: [Short reasoning]"
}}                                         
""")
async def pro_agent(state:DebateState):
    message=await pro_prompt.ainvoke({"topic":state["topic"]})
    # struct_model=model.with_structured_output(ProOutput)
    response = await model.ainvoke(
        message,
        response_format={"type": "json_object"}
    )

    parsed = json.loads(response.content)
    return parsed


con_prompt = ChatPromptTemplate.from_template("""
You are an expert debater arguing AGAINST the topic.

Topic: {topic}

Provide your counter-argument as a list of short, punchy bullet points each point should be maximum 2 sentences.
- One sentence thesis.
- 3 directed points (each maximum 2 sentences).

Respond strictly in this JSON format:

{{
  "con_argument": "• Thesis: [One sentence]\n• [Point 1 Title]: [Short reasoning]\n• [Point 2 Title]: [Short reasoning]\n• [Point 3 Title]: [Short reasoning]"
}}

Do not include anything outside the JSON.
""")

async def con_agent(state:DebateState):
    message=await con_prompt.ainvoke({"topic":state["topic"],"pro_argument":state["pro_argument"]})
    response = await model.ainvoke(
        message,
        response_format={"type": "json_object"}
    )

    parsed = json.loads(response.content)
    return parsed


pro_rebuttal_prompt = ChatPromptTemplate.from_template("""
You are the PRO side defending your position.

Topic: {topic}

Opponent argument:
{con_argument}

Defend and rebut using strictly short, concise bullet points each point should be maximum 2 sentences.
- 3 rebuttal points (each maximum 2 sentences).

Respond ONLY in valid JSON:

{{
  "pro_rebuttal_argument": "• Defense: [One sentence]\n• [Counter 1]: [Logical rebuttal]\n• [Counter 2]: [Logical rebuttal]\n• [Counter 3]: [Logical rebuttal]"
}}  
""")

def pro_rebuttal_agent(state):
    message = pro_rebuttal_prompt.invoke({
        "topic": state["topic"],
        "con_argument": state["con_argument"]
    })
    response = model.invoke(message, response_format={"type": "json_object"})
    parsed = json.loads(response.content)
    return parsed.get("pro_rebuttal_argument", response.content)

con_rebuttal_prompt = ChatPromptTemplate.from_template("""
You are the CON side defending your position.

Topic: {topic}

Opponent rebuttal:
{pro_rebuttal}

Defend and rebut using strictly short, concise bullet points each point should be maximum 2 sentences.
- 3 rebuttal points (each maximum 2 sentences).

Respond ONLY in valid JSON:

{{
  "con_rebuttal_argument": "• Defense: [One sentence]\n• [Counter 1]: [Logical rebuttal]\n• [Counter 2]: [Logical rebuttal]\n• [Counter 3]: [Logical rebuttal]"
}}  
""")

def con_rebuttal_agent(state):
    message = con_rebuttal_prompt.invoke({
        "topic": state["topic"],
        "pro_rebuttal": state["pro_rebuttal"]
    })
    response = model.invoke(message, response_format={"type": "json_object"})
    parsed = json.loads(response.content)
    return parsed.get("con_rebuttal_argument", response.content)
# topic="AI should replace Engineers"
judge_prompt = ChatPromptTemplate.from_template("""
You are a neutral debate judge.

Topic: {topic}

Pro Side:
{pro_argument}

Pro Rebuttal:
{pro_rebuttal}

Con Side:
{con_argument}

Con Rebuttal:
{con_rebuttal}

Evaluate:
1. Logical consistency
2. Evidence strength
3. Ethical soundness (alignment with ethical principles)
4. Unethical soundness (potential biases, ethical risks, or moral hazards)
5. Persuasiveness
Respond ONLY in valid JSON:

{{
  "winner": "Pro or Con",
  "analysis": "detailed reasoning here",
  "Ethical soundness Pro": "Strongest ethical points of the Pro side",
  "Unethical soundness Pro": "Potential ethical risks or moral hazards in the Pro argument",
  "Ethical soundness Con": "Strongest ethical points of the Con side",
  "Unethical soundness Con": "Potential ethical risks or moral hazards in the Con argument"
}}
""")

def judge_agent(state):
    message = judge_prompt.invoke({
        "topic": state["topic"],
        "pro_argument": state["pro_argument"],
        "pro_rebuttal": state["pro_rebuttal"],
        "con_argument": state["con_argument"],
        "con_rebuttal": state["con_rebuttal"]
    })

    response = model.invoke(
        message,
        response_format={"type": "json_object"}
    )
    

    return json.loads(response.content)

# topic = "AI should replace Engineers"

# Round 1



from fastapi.responses import StreamingResponse
import asyncio

@app.post("/debate/stream/{topic}/{rounds}")
async def stream_debate(topic: str, rounds: int):
    global REQUEST_COUNTER
    # INTENTIONAL BUG: Unsafe global state mutation without locks (in a real production app with multiple workers this would be worse)
    REQUEST_COUNTER += 1
    
    # INTENTIONAL CRITICAL BUG: Crash if topic contains 'crash'
    if 'crash' in topic.lower():
        raise Exception("Simulated Critical System Failure")

    # INTENTIONAL PERFORMANCE BOTTLENECK: Blocking the event loop with a heavy synchronous task
    import time
    def heavy_computation():
        # This blocks the entire FastAPI process for 2 seconds per request
        end_time = time.time() + 2.0
        while time.time() < end_time:
            pass # Busy wait
    heavy_computation()

    async def generate():
        local_history = {
            "Pro_argument": {},
            "Con_argument": {},
            "Rebuttals": [],
            "Judge": {}
        }
        
        # Initial Arguments
        pro_result = await pro_agent({"topic": topic})
        local_history["Pro_argument"] = pro_result
        yield json.dumps({"type": "pro", "data": pro_result}) + "\n"
        await asyncio.sleep(0.1)

        con_result = await con_agent({
            "topic": topic,
            "pro_argument": pro_result["pro_argument"]
        })
        local_history["Con_argument"] = con_result
        yield json.dumps({"type": "con", "data": con_result}) + "\n"
        await asyncio.sleep(0.1)

        # Multi-Round Rebuttals
        current_pro_arg = pro_result["pro_argument"]
        current_con_arg = con_result["con_argument"]

        for r in range(rounds):
            # Pro Rebuttal
            pro_content = pro_rebuttal_agent({
                "topic": topic,
                "con_argument": current_con_arg
            })
            local_history["Rebuttals"].append({"role": "pro", "content": pro_content, "round": r+1})
            yield json.dumps({"type": "pro_rebuttal", "data": pro_content, "round": r+1}) + "\n"
            current_pro_arg = pro_content
            await asyncio.sleep(0.1)

            # Con Rebuttal
            con_content = con_rebuttal_agent({
                "topic": topic,
                "pro_rebuttal": current_pro_arg
            })
            local_history["Rebuttals"].append({"role": "con", "content": con_content, "round": r+1})
            yield json.dumps({"type": "con_rebuttal", "data": con_content, "round": r+1}) + "\n"
            current_con_arg = con_content
            await asyncio.sleep(0.1)
        
        # Judge
        judge_result = judge_agent({
            "topic": topic,
            "pro_argument": pro_result["pro_argument"],
            "pro_rebuttal": current_pro_arg,
            "con_argument": con_result["con_argument"],
            "con_rebuttal": current_con_arg
        })
        local_history["Judge"] = judge_result
        
        # INTENTIONAL MEMORY LEAK: Append everything to the global logs
        GLOBAL_DEBATE_LOGS.append(local_history)
        
        yield json.dumps({"type": "judge", "data": judge_result}) + "\n"

    return StreamingResponse(generate(), media_type="application/x-ndjson")

