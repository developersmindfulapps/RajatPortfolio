import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { AI_TOOLS, executeTool } from "@/lib/ai/tools";
import { getClientIp, isAiRateLimited, validateChatPayload } from "@/lib/ai/rate-limit";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<Response> {
  // 1. Check Rate Limiting
  const clientIp = getClientIp(req);
  const rateLimitCheck = isAiRateLimited(clientIp);

  if (rateLimitCheck.limited) {
    return NextResponse.json(
      {
        error: rateLimitCheck.reason || "Rate limit exceeded. Please wait a moment.",
        retryAfter: rateLimitCheck.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitCheck.retryAfterSeconds || 60),
        },
      }
    );
  }

  // 2. Validate Request Body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateChatPayload(body);
  if (!validation.valid || !validation.messages) {
    return NextResponse.json({ error: validation.error || "Invalid request." }, { status: 400 });
  }

  // 3. Verify OpenAI API Key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[ai-chat] OPENAI_API_KEY is not configured.");
    return NextResponse.json(
      { error: "AI Assistant is temporarily unavailable. Please try again later or contact Rajat directly." },
      { status: 503 }
    );
  }

  // 4. Resolve Model (Configurable via OPENAI_MODEL)
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const openai = new OpenAI({ apiKey });
  const systemPrompt = buildSystemPrompt();

  const conversationHistory: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...validation.messages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
  ];

  // 5. Streaming Response via Server-Sent Events (SSE)
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        // Initial non-streaming or streaming call to check for tool calls
        const initialResponse = await openai.chat.completions.create({
          model,
          messages: conversationHistory,
          tools: AI_TOOLS,
          tool_choice: "auto",
          temperature: 0.4,
          max_tokens: 800,
        });

        const choice = initialResponse.choices[0];
        const message = choice?.message;

        // Check if model decided to call tools
        if (message?.tool_calls && message.tool_calls.length > 0) {
          conversationHistory.push(message);

          for (const toolCall of message.tool_calls) {
            // Function tool calls have 'function' property
            if ("function" in toolCall) {
              const toolName = toolCall.function.name;
              let parsedArgs: Record<string, unknown> = {};
              try {
                parsedArgs = JSON.parse(toolCall.function.arguments || "{}");
              } catch {
                parsedArgs = {};
              }

              sendEvent({
                type: "tool_start",
                tool: toolName,
                label: getToolStatusLabel(toolName),
              });

              const executionResult = await executeTool(toolName, parsedArgs);

              sendEvent({
                type: "tool_done",
                tool: toolName,
                success: executionResult.success,
              });

              conversationHistory.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(executionResult),
              });
            }
          }

          // Follow-up streaming completion after tool output
          const secondStream = await openai.chat.completions.create({
            model,
            messages: conversationHistory,
            stream: true,
            temperature: 0.4,
            max_tokens: 800,
          });

          for await (const chunk of secondStream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) {
              sendEvent({ type: "token", delta });
            }
          }
        } else {
          // Direct response without tool call
          const text = message?.content || "";
          if (text) {
            sendEvent({ type: "token", delta: text });
          }
        }

        sendEvent({ type: "done" });
      } catch (err: unknown) {
        console.error("[ai-chat] Error in OpenAI streaming:", err);
        const userMsg = "I encountered an issue processing your request. Please try again or reach out to Rajat directly.";
        sendEvent({ type: "error", message: userMsg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

function getToolStatusLabel(toolName: string): string {
  switch (toolName) {
    case "create_contact_request":
      return "Submitting your message to Rajat...";
    case "get_project_details":
      return "Fetching project details...";
    case "get_experience_details":
      return "Retrieving career details...";
    case "get_skills":
      return "Checking skill details...";
    case "get_contact_info":
      return "Fetching contact information...";
    default:
      return "Processing request...";
  }
}
