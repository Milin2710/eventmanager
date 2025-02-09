const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const multer = require("multer");
const uploadImages = require("./uploads/uploadImage");
const Event = require("./models/event");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// mongoose.connect(process.env.MONGO_URI);
mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log("Successfully connected to MongoDB!");
  });

app.post("/register", upload.single("profilepic"), async (req, res) => {
  const { name, email, password } = req.body;
  const profilePictureUrl = req.file
    ? (await uploadImages([req.file]))[0]
    : "null";
  try {
    const finduser = await User.findOne({ email: email });
    if (finduser) {
      return res
        .status(400)
        .json({ status: "alreadyexists", message: "Already registered email" });
    }
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      profilepic: profilePictureUrl,
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(400).json("User not found");
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email, id: userDoc._id },
        "oierluhkt347rhye4jeikrhy8iwerh483ijrehtr84irjoqpz",
        {},
        (err, tokeneventlogin) => {
          if (err) {
            console.error(err);
            return res.status(500).json("Failed to generate tokeneventlogin");
          }
          res.cookie("tokeneventlogin", tokeneventlogin).json({
            id: userDoc._id,
            name: userDoc.name,
            email,
          });
        }
      );
    } else {
      res.status(400).json("Wrong credentials");
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

app.post("/getuserdata", (req, res) => {
  const { tokeneventlogin } = req.cookies;
  try {
    if (!tokeneventlogin) {
      return res.status(401).json("No tokensocin provided");
    }
    jwt.verify(
      tokeneventlogin,
      "oierluhkt347rhye4jeikrhy8iwerh483ijrehtr84irjoqpz",
      async (err, info) => {
        console.log(info);
        if (err) {
          console.error("tokeneventlogin verification error:", err);
          return res.status(401).json("Invalid tokeneventlogin");
        }
        const email = info.email;
        const userDoc = await User.findOne({ email });
        if (userDoc) {
          const resdata = {
            name: userDoc.name,
            email: userDoc.email,
            profilepic: userDoc.profilepic
          };
          res.json(resdata);
        }
      }
    );
  } catch (e) {
    console.error(e);
  }
});

app.post("/createnewevent", async (req, res) => {
  const {
    admin,
    adminemail,
    eventname,
    eventdesc,
    eventdate,
    eventmemberscapacity,
  } = req.body;
  try {
    const user = await User.find({ email: adminemail });
    if (user.length === 0) {
      return res
        .status(400)
        .json({ status: "adminnotfound", message: "Admin not found" });
    }
    const newevent = await Event.create({
      admin,
      adminemail,
      eventname,
      eventdesc,
      eventdate,
      eventmemberscapacity,
      members: [adminemail],
    });
    res.json(newevent);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
});

app.post("/getevents", async (req, res) => {
  const { name, email } = req.body;
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const skip = (page - 1) * limit;
  try {
    const events = await Event.find({ adminemail: { $ne: email } })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / limit);

    res.json({
      events,
      currentPage: page,
      totalPages,
      totalEvents,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/getadminevents", async (req, res) => {
  const { name, email } = req.body;
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const skip = (page - 1) * limit;
  try {
    const events = await Event.find({ adminemail: email })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / limit) - 1;

    res.json({ events, currentPage: page, totalPages, totalEvents });
  } catch (e) {
    console.error(e);
  }
});

app.post("/joinevent", async (req, res) => {
  const { email, id } = req.body;
  const event = await Event.find({ _id: id });
  event[0].members.push(email);
  await event[0].save();
  res.json({ message: "joined" });
});

app.post("/logout", (req, res) => {
  res.cookie("tokeneventlogin", "").json("Logged out");
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
