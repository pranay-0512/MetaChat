const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

require("./db/connection");

//import files
const Users = require("./models/Users");
const Conversations = require("./models/Conversations");
const Messages = require("./models/Messages");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//for signup
app.post('/api/register', async (req, res, next) => {
  try {
      const { fullName, email, password } = req.body;

      if (!fullName || !email || !password) {
          res.status(400).send('Please fill all required fields');
      } else {
          const isAlreadyExist = await Users.findOne({ email });
          if (isAlreadyExist) {
              res.status(400).send('User already exists');
          } else {
              const newUser = new Users({ fullName, email });
              bcryptjs.hash(password, 10, (err, hashedPassword) => {
                  newUser.set('password', hashedPassword);
                  newUser.save();
                  next();
              })
              return res.status(200).send('User registered successfully');
          }
      }

  } catch (error) {
      console.log(error, 'Error')
  }
})
//for login
app.post('/api/login', async (req, res, next) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          res.status(400).send('Please fill all required fields');
      } else {
          const user = await Users.findOne({ email });
          if (!user) {
              res.status(400).send('User email or password is incorrect');
          } else {
              const validateUser = await bcryptjs.compare(password, user.password);
              if (!validateUser) {
                  res.status(400).send('User email or password is incorrect');
              } else {
                  const payload = {
                      userId: user._id,
                      email: user.email
                  }
                  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';

                  jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                      await Users.updateOne({ _id: user._id }, {
                          $set: { token }
                      })
                      user.save();
                      return res.status(200).json({ user: { id: user._id, email: user.email, fullName: user.fullName }, token: token })
                  })
              }
          }
      }

  } catch (error) {
      console.log(error, 'Error')
  }
})

// conversation id between 2 users
app.post("/api/conversation", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const conversation = await Conversations.findOne({
      $or: [
        { members: [senderId, receiverId] },
        { members: [receiverId, senderId] },
      ],
    });

    if (conversation) {
      res.status(400).send("Conversation already exists");
    } else {
      const newConversation = new Conversations({
        members: [senderId, receiverId],
      });
      await newConversation.save();
      res.status(200).send("Conversation created successfully");
    }
  } catch (error) {
    console.log(error, "Error");
    res.status(500).send("Server error");
  }
});

app.get("/api/conversation/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });
    const conversationUserData = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        const user = await Users.findById(receiverId);
        return {
          user: { email: user.email, fullName: user.fullName },
          conversationId: conversation._id,
        };
      })
    );
    res.status(200).json(conversationUserData);
  } catch (error) {
    console.log(error, "error");
  }
});

app.post("/api/message", async (req, res) => {
  try {
    const { conversationId, senderId, message } = req.body;
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log("error: ", error);
  }
});

app.get("/api/message/:conversationId", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await Messages.find({ conversationId });
    const messageData = await Promise.all(
      messages.map(async (text) => {
        const sender = await Users.findById(text.senderId);
        return {
          sender: { email: sender.email, fullName: sender.fullName },
          message: text.message,
          senderId: text.senderId,
        };
      })
    );
    res.status(200).json(messageData);
  } catch (error) {
    console.log("error", error);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await Users.find();
    const userName = await Promise.all(
      users.map(async (user) => {
        return {
          user: { fullName: user.fullName, email: user.email },
          userId: user._id,
        };
      })
    );
    res.status(200).json(userName);
  } catch (error) {
    console.log("error", error);
  }
});

app.get("/api/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log("error ", error);
  }
});

app.listen(PORT, () => {
  console.log("Running on PORT:", PORT);
});
