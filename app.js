const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
require('dotenv').config()
const connectDB = require('./db/connect')
const Post = require('./models/Post')

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//Global Varibales
const posts = [];

app.get('/', (req, res) => {
  res.render('home' ,{data:homeStartingContent,posts:posts});
});

app.get('/allposts',async (req, res, next) => {
  // const { id: postID } = req.params
  const post = await Post.find({})
  if (!post) {
    return next(createCustomError(`No task `, 404))
  }

  res.status(200).json({ post })
}
)

app.get('/about',(req,res)=>{
  res.render('about',{data:aboutContent});
});


app.get('/contact',(req,res)=>{
  res.render('contact',{data:contactContent});
  
});


app.get('/compose',(req,res)=>{
  res.render('compose');
});


app.post('/compose',async(req,res)=>{
  var post ={
    title:req.body.postTitle,
    content:req.body.postBody
  };
  const singlePost = await Post.create({
    title:req.body.postTitle,
    text:req.body.postBody
  })
  // res.status(201).json({singlePost})
  posts.push(post);
  res.redirect('/');
  console.log('post added to DB');
  });

app.get('/posts/:postName',function(req,res){
    const requestedTitle = _.lowerCase(req.params.postName);
    posts.forEach(function(post){
      const storedTitle = _.lowerCase(post.title);
      if(storedTitle === requestedTitle){
       
        res.render('post',{
          title:post.title,
          content:post.content
        });
      }
    });
  });
  


const start = async()=>{
  try{
    await connectDB(process.env.MONGODB_URI)
    app.listen(3000, function() {
      console.log("Server started on port 3000");
    });
  }catch(error){
    console.log(error);
  }
}

start()

