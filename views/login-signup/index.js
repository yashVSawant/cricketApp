const signupPage = document.getElementById("signupPage");
const loginPage = document.getElementById("loginPage");

const signupDiv = document.getElementById("signupDiv");
const loginDiv = document.getElementById("loginDiv");

const signup = document.getElementById("signup");
const login = document.getElementById("login");

loginPage.addEventListener('click',()=>{
    displayLogin();
})

signupPage.addEventListener('click',()=>{
    displaySignup();
})

signup.addEventListener('click',async()=>{
    
    const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const selectType = document.querySelector('input[name="playerType"]:checked');
    if(name   ,password ,selectType){
        try {
            const playerType = selectType.id;
            console.log(name   ,password ,playerType);
            await axios.post('/auth/api/signup',{name  ,password ,playerType});
            alert('signup successfull!');
            displayLogin();
        } catch (err) {
            alert(err.response.data.message);
        }
        
    }else{
        alert('please fill all fields')
    }
})

login.addEventListener('click',async()=>{
    const name = document.getElementById('LoginUsername').value;
    const password = document.getElementById('LoginPassword').value;
    if(name ,password){
        try {
            console.log(name ,password);
            const data = await axios.post('/auth/api/login',{name  ,password });
            console.log(data.data);
            const link = data.data.link;
            localStorage.setItem('token',`bearer ${data.data.token}`);
            window.location.href = link;
        } catch (err) {
            alert(err.response.data.message);
        }
        
    }
})

function displayLogin(){
    signupDiv.style.display='none';
    loginDiv.style.display='flex';
}

function displaySignup(){
    signupDiv.style.display='flex';
    loginDiv.style.display='none';
}