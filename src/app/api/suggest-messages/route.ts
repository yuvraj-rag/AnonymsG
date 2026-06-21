import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const categoryInstructions = {
    fun: `
Generate light-hearted, playful, and entertaining questions.

Example styles:
- What fictional character would make the worst roommate?
- What's the funniest misunderstanding you've ever witnessed?
- If pets could leave reviews of their owners, what would yours say?

These are only examples.
Do not copy or closely rephrase them.
Feel free to generate any question that matches a fun and playful tone.
`,

    creative: `
Generate imaginative and creative questions.

Example styles:
- If clouds could store memories, which memory would you save?
- If you could redesign one everyday object, what would it be?
- What invention do you wish existed?

These are only examples.
Do not copy or closely rephrase them.
Feel free to explore any creative or imaginative scenario.
`,

    deep: `
Generate thoughtful and reflective questions.

Example styles:
- What makes someone truly memorable?
- What belief have you changed your mind about?
- What quality do you admire most in other people?

These are only examples.
Do not copy or closely rephrase them.
Feel free to explore meaningful ideas that encourage reflection.
`,

    spicy: `
Generate bold, opinion-based, and discussion-provoking questions.

Example styles:
- What's an unpopular opinion you'll defend?
- What's something society overrates?
- What's a trend you never understood?

These are only examples.
Do not copy or closely rephrase them.
Avoid politics, religion, NSFW content, and sensitive topics.
`,

    random: `
Generate unusual, surprising, and highly varied questions.

Example styles:
- If your shoes could talk, what would they complain about?
- What would be the worst thing to become edible?
- If gravity stopped for five minutes, what would you do first?

These are only examples.
Do not copy or closely rephrase them.
Feel free to generate any unexpected or unconventional conversation starter.
`,
} as const;

export const dynamic = "force-dynamic";// dont cache this route, re generate the texts every request

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category")?.toLowerCase() ?? "random";

    const categoryInstruction =
        categoryInstructions[category as keyof typeof categoryInstructions] ??
        categoryInstructions.random;

    const prompt = `
You are generating conversation starters for an anonymous social messaging platform.

Generate exactly 3 questions.

Category Guidance:
${categoryInstruction}

Requirements:
- Return exactly 3 questions.
- Separate each question using '||'.
- Questions should feel natural and human-written.
- Questions should encourage interesting responses rather than one-word answers.
- The three questions should be noticeably different from one another.
- Avoid repeating themes within the same response.
- Avoid generic questions that frequently appear in conversation starter lists.
- Avoid hobbies, favorite foods, dream vacations, historical figures, and similar overused topics unless they are presented in a highly original way.
- Keep the tone engaging and welcoming.
- Avoid personal, sensitive, political, religious, medical, financial, or NSFW topics.
- Prioritize originality, curiosity, and variety.

Return only the questions separated by '||'.

Example output format:
Question one?||Question two?||Question three?
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0,
                },
            },
        });

        if (!response.text) {
            return Response.json(
                {
                    success: false,
                    message: "Empty response",
                },
                { status: 500 },
            );
        }

        return Response.json(
            {
                success: true,
                suggestions: response.text
                    .split("||")
                    .map((question) => question.trim())
                    .filter(Boolean), //response is sent as array
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error while suggesting messages : ", error);
        return Response.json(
            {
                success: false,
                message: "Problems while suggesting messages",
            },
            { status: 500 },
        );
    }
}
