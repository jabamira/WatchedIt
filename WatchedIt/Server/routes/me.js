const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      login: req.user.login,
    },
  });
}); 

module.exports = router;
