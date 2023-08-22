const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const mongoDB = "mongodb://127.0.0.1:27017/bgdb";
const app = express();
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.set("view engine", "ejs"); // for ejs file
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
//----------------------------------------------------------->>>
// MongoDB connections
(async () => {
  try {
    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();
// ------------------------------------------------------------->>>
//creating Schema for Mongo Datbase----------------------------->>>
const postSchema = {
  title: { type: "String", required: true },
  content: { type: "String", required: true },
};
//creating mongoose model act's as objects---------------------->>>
const Post = mongoose.model("Post", postSchema);

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  console.log(req.body);
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

  const post = new Post({
    title: postTitle,
    content: postBody,
  });
  post.save();
  res.redirect("/");
});

app.get("/", async function (req, res) {
  try {
    // Retrieve all posts from the database
    const posts = await Post.find({});

    // Render the home page view with the list of posts
    res.render("home", { posts: posts });
  } catch (err) {
    console.error(err);
    // Handle the error, e.g., by rendering an error page
    res.render("error", {
      errorMessage: "An error occurred while fetching posts.",
    });
  }
});
app.post("/delete", function (req, res) {
  const d = req.body.checkbox;
  Post.findByIdAndRemove(d)
    .then(() => {
      console.log("Deleted");
      res.redirect("/");
    })
    .catch((error) => {
      console.log("fail:", error);
    });
});


app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.listen(3000, function () {
  console.log("Running");
});
