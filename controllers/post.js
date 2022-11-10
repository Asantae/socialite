const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

exports.createPost = async (req, res) => {
  const caption = req.body.caption
  const id = req.session.user
  const user = await User.findById(req.session.user).lean();
  try {
      await Post.create({
          caption: caption,
          id: id,
          username: user.username,
      })
      res.redirect("/home")
  } catch(error){
      return res.json({ status: 'error', error: error })
  }
}

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    const comments = await Comment.find({ post: postId });
    const user = await User.findOne({ _id: req.session.user });

    let timingArr = [];
    let now = new Date();
    let subtractedDate = now - post.createdAt;
    let seconds = subtractedDate / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;
    if (seconds < 59) {
      let timeAgo = Math.trunc(seconds) + "s";
      timingArr.splice(0, 0, timeAgo);
    } else if (minutes < 59) {
      let timeAgo = Math.trunc(minutes) + "m";
      timingArr.splice(0, 0, timeAgo);
    } else if (hours < 24) {
      let timeAgo = Math.trunc(hours) + "h";
      timingArr.splice(0, 0, timeAgo);
    } else {
      let timeAgo = post.createdAt;
      timingArr.splice(0, 0, timeAgo);
    }

    let timingArr2 = [];
    for(let i = 0; i < comments.length; i++){
      let subtractedDate = now - comments[i].createdAt;
      let seconds = subtractedDate / 1000;
      let minutes = seconds / 60;
      let hours = minutes / 60;
      if (seconds < 59) {
        let timeAgo = Math.trunc(seconds) + "s";
        timingArr2.splice(i, 0, timeAgo);
      } else if (minutes < 59) {
        let timeAgo = Math.trunc(minutes) + "m";
        timingArr2.splice(i, 0, timeAgo);
      } else if (hours < 24) {
        let timeAgo = Math.trunc(hours) + "h";
        timingArr2.splice(i, 0, timeAgo);
      } else {
        let timeAgo = comments[i].createdAt;
        timingArr2.splice(i, 0, timeAgo);
      }
    }
    res.render("post.ejs", { post: post, comments: comments, username: user.username, timePosted: timingArr, timeCommented: timingArr2 });
  } catch(err) {
    console.log(err); 
    res.redirect("/home");
  }

}

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id    
    const likes = await Post.findOne({ _id: postId })

    await Post.findOneAndUpdate({ 
      _id: postId
    }, {
      likes: likes.likes + 1
    });
    res.json({ status: 'ok'})
  } catch (err){
    res.json({ error: err, status: 'error'})
    console.log(err);
  }
}

exports.removeLike = async (req, res) => {
  try {
    const postId = req.params.id    
    const likes = await Post.findOne({ _id: postId })
    if(likes.likes > 0){
      await Post.findOneAndUpdate({ 
      _id: postId
    }, {
        likes: likes.likes - 1
    });
      res.json({ status: 'ok'})
    }
  } catch (err){
    res.json({ error: err, status: 'error'})
    console.log(err);
  }

}


exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id
    await Post.findOneAndDelete({ _id: postId })
    res.redirect("/home")
  } catch (err){
    console.log(err);
    res.redirect("/home")
  }
}