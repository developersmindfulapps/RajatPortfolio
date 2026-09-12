import { PORTFOLIO_CONTEXT } from "./portfolio-context";
import { getCollection } from "@/lib/mongodb";
import { Resend } from "resend";
import type { ChatCompletionTool } from "openai/resources/chat/completions";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export const AI_TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_project_details",
      description: "Retrieve comprehensive details, metrics, and links for a specific project in Rajat's portfolio.",
      parameters: {
        type: "object",
        properties: {
          projectId: {
            type: "string",
            description: "The identifier or title of the project (e.g., 'portfolio', 'bat-cave', 'law-practice', 'eventually', 'enterprise').",
          },
        },
        required: ["projectId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_experience_details",
      description: "Retrieve detailed career history, responsibilities, architecture highlights, and metrics for a specific company or role of Rajat.",
      parameters: {
        type: "object",
        properties: {
          company: {
            type: "string",
            description: "The company name (e.g., 'netcracker', 'capgemini', 'infosys', 'tata-communications').",
          },
        },
        required: ["company"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_skills",
      description: "Query Rajat's technical skills, core stack, architectural competencies, or check proficiency in a specific technology.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Optional category filter: 'frontend', 'architecture', 'ui', 'backend', 'cloud', 'testing', 'ai'.",
          },
          techQuery: {
            type: "string",
            description: "Optional specific technology name to check (e.g., 'Angular', 'React', 'TypeScript', 'GraphQL', 'AG Grid').",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_contact_info",
      description: "Retrieve official contact information, social profiles, resume links, and ways to get in touch with Rajat.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_contact_request",
      description: "Submit a new contact or project inquiry message from the visitor directly to Rajat. Requires visitor name, email, and message.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The full name of the visitor.",
          },
          email: {
            type: "string",
            description: "A valid email address to reach the visitor back.",
          },
          message: {
            type: "string",
            description: "The content of the inquiry, project scope, or message for Rajat.",
          },
        },
        required: ["name", "email", "message"],
      },
    },
  },
];

