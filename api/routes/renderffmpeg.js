import { Router } from 'express';
const router = Router();
const ffmpeg = require('fluent-ffmpeg');
import path from 'path';
const glob = require("glob")
const folder = path.join(__dirname, '../../static/media');

router.get('/', async (req, res) => {
    let io = req.app.get('socketio');
    let fileName = req.query['fname']
    let format = req.query['format']
    let channels = req.query['channels']
    let bitrate = req.query['bitrate']
    let startTime = req.query['startTime']
    let duration = req.query['duration']

    let outputFilename, inputFilename;

    try {
        let files = glob.sync('**/' + fileName, { cwd: folder })

        inputFilename = path.resolve(folder + '/' + files[0]);
        outputFilename = path.resolve(folder + '/' + files[0].split('/')[0], fileName.split('.')[0] + '.' + format);
    } catch (error) {
        console.log(error)
    }

    ffmpeg(inputFilename)
        // .inputFormat('webm')
        // .withAudioCodec("libmp3lame")
        .setStartTime(startTime)
        .setDuration(duration)
        .audioBitrate(bitrate)
        .audioChannels(channels)
        .format(format)
        .on('start', function () {
            io.emit('rendering_start')
        })
        .on('progress', function (info) {
            console.log('progress ' + info.percent.toFixed(0) + '%');
            io.emit('rendering_progress', info.percent.toFixed(0))
        })
        .on('end', function () {
            console.log('done processing input stream');
            io.emit('rendering_end')
            res.sendStatus(200)
        })
        .on('error', function (err) {
            console.log('an error happened: ' + err.message);
            res.json(err)
        })
        .save(outputFilename);

})
export default router;