// backend/generate_api_doc.js
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require("docx");
const fs = require("fs");
const path = require("path");

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Robo Shop",
              bold: true,
              size: 32,
              color: "4F46E5", // Indigo-600
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Backend API Documentation",
              bold: true,
              size: 40,
              color: "111827", // Gray-900
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Comprehensive Guide to REST Endpoints, Payloads, & Responses",
              italics: true,
              size: 24,
              color: "6B7280", // Gray-500
            }),
          ],
        }),
        new Paragraph({ text: "", spacing: { after: 200 } }),

        // Introduction
        new Paragraph({
          children: [
            new TextRun({
              text: "Introduction & Authentication Overview",
              bold: true,
              size: 28,
              color: "4F46E5",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "All requests, unless publicly specified, require JWT header authentication. Logins verify admin or normal user sessions. JWT tokens must be included in the Request Header as: ",
              size: 22,
            }),
            new TextRun({
              text: "Authorization: Bearer <JWT_TOKEN>",
              bold: true,
              color: "B91C1C", // Red-700
              size: 22,
            }),
          ],
          spacing: { after: 300 },
        }),

        // 1. User & Authentication Endpoints
        new Paragraph({
          children: [
            new TextRun({
              text: "1. Users & Authentication",
              bold: true,
              size: 26,
              color: "312E81", // Indigo-900
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),

        // POST signup
        new Paragraph({
          children: [
            new TextRun({ text: "• POST /api/users/signup ", bold: true, color: "059669" }), // Emerald-600
            new TextRun({ text: "(Public) - Registers a new customer store account.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Payload: ", bold: true, size: 18 }),
            new TextRun({ text: "{ \"name\": \"Rahul Sharma\", \"mobile\": \"9876543210\", \"email\": \"rahul@gmail.com\", \"password\": \"123456\" }", color: "4B5563", size: 18 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Success Response (201): ", bold: true, size: 18 }),
            new TextRun({ text: "{ \"message\": \"User created successfully\", \"token\": \"<JWT_Token>\", \"user\": { \"id\": \"<Id>\", \"name\": \"Rahul Sharma\", \"email\": \"rahul@gmail.com\" } }", color: "4B5563", size: 18 }),
          ],
          spacing: { after: 150 },
        }),

        // POST login
        new Paragraph({
          children: [
            new TextRun({ text: "• POST /api/users/login ", bold: true, color: "059669" }),
            new TextRun({ text: "(Public) - Unified login portal for Admins and Users. Authenticates email and password. Redirects admins if the user has admin flags in database.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Payload: ", bold: true, size: 18 }),
            new TextRun({ text: "{ \"email\": \"admin@gmail.com\", \"password\": \"admin123\" }", color: "4B5563", size: 18 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Success Response (200): ", bold: true, size: 18 }),
            new TextRun({ text: "{ \"token\": \"<JWT_Token>\", \"isAdmin\": true, \"user\": { \"id\": \"<Id>\", \"name\": \"Administrator\" } }", color: "4B5563", size: 18 }),
          ],
          spacing: { after: 150 },
        }),

        // GET users
        new Paragraph({
          children: [
            new TextRun({ text: "• GET /api/users ", bold: true, color: "2563EB" }), // Blue-600
            new TextRun({ text: "(Admin Only) - Retrieves all registered user login entries.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Success Response (200): ", bold: true, size: 18 }),
            new TextRun({ text: "[ { \"_id\": \"<Id>\", \"name\": \"Rahul\", \"mobile\": \"9876543210\", \"email\": \"rahul@gmail.com\", \"plainPassword\": \"123456\" } ]", color: "4B5563", size: 18 }),
          ],
          spacing: { after: 150 },
        }),

        // PUT users
        new Paragraph({
          children: [
            new TextRun({ text: "• PUT /api/users/:id ", bold: true, color: "D97706" }), // Amber-600
            new TextRun({ text: "(Admin Only) - Modifies user metadata, email, password, or mobile number.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Payload: ", bold: true, size: 18 }),
            new TextRun({ text: "{ \"name\": \"Rahul S.\", \"email\": \"rahul.new@gmail.com\", \"password\": \"newpassword123\" }", color: "4B5563", size: 18 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Success Response (200): ", bold: true, size: 18 }),
            new TextRun({ text: "{ \"message\": \"User updated successfully\" }", color: "4B5563", size: 18 }),
          ],
          spacing: { after: 150 },
        }),

        // DELETE users
        new Paragraph({
          children: [
            new TextRun({ text: "• DELETE /api/users/:id ", bold: true, color: "DC2626" }), // Red-600
            new TextRun({ text: "(Admin Only) - Removes a user login account.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Success Response (200): ", bold: true, size: 18 }),
            new TextRun({ text: "{ \"message\": \"User deleted successfully\" }", color: "4B5563", size: 18 }),
          ],
          spacing: { after: 300 },
        }),

        // 2. Product Endpoints
        new Paragraph({
          children: [
            new TextRun({
              text: "2. Products & Inventory",
              bold: true,
              size: 26,
              color: "312E81",
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),

        // GET products
        new Paragraph({
          children: [
            new TextRun({ text: "• GET /api/products ", bold: true, color: "2563EB" }),
            new TextRun({ text: "(Public) - Returns list of all products in database.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Success Response (200): ", bold: true, size: 18 }),
            new TextRun({ text: "[ { \"_id\": \"<Id>\", \"title\": \"Smart IoT Node\", \"category\": \"IoT Devices\", \"price\": 1299.00, \"hostingLink\": \"myiotpreview.com\", \"images\": [\"/uploads/img.png\"] } ]", color: "4B5563", size: 18 }),
          ],
          spacing: { after: 150 },
        }),

        // POST products
        new Paragraph({
          children: [
            new TextRun({ text: "• POST /api/products ", bold: true, color: "059669" }),
            new TextRun({ text: "(Admin Only) - Creates new product. Supports multer file/video upload files.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Form Payload: ", bold: true, size: 18 }),
            new TextRun({ text: "title, category, price, description, discount, hostingLink, images (file array), videos (file array)", color: "4B5563", size: 18 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Success Response (201): ", bold: true, size: 18 }),
            new TextRun({ text: "{ \"message\": \"Product added successfully\", \"product\": { \"title\": \"Smart IoT Node\" } }", color: "4B5563", size: 18 }),
          ],
          spacing: { after: 150 },
        }),

        // PUT products
        new Paragraph({
          children: [
            new TextRun({ text: "• PUT /api/products/:id ", bold: true, color: "D97706" }),
            new TextRun({ text: "(Admin Only) - Updates existing product attributes, images, videos, or hostingLink.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Success Response (200): ", bold: true, size: 18 }),
            new TextRun({ text: "{ \"message\": \"Product updated successfully\" }", color: "4B5563", size: 18 }),
          ],
          spacing: { after: 150 },
        }),

        // DELETE products
        new Paragraph({
          children: [
            new TextRun({ text: "• DELETE /api/products/:id ", bold: true, color: "DC2626" }),
            new TextRun({ text: "(Admin Only) - Removes a product.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    - Success Response (200): ", bold: true, size: 18 }),
            new TextRun({ text: "{ \"message\": \"Product deleted successfully\" }", color: "4B5563", size: 18 }),
          ],
          spacing: { after: 300 },
        }),

        // 3. Category Endpoints
        new Paragraph({
          children: [
            new TextRun({
              text: "3. Categories Management",
              bold: true,
              size: 26,
              color: "312E81",
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• GET /api/categories ", bold: true, color: "2563EB" }),
            new TextRun({ text: "(Public) - Retrieves list of all dynamic categories.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• POST /api/categories ", bold: true, color: "059669" }),
            new TextRun({ text: "(Admin Only) - Adds a new category name (Payload: { \"name\": \"AI Robotics\" }).", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• DELETE /api/categories/:id ", bold: true, color: "DC2626" }),
            new TextRun({ text: "(Admin Only) - Deletes category entry.", size: 20 }),
          ],
          spacing: { after: 300 },
        }),

        // 4. Contact Details & Customer Interest
        new Paragraph({
          children: [
            new TextRun({
              text: "4. Dynamic Contact Details & Customer Interest Submission",
              bold: true,
              size: 26,
              color: "312E81",
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• GET /api/contact/info ", bold: true, color: "2563EB" }),
            new TextRun({ text: "(Public) - Returns current dynamic contact details (sales, support, inquiries, location).", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• PUT /api/contact/info ", bold: true, color: "D97706" }),
            new TextRun({ text: "(Admin Only) - Saves updated contact details (Payload: { \"ourLocation\": \"...\", \"salesLine\": \"...\" }).", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• POST /api/customers ", bold: true, color: "059669" }),
            new TextRun({ text: "(Public) - Customer submits contact interest callback request for a product (name, mobile, address, productName, productId).", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• GET /api/customers ", bold: true, color: "2563EB" }),
            new TextRun({ text: "(Admin Only) - Lists all submitted customer call-back interests.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• DELETE /api/customers/:id ", bold: true, color: "DC2626" }),
            new TextRun({ text: "(Admin Only) - Deletes interest submission entry.", size: 20 }),
          ],
          spacing: { after: 300 },
        }),

        // 5. Dynamic Footer Settings
        new Paragraph({
          children: [
            new TextRun({
              text: "5. Footer Settings configurations",
              bold: true,
              size: 26,
              color: "312E81",
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• GET /api/footer ", bold: true, color: "2563EB" }),
            new TextRun({ text: "(Public) - Fetches brand descriptions, copyright statements, and product/service list headers displayed in footer.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• PUT /api/footer ", bold: true, color: "D97706" }),
            new TextRun({ text: "(Admin Only) - Saves modified brand description, product listings, service listings, copyright parameters.", size: 20 }),
          ],
          spacing: { after: 300 },
        }),

        // 6. Project Gallery & Services
        new Paragraph({
          children: [
            new TextRun({
              text: "6. Project Gallery & Services",
              bold: true,
              size: 26,
              color: "312E81",
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• GET /api/gallery ", bold: true, color: "2563EB" }),
            new TextRun({ text: "(Public) - Returns all projects added to gallery showcase.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• POST /api/gallery ", bold: true, color: "059669" }),
            new TextRun({ text: "(Admin Only) - Inserts new project showcase item with video, image caption, descriptive links.", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• GET /api/services ", bold: true, color: "2563EB" }),
            new TextRun({ text: "(Public) - Returns list of professional services (prototyping, custom design, AI).", size: 20 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• POST /api/services ", bold: true, color: "059669" }),
            new TextRun({ text: "(Admin Only) - Adds new professional service card (name, description, logo identifier).", size: 20 }),
          ],
        }),
      ],
    },
  ],
});

const outputPath = path.join(__dirname, "..", "API_Documentation.docx");

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Success: Created docx at " + outputPath);
}).catch((err) => {
  console.error("Error creating docx: ", err);
});
