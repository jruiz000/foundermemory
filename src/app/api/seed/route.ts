import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const seedQuotes = [
  {
    text: "If you're not embarrassed by the first version of your product, you've launched too late.",
    author: "Reid Hoffman",
    source: "Masters of Scale Podcast",
    context: "Cuando dudas si tu producto está listo para lanzar",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    source: "Traditional",
    context: "Cuando sientes que es demasiado tarde para empezar",
  },
  {
    text: "Your margin is my opportunity.",
    author: "Jeff Bezos",
    source: "Amazon Shareholder Letters",
    context: "Cuando buscas oportunidades de mercado",
  },
  {
    text: "The biggest risk is not taking any risk.",
    author: "Mark Zuckerberg",
    source: "Y Combinator Startup School",
    context: "Cuando tienes miedo de tomar decisiones arriesgadas",
  },
  {
    text: "Done is better than perfect.",
    author: "Sheryl Sandberg",
    source: "Lean In",
    context: "Cuando el perfeccionismo te paraliza",
  },
  {
    text: "Make something people want.",
    author: "Paul Graham",
    source: "Y Combinator",
    context: "Cuando no sabes en qué enfocarte",
  },
  {
    text: "It's not about ideas. It's about making ideas happen.",
    author: "Scott Belsky",
    source: "Making Ideas Happen",
    context: "Cuando tienes muchas ideas pero no ejecutas",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    source: "Stanford Commencement Speech 2005",
    context: "Cuando cuestionas si estás en el camino correcto",
  },
  {
    text: "Startups don't die when they run out of money, they die when the founders give up.",
    author: "Naval Ravikant",
    source: "How to Get Rich Podcast",
    context: "Cuando sientes que quieres rendirte",
  },
  {
    text: "The hard thing about hard things is that there is no formula for dealing with them.",
    author: "Ben Horowitz",
    source: "The Hard Thing About Hard Things",
    context: "Cuando buscas respuestas fáciles a problemas difíciles",
  },
  {
    text: "Price is what you pay. Value is what you get.",
    author: "Warren Buffett",
    source: "Berkshire Hathaway Letters",
    context: "Cuando evalúas inversiones o decisiones de compra",
  },
  {
    text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
    author: "Mark Zuckerberg",
    source: "Facebook Internal Motto",
    context: "Cuando te preocupa ir demasiado rápido",
  },
  {
    text: "Your most unhappy customers are your greatest source of learning.",
    author: "Bill Gates",
    source: "Business @ the Speed of Thought",
    context: "Cuando recibes críticas negativas",
  },
  {
    text: "In the long run, the most unpleasant truth is a safer companion than a pleasant falsehood.",
    author: "Theodore Roosevelt",
    source: "Various Speeches",
    context: "Cuando evitas conversaciones difíciles",
  },
  {
    text: "Entrepreneurship is living a few years of your life like most people won't, so you can spend the rest of your life like most people can't.",
    author: "Warren Tracy",
    source: "Entrepreneurship Quote",
    context: "Cuando cuestionas los sacrificios que estás haciendo",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    source: "Disney Biography",
    context: "Cuando planeas demasiado y ejecutas poco",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    source: "Various Speeches",
    context: "Después de un fracaso o un éxito",
  },
  {
    text: "The customer is not always right, but they are always the customer.",
    author: "Shep Hyken",
    source: "Customer Service Expert",
    context: "Cuando lidias con clientes difíciles",
  },
  {
    text: "Hire slowly, fire quickly.",
    author: "Naval Ravikant",
    source: "Twitter/X",
    context: "Cuando tomas decisiones de contratación",
  },
  {
    text: "Culture eats strategy for breakfast.",
    author: "Peter Drucker",
    source: "Management Theory",
    context: "Cuando priorizas estrategia sobre cultura",
  },
];

export async function POST() {
  try {
    const existingQuotes = await prisma.quote.count();
    if (existingQuotes > 0) {
      return NextResponse.json({ 
        message: "Database already seeded", 
        count: existingQuotes 
      });
    }

    let created = 0;

    for (const quote of seedQuotes) {
      let author = await prisma.author.findUnique({
        where: { name: quote.author },
      });

      if (!author) {
        author = await prisma.author.create({
          data: { name: quote.author },
        });
      }

      await prisma.quote.create({
        data: {
          text: quote.text,
          authorId: author.id,
          source: quote.source,
          context: quote.context,
          originalLang: "en",
        },
      });
      created++;
    }

    return NextResponse.json({ 
      message: "Database seeded successfully", 
      count: created 
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await prisma.quote.count();
    const authors = await prisma.author.count();
    return NextResponse.json({ quotes: count, authors });
  } catch (error) {
    console.error("Count error:", error);
    return NextResponse.json(
      { error: "Failed to count records" },
      { status: 500 }
    );
  }
}
