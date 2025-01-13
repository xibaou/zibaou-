
const canvafy = require("canvafy");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const { apiKey, displayName, username, comment, avatar, theme } = req.query;

  // Validasi API key
  if (!apiKey) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  } else if (!allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Apikey not found",
    });
  }

  // Validasi parameter
  if (!displayName || !username || !comment || !avatar) {
    return res.status(400).json({
      error: "Semua parameter (displayName, username, comment, avatar) wajib diisi!",
    });
  }

  try {
    // Membuat kartu tweet dengan Canvafy
    const tweet = await new canvafy.Tweet()
      .setTheme(theme || "light") // Default ke 'light' jika tema tidak disediakan
      .setUser({ displayName, username })
      .setVerified(true) // Anggap pengguna terverifikasi (bisa disesuaikan)
      .setComment(comment)
      .setAvatar(avatar)
      .build();

    // Mengembalikan buffer sebagai respons
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(tweet);
  } catch (error) {
    console.error("An error occurred:", error);

    res.status(500).json({
      error: "Ada masalah saat membuat kartu tweet. Silakan coba lagi nanti.",
    });
  }
};
