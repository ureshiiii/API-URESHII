const createPath = (method, tags, summary, description, parameters, responses) => ({
  [method]: {
    tags,
    summary,
    description,
    parameters,
    responses,
  },
});

const createParameter = (name, required, description, type, example = null) => ({
  name,
  in: "query",
  required,
  description,
  schema: {
    type,
    ...(example && { example }),
  },
});

const createResponse = (code, description) => ({
  [code]: { description },
});

const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "Ureshii RestFul API",
    description: "Projects belajar API by Parhan",
    version: "1.0",
    termsOfService: "https://ureshii.my.id/public/dukungan/syarat-ketentuan.html",
    contact: {
      name: "Parhan",
      url: "https://ureshii.my.id",
      email: "parhan@ureshii.my.id",
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  tags: [
    { name: "AI", description: "Fitur Khusus AI" },
    { name: "Owner", description: "Khusus Owner!" },
    { name: "Tools", description: "Fitur Tools Menu" },
  ],
  paths: {
    "/api/ai/gemini": createPath(
      "get",
      ["AI"],
      "Google Gemini AI",
      "Tanya Gemini dari Google tentang apapun!",
      [
        createParameter("text", true, "Text / Pertanyaan", "string", "Tulis sebuah puisi tentang keindahan alam"),
        createParameter("logic", false, "Sifat / Logika / Prompt [ Opsional ]", "string", "Gunakan gaya bahasa puitis"),
        createParameter("model", false, "Model Gemini AI [ Opsional ]", "string"),
      ],
      {
        ...createResponse(200, "Successful response"),
        ...createResponse(400, "Missing text parameter"),
        ...createResponse(500, "Server error"),
      }
    ),
  },
};

module.exports = swaggerConfig;