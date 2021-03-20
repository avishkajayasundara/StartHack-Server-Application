const song = require("../models/song");
const { multerUpload } = require("../middleware/multer");
const firebaseConfig = require("../config/fb_config");
const { admin } = require("../admin");
const fs = require("fs");

const Song = require("../models/song");
const Playlist = require("../models/playlist");

exports.upload_song = (request, response) => {
  multerUpload(request, response, async (error) => {
    if (error) {
      //instanceof multer.MulterError

      if (error.code == "LIMIT_FILE_SIZE") {
        error.message = "File Size is too large.";
      }
      return response.status(500).json({ error });
    } else {
      if (!request.file) {
        return response
          .status(500)
          .json({ error: { message: "File not found" } });
      }

      try {
        let song = {
          name: request.body.name,
        };

        if (!song.name)
          return response.status(400).json({ error: "Song name is required" });

        await admin
          .storage()
          .bucket()
          .upload(`public/tmp/${request.file.filename}`, {
            resumable: false,
            metadata: {
              metadata: {
                contentType: request.file.mimetype,
              },
            },
          });

        song.url = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${request.file.filename}?alt=media`;

        await Song.create(song);

        //Delete file from temp storage
        fs.unlinkSync(`public/tmp/${request.file.filename}`);

        return response.status(200).json({ song });
      } catch (error) {
        console.log(error);
        return response.status(500).json({ error });
      }
    }
  });
};

exports.create_playlist = async (request, response) => {
  try {
    const name = request.body.name;

    if (!name) return response.status(400).json({ error: "Name is required" });

    const remaining = await Playlist.find({ name });

    if (remaining.length > 0)
      return response
        .status(400)
        .json({ error: "Playlist with same name exists" });

    const playlist = await Playlist.create({ name });

    return response.status(200).json({ playlist });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
};
