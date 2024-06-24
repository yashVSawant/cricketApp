const signupPage = document.getElementById("signupPage");
const loginPage = document.getElementById("loginPage");

const signupDiv = document.getElementById("signupDiv");
const loginDiv = document.getElementById("loginDiv");

const signup = document.getElementById("signup");
const login = document.getElementById("login");
const host = 'http://localhost:3333';

loginPage.addEventListener('click',()=>{
    displayLogin();
})

signupPage.addEventListener('click',()=>{
    displaySignup();
})

signup.addEventListener('click',async()=>{
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const selectType = document.querySelector('input[name="playerType"]:checked');
    if(name ,email  ,password ,selectType){
        try {
            const playerType = selectType.id;
            console.log(name ,email  ,password ,playerType);
            await axios.post(`${host}/user/api/signup`,{name ,email  ,password ,playerType});
            alert('signup successfull!');
            displayLogin();
        } catch (error) {
            alert('someting went wrong');
        }
        
    }else{
        alert('please fill all fields')
    }
})

login.addEventListener('click',async()=>{
    const email = document.getElementById('LoginEmail').value;
    const password = document.getElementById('LoginPassword').value;
    if(email ,password){
        try {
            console.log(email ,password);
            const data = await axios.post(`${host}/user/api/login`,{email  ,password });
            console.log(data.data);
            localStorage.setItem('token',`bearer ${data.data.token}`);
            window.location.href = '../home/index.html';
        } catch (error) {
            console.log(error)
            alert('something went wrong');
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