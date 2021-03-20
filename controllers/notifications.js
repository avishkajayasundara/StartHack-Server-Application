const { sendNotificationToClient } = require("../firebase/notify");

exports.addMessage = async (req, res) => {
  const { name, message } = req.body;
  const columns = "name, message";
  const values = `'${name}', '${message}'`;
  try {
    //const data = await messagesModel.insertWithReturn(columns, values);
    const tokens = [
      "eaBwibWQzlqyEr0Q1mhOvI:APA91bEFvvgS5P76tOKVejtW8MixEGAJ_I_t8G5NnFg9HPw9129Agw2d1HOkWmBdATq1JMajLaoTEaZJcpwTQjWP4JmDLU-MqG9G8ap8wwSG8ItvZZo14TNC8R3swEMUOx8yonuYJhLw",
    ];
    const notificationData = {
      title: "New message",
      body: message,
    };
    sendNotificationToClient(tokens, notificationData);
    res.status(200).json({ messages: notificationData });
  } catch (err) {
    res.status(200).json({ messages: err.stack });
  }
};

exports.playlist = async (request, response) => {
  const { action, roomId, body } = request.body;
};
