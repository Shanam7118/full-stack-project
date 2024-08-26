const showloggedusername = () => {
    const usernameelement = document.getElementById('logged-username');

    // find username from localstorage
    let user = localStorage.getItem('loggedInuser');
    if(user){
        user = JSON.parse(user);

    }

    // show username in the webpage
    usernameelement.innerText = user.userName;

};

const checkloggedinuser = () => {
    let user = localStorage.getItem('loggedInuser');
    if(user){
        user = JSON.parse(user);

    }
    else{
        window.location.href = "/index.html";
    }

};

const logout = () => {
    // clearing the local storage
    localStorage.clear();
    checkloggedinuser();
};



const fetchallposts = async () => {
    let data;
    

    try{
      const res = await fetch("http://localhost:5000/getallposts");
       data = await res.json();
       console.log ("data: ", data); 
       showallposts(data);
    }

    catch (err){
        console.log("error fetching data from server: ", err);

    }

}

const showallposts = (allposts) => {

    const postcontainer = document.getElementById('post-container');
    postcontainer.innerHTML = "";


    allposts.forEach (async (post)=> {
        const postdiv = document.createElement('div');
        postdiv.classList.add('post');


        postdiv.innerHTML = `
        <div class="post-header">
                <div class="post-user-image">
                    <img 
                         src=${post.posteduserimage}
                    />

                </div>
                <div class="post-username-time">
                    <p class="post-username">${post.postedusername}</p>
                    <div class="posted-time">
                        <span>${timedifference(`${post.postedtime}`)}</span>
                        <span> ago</span>

                    </div>

                </div>
                               
            </div>
            <div class="post-text">
                 <p class="post-text-content">
                 ${post.posttext}
                 </p>
            </div>

            <div class="post-image">
                <img 
                   src=${post.postimageurl}
                />

            </div>
        `;

        postcontainer.appendChild(postdiv);

        // comments under a post
         
        let postcomments =  await fetchallcommentsofapost(post.postid);
        console.log("postcomments: ", postcomments);

        postcomments.forEach((comment) => {

            const commentsholderdiv = document.createElement('div');
            commentsholderdiv.classList.add('comments-holder');

            commentsholderdiv.innerHTML = `

              <div class="comment">
                    <div class="comment-user-image">
                        <img
                        
                            src=${comment.commenteduserimage}
                        
                        />
                    </div>

                    <div class="comment-text-container">
                         <h4>${comment.commentedusername}</h4>
                         <p class="comment-text">${comment.commentedtext}</p>
                    </div>
                </div>
            
            
            `;

            postdiv.appendChild(commentsholderdiv);


        });

        //adding a new comment to the post

        const addnewcommentdiv = document.createElement("div");
        addnewcommentdiv.classList.add("postcomment-holder");
        addnewcommentdiv.innerHTML = `
                    <div class="post-comment-input-field-holder">
                    <input type="text" placeholder="post your comment" class="postcomment-input-field" id="postcomment-input-for-postid-${post.postid}">

                </div>
                <div class="comment-btn-holder">
                    <button onClick=handlepostcomment(${post.postid}) id="comment-btn" class="postcomment-btn">
                        comment
                    </button>

                </div>
        
        
           `;

           postdiv.appendChild(addnewcommentdiv);

    });
};


const handlepostcomment = async(postid) => {
    //collecting logged in user id from local storage

    let user = localStorage.getItem('loggedInuser');
    if(user){
        user = JSON.parse(user);
    }
    const commenteduserid = user.userId;
    
    // getting comment text from input

    const commenttextelement = document.getElementById(`postcomment-input-for-postid-${postid}`);

    const commentedtext = commenttextelement.value;
   
    // current time of the comment

    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
       let timeofcomment = now.toISOString();

       const commentobject = {
        commentofpostid : postid,
        commenteduserid	: commenteduserid,
        commentedtext : commentedtext,
        commentedtime : timeofcomment,
       };

       console.log(commentobject);

       try{
        const res = await fetch ('http://localhost:5000/postcomment', {
         method: "post",
         headers:{
            "content-type": "application/json",
          },
          body: JSON.stringify(commentobject),
        });
        const data = await res.json();
       }
       catch(err){
         console.log("error while sending data to the server: ", err);
       }
       finally{
        location.reload();
       }
   
};

const fetchallcommentsofapost = async (postid) => {
   

    let commentsofpost = [] ;

    try {
      const res = await fetch(`http://localhost:5000/getallcomments/${postid}`);
       commentsofpost = await res.json();
    }

    catch(err){

         console.log("error fetching comments from the server: ", err);
    }
    
    finally{
        return commentsofpost;
    }

};


const handleaddnewpost = async () => {
    // getting userid from localstorage
    let user = localStorage.getItem('loggedInuser');
    if(user){
        user = JSON.parse(user);
    }
    const posteduserid = user.userId;


    // current time of the post

    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
       let timeofpost = now.toISOString();

       // post text

       const posttextelement = document.getElementById('newpost-text');
       const posttext = posttextelement.value;

       // post image

       const postimageelement = document.getElementById('newpost-image');
       const postimageurl = postimageelement.value;

       // creating a post object

       const postobject = {
        posteduserid : posteduserid,
        postedtime : timeofpost,
        posttext : posttext,
        postimageurl : postimageurl,
       };

       try{
        const res = await fetch ('http://localhost:5000/addnewpost', {
         method: "post",
         headers:{
            "content-type": "application/json",
          },
          body: JSON.stringify(postobject),
        });
        const data = await res.json();
       }
       catch(err){
         console.log("error while sending data to the server: ", err);
       }
       finally{
        location.reload();
       }

      


};


// this function automatically runs
fetchallposts();
//  showloggedusername();
//  checkloggedinuser();
