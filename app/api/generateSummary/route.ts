import { openai } from "@/openai";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

  const { todos } = await request.json();

  const chatCompletion = await openai.chat.completions.create({
    messages: [{
      role: "system",
      content: "When responding, welcome the user always as Mr Akidiva and say welcome to the Rock Nation Todo App!  Limit the response to 200 characters."
    },
    {
      role: "user",
      content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as todo, in progress and done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(todos)} `
    }],
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false
  });


  console.log('chatCompletion: ', chatCompletion.choices[0].message.content);

  // const { data } = chatCompletion;

  // console.log('data.choices[0].message: ', data.choices[0].message);

  return NextResponse.json(
    { "suggestion": chatCompletion.choices[0].message.content }
  )

}