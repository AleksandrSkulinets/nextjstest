// pages/api/sendOrderEmail.js

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, phone, cart } = req.body;

    // Create a transport using SMTP or a service like SendGrid
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can also use other services like SendGrid, Amazon SES, etc.
      auth: {
        user: process.env.EMAIL_USER, // Set your email here (for example: your-email@gmail.com)
        pass: process.env.EMAIL_PASS, // Use App password (recommended) if using Gmail
      },
    });

    // Email for user confirmation
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // User's email
      subject: "Order Confirmation",
      text: `Hello ${name},\n\nThank you for your order!\n\nOrder Details:\n\nName: ${name}\nPhone: ${phone}\n\nOrder items:\n${cart
        .map(
          (item) => `Product: ${item.prodname} - $${item.price}`
        )
        .join("\n")}\n\nThank you for shopping with us!`,
    };

    // Email for admin notification
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin's email (set in .env.local)
      subject: "New Order Received",
      text: `New order received from ${name}.\n\nDetails:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nOrder items:\n${cart
        .map(
          (item) => `Product: ${item.prodname} - $${item.price}`
        )
        .join("\n")}\n\nPlease process the order.`,
    };

    try {
      // Send email to user
      await transporter.sendMail(userMailOptions);

      // Send email to admin
      await transporter.sendMail(adminMailOptions);

      // Respond with success
      res.status(200).json({ message: "Order placed and emails sent successfully." });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending emails." });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
