const submit = document.getElementById('submit');
const token = localStorage.getItem('token');
const showOrganizations = document.getElementById('showOrganizations');

window.addEventListener('DOMContentLoaded',async()=>{
    try {
        loadOrgnaization();
        
    } catch (err) {
        console.log(err)
    }
    
})


submit.addEventListener('click',async(e)=>{
    e.preventDefault();
    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const village = document.getElementById('village').value;
        const taluka = document.getElementById('taluka').value;
        if(!name || !email || !password || !confirmPassword || !village || !taluka )throw new Error('please fill all fields')
        if(password.trim() != password)throw new Error('password can not have leading or trailing spaces!');
        if(password.length < 8)throw new Error('password must have atleast 8 characters!');
        if(password != confirmPassword)throw new Error('password did not match!');
        const data = await axios.post('/organization/api/',{name,email,password,village,taluka},{headers:{'Authorization':token}});
        console.log(data.data)
        document.getElementById('name').value="";
        document.getElementById('email').value="";
        document.getElementById('password').value="";
        document.getElementById('confirmPassword').value="";
        document.getElementById('village').value="";
        document.getElementById('taluka').value="";
        loadOrgnaization();
    } catch (err) {
        const message = err.response?.data.message? err.response.data.message:err.message;
        alert(message);
    }
    
}) 

function displayOrganizations(id ,name ){
    const div = document.createElement('div');
    div.innerHTML = `<h3 id="${id}">${name}</h3><button class="info">info</button> <button class="block">block</button>`;
    div.className = 'organization'
    showOrganizations.appendChild(div);
}

async function loadOrgnaization(){
    const data = await axios.get('/organization/api/',{headers:{'Authorization':token}});
        showOrganizations.innerHTML = ""
        data.data.organizations.forEach((o)=>{
            displayOrganizations(o.id ,o.name)
        })
}