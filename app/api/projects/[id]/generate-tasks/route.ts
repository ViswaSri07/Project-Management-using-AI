import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "AIzaSyCeQs50DQR1aTRPtpacWbnTl5AGHfV2rwA");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await db.project.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Generate tasks using Gemini
    const prompt = `
      Generate a comprehensive task list for the following project:
      
      Project Title: ${project.title}
      Project Description: ${project.description}
      
      For each task, provide:
      1. Task title (short and clear)
      2. Detailed description
      3. Priority level (LOW, MEDIUM, HIGH, or CRITICAL)
      4. Category (e.g., Design, Development, Testing)
      5. Due date (in YYYY-MM-DD format, realistic timeline)
      
      Format the response as a JSON array of tasks with the following structure:
      [
        {
          "title": "Task title",
          "description": "Detailed description",
          "priority": "PRIORITY_LEVEL",
          "category": "Category",
          "dueDate": "YYYY-MM-DD"
        },
        ...
      ]
      
      Generate between 5-10 tasks that make sense for this project.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    const cleanedText = text.replace(/```json|```/g, "").trim();
    console.log(cleanedText)

    // Parse the Gemini response
    let tasks;
    try {
      
      tasks = await JSON.parse(cleanedText);
    } catch (error) {

      console.error("Error parsing Gemini response:", error);
      return NextResponse.json(
        { error: "Failed to parse Gemini response" },
        { status: 500 }
      );
    }

    // Delete existing tasks for this project
    await db.task.deleteMany({
      where: {
        projectId: project.id,
      },
    });

    // Create new tasks
    const createdTasks = await Promise.all(
      tasks.map(async (task: any) => {
        return db.task.create({
          data: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            category: task.category,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            status: "TODO",
            projectId: project.id,
          },
        });
      })
    );

    return NextResponse.json({ tasks: createdTasks });
  } catch (error) {
    console.error("Error generating tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}