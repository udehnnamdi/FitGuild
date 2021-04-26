const mongoose = require('mongoose');
const cities = require('./cities');
const { groups, descriptors } = require('./seedHelpers');
const Guildbase = require('../models/guildbase');

mongoose.connect('mongodb://localhost:27017/fit-guild', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Guildbase.deleteMany({});
    for (let i = 0; i < 500; i++) {
        const random600 = Math.floor(Math.random() * 612);
        const fee = Math.floor(Math.random() * 5) + 5;
        const guild = new Guildbase({
            author: '6086519e7b02c53064ecc89d',
            location: `${cities[random600].city}, ${cities[random600].admin_name}`,
            title: `${sample(descriptors)} ${sample(groups)}`,
            description: 'Simply the best',
            fee,
            geometry: { 
                type: 'Point', 
                coordinates: [ 
                    cities[random600].lng,
                    cities[random600].lat
                 ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dlreib63z/image/upload/v1619415513/FitGuild/xl5apxf4oz7nqcfntfae.jpg',
                  filename: 'FitGuild/xl5apxf4oz7nqcfntfae'
                },
                {
                  url: 'https://res.cloudinary.com/dlreib63z/image/upload/v1619415968/FitGuild/rzehriio3tp5yhszmrlk.jpg',
                  filename: 'FitGuild/rzehriio3tp5yhszmrlk'
                }
              ]
        })
        await guild.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})