import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
/**
 * GET → List available models
 */
export async function GET() {
  try {
    const models = await anthropic.models.list();
    return NextResponse.json(models);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        status: error.status,
      },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST → Generate structured JSON blueprint
 */
export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea) {
      return NextResponse.json(
        { error: "No idea provided" },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6", // ✅ confirmed valid
      max_tokens: 1024,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: `Return ONLY a valid JSON object for this app idea: "${idea}".

{
  "summary": "string",
  "features": ["string"],
  "database_tables": [
    { "name": "string", "columns": ["string"] }
  ]
}`
        }
      ],
    });

    // Extract text blocks from Claude response
    const text = response.content
      .filter(
        (c): c is { type: "text"; text: string } => c.type === "text"
      )
      .map((c) => c.text)
      .join("");

    // Safely extract JSON from response
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return NextResponse.json({
        error: "No JSON found in response",
        raw: text,
      });
    }

    const jsonString = text.slice(start, end + 1);

    try {
      const parsed = JSON.parse(jsonString);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        error: "Invalid JSON format",
        raw: text,
      });
    }

  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        status: error.status,
        type: error.type,
      },
      { status: error.status || 500 }
    );
  }
}