const handlelogin = async () => {
    const useridInput = document.getElementById('user-id');
    const passwordInput = document.getElementById('password');

    const userid = useridInput.value;
    const password = passwordInput.value;


    const user = {
        userid: userid,
        password: password,
    };

    const userinfo = await fetchuserInfo(user);
     console.log(userinfo);

    const errorElement = document.getElementById("user-login-error");
    //user data did not match with database
    if (userinfo.length === 0) {
        errorElement.classList.remove("hidden");
    }
    else {
        errorElement.classList.add("hidden");

        //save user information before jumping to the next page
        localStorage.setItem("loggedInuser", JSON.stringify(userinfo[0]));

        //then jump
        window.location.href = "/post.html";
    }

};

const fetchuserInfo = async(user) => {
    let data;
    try{
    const res = await fetch('http://localhost:5000/getuserInfo',{
        method: 'POST',
        headers: {
            "content-type": "application/json",

        },
        body: JSON.stringify(user),

    });
    data = await res.json();

}

catch (err){
console.log("error connecting to the server: ", err);

}

finally{
   
    return data;

}

};