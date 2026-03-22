export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, message: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const body = await req.json();

  return fetch("https://dgec-contact-api.dgroupofficial.workers.dev/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      formType: "student_inquiry",
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      country: body.country,
      education: body.currentEducation,
      course: body.interestedCourse,
      university: body.interestedUniversity,
      intake: body.preferredIntake,
      message: body.message,
    }),
  });
}
