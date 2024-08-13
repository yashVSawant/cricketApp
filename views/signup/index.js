
const signup = document.getElementById("signup");
const login = document.getElementById('login')

signup.addEventListener('click',async(e)=>{
    e.preventDefault()
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
            location.href = '../login/index.html';
        } catch (err) {
            alert(err.response.data.message);
        }
        
    }else{
        alert('please fill all fields')
    }
})

login.onclick = ()=>{
    location.href = '../login/index.html';
}