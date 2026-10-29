/*
    POST /api/contact

    Receives the Contact form and emails it to the club inbox through Resend.

    Body (JSON): { name, email, topic, message, website }
    "website" is a hidden honeypot field. People leave it empty; bots fill it.

    Responses:
        200 { ok: true }
        400 { ok: false, error: "Invalid input", fields: [...] }
        405 { ok: false, error: "Method not allowed" }
        500 / 502 { ok: false, error: "..." }

    Environment variables (set in Vercel, or .env.local for `vercel dev`):
        RESEND_API_KEY   API key from resend.com
        CONTACT_TO       Inbox that receives the messages
        CONTACT_FROM     Optional. Defaults to Resend's test sender, which can
                         only deliver to the email the Resend account uses.
*/

const TOPICS = {
    join: "Join the club",
    collaborate: "Collaborate",
    speak: "Speak at an event",
    general: "Something else"
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FROM = "Agentic AI Club Website <onboarding@resend.dev>";

const clean = value => (typeof value === "string" ? value.trim() : "");

function readBody(req) {
    if (req.body && typeof req.body === "object") return req.body;

    if (typeof req.body === "string") {
        try {
            return JSON.parse(req.body);
        } catch {
            return {};
        }
    }

    return {};
}

function validate(body) {
    const data = {
        name: clean(body.name).replace(/\s+/g, " "),
        email: clean(body.email),
        topic: clean(body.topic),
        message: clean(body.message)
    };

    const fields = [];

    if (!data.name || data.name.length > 100) fields.push("name");
    if (data.email.length > 254 || !EMAIL_PATTERN.test(data.email)) fields.push("email");
    if (!TOPICS[data.topic]) fields.push("topic");
    if (!data.message || data.message.length > 500) fields.push("message");

    return { data, fields };
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const body = readBody(req);

    if (clean(body.website)) {
        return res.status(200).json({ ok: true });
    }

    const { data, fields } = validate(body);

    if (fields.length) {
        return res.status(400).json({ ok: false, error: "Invalid input", fields });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO;

    if (!apiKey || !to) {
        console.error("contact: RESEND_API_KEY or CONTACT_TO is not set");
        return res.status(500).json({ ok: false, error: "Server not configured" });
    }

    const topicLabel = TOPICS[data.topic];

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: process.env.CONTACT_FROM || DEFAULT_FROM,
                to: to.split(",").map(address => address.trim()),
                reply_to: data.email,
                subject: `[Website] ${topicLabel}: ${data.name}`,
                text: [
                    `Name:  ${data.name}`,
                    `Email: ${data.email}`,
                    `Topic: ${topicLabel}`,
                    "",
                    data.message,
                    "",
                    "Sent from the Contact form on the Agentic AI Club website.",
                    "Reply to this email to answer the sender directly."
                ].join("\n")
            })
        });

        if (!response.ok) {
            console.error("contact: Resend error", response.status, await response.text());
            return res.status(502).json({ ok: false, error: "Email could not be sent" });
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("contact: request to Resend failed", error);
        return res.status(502).json({ ok: false, error: "Email could not be sent" });
    }
}
