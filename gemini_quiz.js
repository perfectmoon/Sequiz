import https from 'https';
import { Buffer } from 'buffer';
import process from 'process';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const apiKey = process.argv[2];
const category = process.argv[3];

if (!apiKey || !category) {
    console.log(JSON.stringify({ error: "Missing arguments (API Key or Category)" }));
    process.exit(1);
}

const prompt = `
You are a cyber security trainer.
Create EXACTLY 5 multiple-choice trivia questions in the category "${category}".

Format the response as valid JSON only, without markdown formatting, with this shape:
{
  "questions": [
    {
      "question": "string",
      "choices": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "short explanation"
    }
  ]
}

Difficulty: beginner–intermediate. Keep each explanation under 50 words.
`;

function generateQuiz() {
    const hostname = 'generativelanguage.googleapis.com';
    const path = `/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const payload = JSON.stringify({
        contents: [{
            parts: [{ text: prompt }]
        }]
    });

    const options = {
        hostname: hostname,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode !== 200) {
                console.log(JSON.stringify({ error: `Google API Error: ${res.statusCode}`, raw: data.toString() }));
                process.exit(1);
            }

            try {
                const result = JSON.parse(data);
                
                let textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (!textResponse) {
                    console.log(JSON.stringify({ error: "Empty response from Gemini", raw: result }));
                    process.exit(1);
                }

                textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

                const jsonResult = JSON.parse(textResponse);

                console.log(JSON.stringify(jsonResult));

            } catch (e) {
                console.log(JSON.stringify({ error: "Failed to parse JSON", details: e.message, raw: data.toString() }));
                process.exit(1);
            }
        });
    });

    req.on('error', (e) => {
        console.log(JSON.stringify({ error: "Network Error", details: e.message }));
        process.exit(1);
    });

    req.write(payload);
    req.end();
}

generateQuiz();