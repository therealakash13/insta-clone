import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

// <----------Send Message----------> //
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      recieverId,
      message,
    });
    if (newMessage) conversation.messages.push(newMessage.id);

    await Promise.all([conversation.save(), newMessage.save()]);

    // Implement Socket Io

    return res.status(201).json({ newMessage, success: true });
  } catch (error) {
    console.log("Error from Send Message ---------->", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// <----------Get Message----------> //
export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;

    const conversation = await Conversation.find({
      participants: { $all: [senderId, recieverId] },
    });
    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    return res
      .status(200)
      .json({ success: true, messages: conversation?.messages });
  } catch (error) {
    console.log(
      "Error from Get Message @ Message Controller ---------->",
      error
    );
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
