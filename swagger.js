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
        createParameter("logic", false, "Sifat / Prompt - Opsional", "string", "Gunakan gaya bahasa puitis"),
        createParameter("model", false, "Model Gemini AI - Opsional", "string"),
      ],
      {
        ...createResponse(200, "Successful response"),
        ...createResponse(400, "Missing text parameter"),
        ...createResponse(500, "Server error"),
      }
    ),
    "/api/ai/blackbox": createPath(
      "get",
      ["AI"],
      "Blackbox AI",
      "Tanya blackbox tentang apapun!",
      [
        createParameter("text", true, "Text / Pertanyaan", "string", "Tulis sebuah puisi tentang keindahan alam"),
        createParameter("logic", false, "Sifat / Prompt - Opsional", "string", "Gunakan gaya bahasa puitis"),
        createParameter("model", false, "Model Blackbox AI - Opsional", "string"),
      ],
      {
        ...createResponse(200, "Successful response"),
        ...createResponse(400, "Missing text parameter"),
        ...createResponse(500, "Server error"),
      }
    ),
    "/api/ai/removebg": createPath(
      "get",
      ["AI"],
      "RemoveBG",
      "Removebg gambar dengan AI",
      [
        createParameter("url", true, "Url gambar", "string", ""),
      ],
      {
        ...createResponse(200, "Successful response"),
        ...createResponse(400, "Missing url parameter"),
        ...createResponse(500, "Server error"),
      }
    ),
    "/api/data": createPath(
      "get",
      ["Owner"],
      "Get Data",
      "Get data dari database",
      [
        createParameter("key", true, "API Key", "string", ""),
        createParameter("type", true, "Type data", "string", "dataProduk"),
      ],
      {
        ...createResponse(200, "Successful response"),
        ...createResponse(400, "Type does not exist"),
        ...createResponse(403, "Wrong API Key"),
        ...createResponse(500, "Server error"),
      }
    ),
  },
};

module.exports = swaggerConfig;
