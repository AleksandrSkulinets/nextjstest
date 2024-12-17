import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    // Parse incoming JSON data
    const { name, email, phone, cart } = await req.json();

    if (!name || !email || !phone || !cart) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400 }
      );
    }

    // Configure Nodemailer transporter using MailSlurp SMTP
    const transporter = nodemailer.createTransport({
      host: "mailslurp.mx", // MailSlurp SMTP host
      port: 2465, // Secure SMTP port
      secure: true, // Use TLS
      auth: {
        user: "DMzgG5WyIag9IPe00vYOMGPkljQkDHuu", // SMTP username
        pass: "zAIMfyQvP9wAvJrVkjy8eSm9E1X6RxC2", // SMTP password
      },
    });

    // Generate order table as an HTML string
    const orderTable = `
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Product</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${cart
            .map(
              (item) => `
              <tr>
                <td>${item.prodname}</td>
                <td>$${item.price}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // Email template with HTML
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Order Confirmation</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for your order! Here are the details:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Order Items:</strong></p>
        ${orderTable}
        <p style="margin-top: 20px;">Thank you for shopping with us!</p>
      </div>
    `;

    // Email options for user
    const userMailOptions = {
      from: "noreply@example.com", // Replace with your domain email
      to: email,
      subject: "Order Confirmation",
      html: emailHTML, // Use HTML template
    };

    // Email options for admin
    const adminMailOptions = {
      from: "noreply@example.com",
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Received",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #f44336;">New Order Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Order Items:</strong></p>
          ${orderTable}
        </div>
      `,
    };

    // Send email to user
    await transporter.sendMail(userMailOptions);

    // Send email to admin
    await transporter.sendMail(adminMailOptions);

    // Respond with success
    return new Response(
      JSON.stringify({ message: "Order placed and emails sent successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in sendOrderEmail API:", error);
    return new Response(
      JSON.stringify({ error: "Error sending emails. Please try again later." }),
      { status: 500 }
    );
  }
}
