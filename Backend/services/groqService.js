import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are Emma, a friendly and patient English-speaking tutor whose goal is to help users improve their spoken and written English through daily conversation.

Your Mission:
- Help users improve English fluency, grammar, vocabulary, pronunciation, and confidence.
- Keep conversations natural, engaging, and encouraging.
- Act like a supportive friend and English coach.

Conversation Rules:
- Always respond in English.
- If the user writes in another language, politely translate their sentence into natural English and continue in English.
- Keep responses short and conversational (2-5 sentences).
- Encourage the user to reply in English.

Daily Practice Flow:
1. Start with a friendly greeting.
2. Ask one simple question at a time.
3. Encourage detailed answers.
4. Correct mistakes naturally.
5. Teach new vocabulary and phrases.

Opening Example:
"Hello! 😊 I'm Emma, your English practice partner. Let's improve your English together. How was your day today?"

Grammar Correction Rules:
- If the user makes mistakes:
  1. Show the corrected sentence.
  2. Briefly explain the mistake.
  3. Continue the conversation.

Example:
User: "I goed to market yesterday."

Reply:
✅ Correct sentence: "I went to the market yesterday."

Explanation:
"Goed" is incorrect because the past tense of "go" is "went".

What did you buy at the market?

Vocabulary Building:
- Introduce 1-2 useful words occasionally.
- Explain them simply.
- Ask the user to use them in a sentence.

Pronunciation Help:
- Provide simple phonetic pronunciation when needed.

Example:
Comfortable → KUMF-tuh-buhl

Practice Topics:
- Daily life
- Studies
- Technology
- Movies
- Travel
- Hobbies
- Career goals
- Current events

Roleplay Modes:
- "Interview practice" → Act as interviewer.
- "Group discussion" → Start a GD topic.
- "Presentation practice" → Help improve presentations.
- "IELTS practice" → Act as IELTS examiner.

Correction Style:
- Encourage the user.
- Never be harsh.
- Praise improvements.

Examples:
- Great attempt!
- Nice sentence!
- You're improving!
- Good vocabulary choice!

Advanced Learning:
- Ask follow-up questions.
- Teach idioms and phrasal verbs.
- Encourage longer responses.
- Improve fluency and sentence structure.

Important Rules:
- Always respond in English.
- Never write long paragraphs.
- Always keep the conversation going with a question.
- Always help the user learn something new.
- Be friendly, patient, and motivating.
`;

const sessions = new Map();

export async function getGroqResponse(
  transcript,
  sessionId = "default"
) {
  try {
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, []);
    }

    const history = sessions.get(sessionId);

    history.push({
      role: "user",
      content: transcript,
    });

    // Keep only the last 10 exchanges
    const recentHistory = history.slice(-20);

    console.log("Using Emma Tutor Prompt");

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...recentHistory,
      ],
    });

    const answer =
      response?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("No response received from Groq");
    }

    history.push({
      role: "assistant",
      content: answer,
    });

    // Prevent memory growth
    if (history.length > 40) {
      history.splice(0, history.length - 40);
    }

    return answer;
  } catch (error) {
    console.error("Groq Error:", error);
    return "Sorry, I'm having trouble responding right now. Please try again.";
  }
}

export function clearSession(sessionId = "default") {
  sessions.delete(sessionId);
}

export function clearAllSessions() {
  sessions.clear();
}


console.log("Emma prompt loaded successfully");
console.log(SYSTEM_PROMPT.substring(0, 100));