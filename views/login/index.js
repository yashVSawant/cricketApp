const login = document.getElementById("login");
const signup = document.getElementById('signup');

login.addEventListener('click',async(e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    if(name ,password){
        try {
            const data = await axios.post('/auth/api/login',{name  ,password });
            console.log(data.data);
            const link = data.data.link;
            localStorage.setItem('token',`Bearer ${data.data.token}`);
            localStorage.setItem('userName',name);
            
            window.location.href = link;
        } catch (err) {
            alert(err.response.data.message);
        }
        
    }
})

signup.onclick = ()=>{
    location.href = '../signup/index.html'
}