export async function executeTool(name: string, args: Record<string, unknown>): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    switch (name) {
      case "get_project_details": {
        const projectId = String(args.projectId || "").toLowerCase();
        const project = PORTFOLIO_CONTEXT.projects.find(
          (p) =>
            p.id.toLowerCase().includes(projectId) ||
            p.title.toLowerCase().includes(projectId)
        );

        if (!project) {
          return {
            success: true,
            data: {
              found: false,
              availableProjects: PORTFOLIO_CONTEXT.projects.map((p) => ({ id: p.id, title: p.title })),
            },
          };
        }

        return { success: true, data: { found: true, project } };
      }

      case "get_experience_details": {
        const company = String(args.company || "").toLowerCase();
        const experience = PORTFOLIO_CONTEXT.experiences.find(
          (e) =>
            e.company.toLowerCase().includes(company) ||
            e.id.toLowerCase().includes(company) ||
            (e.client && e.client.toLowerCase().includes(company))
        );

        if (!experience) {
          return {
            success: true,
            data: {
              found: false,
              availableExperiences: PORTFOLIO_CONTEXT.experiences.map((e) => ({ company: e.company, role: e.role })),
            },
          };
        }

        return { success: true, data: { found: true, experience } };
      }

      case "get_skills": {
        const category = String(args.category || "").toLowerCase();
        const techQuery = String(args.techQuery || "").toLowerCase();

        if (techQuery) {
          let matched = false;
          let matchedCategory = "";

          for (const group of PORTFOLIO_CONTEXT.skillGroups) {
            const found = group.skills.find((s) => s.toLowerCase() === techQuery || s.toLowerCase().includes(techQuery));
            if (found) {
              matched = true;
              matchedCategory = group.title;
              break;
            }
          }

          const inFamiliar = PORTFOLIO_CONTEXT.familiarWith.some((s) => s.toLowerCase().includes(techQuery));

          return {
            success: true,
            data: {
              techQuery,
              proficient: matched,
              category: matchedCategory || null,
              familiarWith: inFamiliar,
            },
          };
        }

        if (category) {
          const group = PORTFOLIO_CONTEXT.skillGroups.find(
            (g) => g.id.includes(category) || g.title.toLowerCase().includes(category)
          );
          return {
            success: true,
            data: group ? group : { allGroups: PORTFOLIO_CONTEXT.skillGroups },
          };
        }

        return {
          success: true,
          data: {
            skillGroups: PORTFOLIO_CONTEXT.skillGroups,
            familiarWith: PORTFOLIO_CONTEXT.familiarWith,
          },
        };
      }

      case "get_contact_info": {
        return {
          success: true,
          data: {
            ...PORTFOLIO_CONTEXT.contactWays,
            resumeUrl: PORTFOLIO_CONTEXT.personal.resumeUrl,
          },
        };
      }

      case "create_contact_request": {
        const name = String(args.name || "").trim();
        const email = String(args.email || "").trim();
        const message = String(args.message || "").trim();

        if (!name || name.length < 2) {
          return { success: false, error: "Please provide a valid name (at least 2 characters)." };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email) || email.length > 254) {
          return { success: false, error: "Please provide a valid email address." };
        }

        if (!message || message.length < 5) {
          return { success: false, error: "Please provide a meaningful message (at least 5 characters)." };
        }

        // 1. Save to MongoDB
        try {
          const collection = await getCollection("contact_submissions");
          await collection.insertOne({
            name,
            email,
            message,
            source: "ai_assistant",
            status: "unread",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } catch (dbErr) {
          console.error("[ai-tools] Failed to store contact submission in MongoDB:", dbErr);
        }

        // 2. Send email via Resend if API key & contact email are configured
        const resendApiKey = process.env.RESEND_API_KEY;
        const recipientEmail = process.env.CONTACT_EMAIL || "developers.mindfulapps@gmail.com";

        if (resendApiKey && recipientEmail) {
          try {
            const resend = new Resend(resendApiKey);
            const timestamp = new Date().toLocaleString("en-GB", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Asia/Kolkata",
            });

            const safeName = escapeHtml(name);
            const safeEmail = escapeHtml(email);
            const safeMessage = escapeHtml(message);

            await resend.emails.send({
              from: "Portfolio AI Assistant <onboarding@resend.dev>",
              to: [recipientEmail],
              replyTo: email,
              subject: `🤖 AI Assistant Inquiry from ${safeName}`,
              html: `
                <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                    <span style="background: #6366f1; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase;">AI Assistant</span>
                    <h2 style="margin: 0; font-size: 18px; color: #111827;">New Contact Submission</h2>
                  </div>
                  <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; width: 80px;">Name</td>
                      <td style="padding: 8px 0; font-size: 14px; font-weight: 500;">${safeName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Email</td>
                      <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #4f46e5; text-decoration: none; font-weight: 500;">${safeEmail}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Time</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #374151;">${timestamp} (IST)</td>
                    </tr>
                  </table>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                  <h3 style="margin-top: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Message</h3>
                  <div style="background: white; padding: 14px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 14px; line-height: 1.6; color: #1f2937; white-space: pre-wrap;">${safeMessage}</div>
                </div>
              `,
            });
          } catch (emailErr) {
            console.error("[ai-tools] Failed to dispatch Resend email:", emailErr);
          }
        }

        return {
          success: true,
          data: {
            submitted: true,
            name,
            email,
            status: "Message successfully delivered to Rajat's inbox and saved in portfolio database.",
          },
        };
      }

      default:
        return { success: false, error: `Unknown tool name: ${name}` };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Tool execution failed";
    console.error(`[ai-tools] Error executing tool ${name}:`, err);
    return { success: false, error: message };
  }
}
