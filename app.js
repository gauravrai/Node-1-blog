const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();
const hbs = require('express-handlebars');
const configuration = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const {selectOption} = require('./config/customFunction');
const passport = require('passport');


//configure mongo
mongoose.connect(configuration.connectionString, {useNewUrlParser: true})
    .then(response =>{
        console.log('DB connected');
    }).catch(error =>{
        console.log('Error: ' + error);
    }); 

//configure express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/public', express.static(path.join(__dirname + "/public")));
app.engine('handlebars', hbs({defaultLayout: 'default', helpers: {select: selectOption}}));

app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use(configuration.globalVariables);
app.use(fileUpload());
app.set('view engine', 'handlebars');


//routes
const defaultRoutes = require('./routes/defaultroutes');
const adminRoutes = require('./routes/adminroutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


app.listen(configuration.PORT, () =>{
    console.log('Server is running');
});