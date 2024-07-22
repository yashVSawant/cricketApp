const login = document.getElementById("login");


login.addEventListener('click',async()=>{
    const name = document.getElementById('LoginUsername').value;
    const password = document.getElementById('LoginPassword').value;
    if(name ,password){
        try {
            const data = await axios.post('/auth/api/admin/login',{name  ,password });
            localStorage.setItem('token',`bearer ${data.data.token}`);
            window.location.href = '../admin/index.html';
        } catch (err) {
            alert(err.response.data.message);
        }
        
    }
})